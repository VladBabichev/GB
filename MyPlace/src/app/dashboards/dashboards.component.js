var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ViewChild } from "@angular/core";
import { NavigationEnd } from "@angular/router";
import { DxDataGridComponent, DxPopupComponent } from "devextreme-angular";
import * as Utils from "../shared/utils";
import { DashboardDetailComponent } from "./dashboard-detail.component";
import { DashboardWidgetsComponent } from "./dashboard-widgets.component";
import { WidgetCommands } from "./model/constants";
import { WidgetInjection } from "./model/widgetInjection";
import { MarkdownComponent } from "./widgets/markdown/markdown.component";
import { WelcomeComponent } from "./widgets/welcome/welcome.component";
import { BatteryChargeComponent } from "./widgets/batteryCharge/batteryCharge.component";
import { CalendarComponent } from "./widgets/calendar/calendar.component";
import { DxLookupComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { WidgetFactoryComponent } from "./widgets/widgetFactory.component";
let DashboardsComponent = class DashboardsComponent {
    //    =============================================================================
    //     constructor
    //    =============================================================================
    constructor(router, route, store, popSrv, dashSrv, modalService, srv) {
        this.router = router;
        this.route = route;
        this.store = store;
        this.popSrv = popSrv;
        this.dashSrv = dashSrv;
        this.modalService = modalService;
        this.srv = srv;
        this.dashboards = [];
        this.indicatorVisible = false;
        this.dashboardId = -1;
        this.widgetViewVisible = false;
        this.width = 300;
        this.height = 250;
        this.width2 = 300;
        this.height2 = 250;
        this.mode = "show";
        this.class = "col-md-12";
        this.dashboardCopyId = 0;
        this.dashboardsCopy = [];
        this.popupVisible = false;
        this.initDashboard = -1;
        this.favoritesIcon = "favorites";
        this.init();
    }
    //    =============================================================================
    //      ng 
    //    =============================================================================
    ngOnInit() {
        this.getDashboards(true);
    }
    //    =============================================================================
    //      events handlers
    //    =============================================================================
    onFavorites(e) {
        if (this.dashboardId > 0) {
            let currentDashboard = this.dashboards.find(d => d.id == this.dashboardId);
            if (currentDashboard != null && currentDashboard != undefined) {
                currentDashboard.isFavorite = !currentDashboard.isFavorite;
                //if (currentDashboard.isFavorite)
                //    currentDashboard.isFavorite = false;
                //else
                //    currentDashboard.isFavorite = true;
                this.dashSrv.saveDashboard(currentDashboard).subscribe(r => {
                    this.getDashboards(true);
                });
            }
            // this.mapDashboardsToUI();
        }
    }
    onDashboardChanged(data) {
        if (data.value.id != undefined) {
            this.setToStore(data.value.id, "show");
            let db = this.dashboards.find(d => d.id == data.value.id);
            if (db != undefined && db.isFavorite) {
                this.favoritesIcon = "favorites";
                this.hintFavorite = "favorites";
            }
            else {
                this.favoritesIcon = "glyphicon glyphicon-star-empty";
                this.hintFavorite = "not favorites";
            }
        }
    }
    onDeleteDashboard() {
        this.dashSrv.deleteDashboard(this.dashboardId).subscribe(s => this.getDashboards(true));
    }
    onAddDashboard() {
        this.addDashboard(0);
    }
    onEditDashboard() {
        this.addDashboard(this.dashboardId);
    }
    onDashboardWidgetsEdit(e) {
        this.store.subscribe(s => {
            this.mode = "edit";
            s.dashboardState.dashboardMode = "edit";
            this.dashboardWidget.onWidgetEdit(e);
        });
    }
    onRefresh() {
        this.store.subscribe(s => {
            //this.setToStore(s.dashboardState.dashboardId, s.dashboardState.dashboardMode);
            this.getDashboards(false);
        });
    }
    onContainerRefresh() {
        this.dashboardWidget.Refresh();
    }
    onBubble(event) {
        //console.log(event);
        //alert("saveProjectViewerState_____");
        let command = event;
        if (command != null && command != undefined && command.componentName == "DashboardsComponent") {
            if (command.commandName == WidgetCommands.view) {
                let param = command.param;
                //this.widgetViewVisible = true;
                this.width = param.clientWidth;
                this.height = param.clientHeight;
                this.width2 = -param.clientWidth / 2;
                this.height2 = -param.clientHeight / 2;
                //this.widgetConfig(param.widgetId);
            }
            else if (command.commandName == WidgetCommands.show) {
                this.setShowMode();
                this.dashboardWidget.Refresh();
            }
            else if (command.commandName == WidgetCommands.refreshWidgetView) {
                this.onWidgetViewRefresh();
            }
            else if (command.commandName == WidgetCommands.refreshDashboardWidgets) {
                // this.dashboardWidget.Refresh();
                this.store.subscribe(s => {
                    this.dashSrv.getInjectionWidget(s.dashboardState.widgetInfo.id).subscribe(w => {
                        this.widgetFactory.header = s.dashboardState.widgetInfo.description;
                        this.width = this.colWidth * s.dashboardState.widgetInfo.columnSpan;
                        this.height = this.rowHeight * s.dashboardState.widgetInfo.rowSpan;
                    });
                });
            }
            else if (command.commandName == WidgetCommands.config) {
                let param = command.param;
                this.width = param.clientWidth;
                this.height = param.clientHeight;
                this.widgetConfig(param.widgetId);
            }
            else if (command.commandName == WidgetCommands.rowColSpanChanges) {
                this.store.subscribe(s => {
                    this.dashSrv.getInjectionWidget(s.dashboardState.widgetInfo.id).subscribe(w => {
                        this.widgetFactory.header = s.dashboardState.widgetInfo.description;
                        this.width = this.colWidth * s.dashboardState.widgetInfo.columnSpan;
                        this.height = this.rowHeight * s.dashboardState.widgetInfo.rowSpan;
                    });
                });
                this.dashboardWidget.RefreshRowColWidgetContainer();
            }
            else if (command.commandName == WidgetCommands.saveWidgets) {
                this.dashboardWidget.saveWidgets();
                this.widgetViewVisible = false;
                //if (this.widgetFactory != null && this.widgetFactory != undefined)
                //    this.widgetFactory.onDestroy();
                this.setShowMode();
                this.onRefresh();
            }
            else if (command.commandName == WidgetCommands.copyWidget) {
                let param = command.param;
                this.widgetCopy(param.widgetId);
            }
            else if (command.commandName == WidgetCommands.saveProjectViewerState) {
                let param = command.param;
                this.saveProjectState(param);
            }
        }
    }
    onWidgetViewRefresh() {
        this.store.subscribe(s => {
            this.width = this.colWidth * s.dashboardState.widgetInfo.columnSpan;
            this.height = this.rowHeight * s.dashboardState.widgetInfo.rowSpan;
            //this.width2 = -this.colWidth / 2;
            //this.height2 = -this.rowHeight / 2;                   
        });
    }
    onDashboardValueChanged2(e) {
        this.dashboardCopyId = e.value;
    }
    onCopy(e) {
        this.store.subscribe(s => {
            let newWidget = s.dashboardState.widgetInfo;
            newWidget.id = 0;
            newWidget.dashboardId = this.dashboardCopyId;
            this.dashSrv.saveWidget(newWidget).subscribe(r => r);
            this.onCancelCopy(e);
            this.onRefresh();
        });
    }
    onCancelCopy(e) {
        this.mode = "show";
        this.store.subscribe(s => {
            s.dashboardState.dashboardMode = this.mode;
            this.class = "col-md-12";
        });
    }
    //    =============================================================================
    //       private methods
    //    =============================================================================
    setShowMode() {
        this.widgetViewVisible = false;
        this.store.subscribe(s => {
            this.mode = "show";
            this.class = "col-md-12";
            s.dashboardState.dashboardMode = "show";
            this.setToStore(s.dashboardState.dashboardId, s.dashboardState.dashboardMode);
            this.widget = null;
        });
    }
    addDashboard(dashboardId) {
        const modalRef = this.modalService.open(DashboardDetailComponent, { windowClass: 'template-editor-modal' });
        modalRef.componentInstance.dashboardId = dashboardId;
        if (dashboardId > 0)
            modalRef.componentInstance.dashboard = this.getDashboard(dashboardId);
        modalRef.result.then((result) => {
            if (result == -1) {
                this.store.subscribe(d => {
                    this.dashboardId = d.dashboardState.dashboardId;
                    this.initDashboard = this.dashboardId;
                    this.lookUp.value = this.initDashboard;
                });
            }
            else {
                this.dashboardId = result;
                this.store.subscribe(s => {
                    s.dashboardState.dashboardId = result;
                    this.initDashboard = this.dashboardId;
                    this.lookUp.value = this.initDashboard;
                    this.getDashboards(false);
                });
            }
        }, err => { Utils.errorMessage(err); });
    }
    getDashboards(isInit) {
        this.indicatorVisible = true;
        var promise = new Promise((resolve, reject) => {
            this.dashSrv.getDashboards().subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp) => {
            this.indicatorVisible = false;
            this.dashboards = resp;
            this.dashboardsCopy = resp;
            if (this.dashboards.length > 0 && isInit) {
                this.dashboardId = this.dashboards[0].id;
                this.initDashboard = this.dashboardId;
            }
            if (this.dashboards.length == 0) {
                this.dashboardId = -1;
            }
            this.mapDashboardsToUI();
            this.setToStore(this.dashboardId, "show");
        });
        promise.catch(err => {
            this.indicatorVisible = false;
            Utils.errorMessage(err.message);
        });
    }
    //
    setToStore(dashboardId, mode) {
        this.dashboardId = dashboardId;
        if (dashboardId > 0) {
            let db = this.getDashboard(dashboardId);
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidgets(dashboardId)
                    .subscribe(r => resolve(r), error => reject(error));
            });
            promise.then((r) => {
                this.store.subscribe(s => {
                    s.dashboardState.dashboardId = dashboardId;
                    if (dashboardId > 0 && r.length == 0) {
                        mode = "empty";
                    }
                    s.dashboardState.dashboardMode = mode;
                    s.dashboardState.dashboard = db;
                    this.dashboardWidget.setMode(mode);
                    this.dashboardWidget.Refresh();
                    //this.router.navigate(["dashboardWidgets"]); 
                    this.setIcon(dashboardId);
                });
            });
            promise.catch(err => {
                Utils.errorMessage(err.message);
            });
        }
        else {
            this.store.subscribe(s => {
                s.dashboardState.dashboardMode = "show";
                this.mode = "show";
                this.class = "col-md-12";
                this.dashboardWidget.Refresh();
                this.dashboardWidget.mode = "show";
                //this.dashboardWidget.setMode(this.mode);
            });
        }
    }
    //
    dispathDashboard() {
        this.store.subscribe(s => {
            s.dashboardState.dashboardId = this.dashboardId;
        });
    }
    //
    init() {
        // constructor body
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                // trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
                // if you need to scroll back to top, here is the right place
                window.scrollTo(0, 0);
            }
        });
        //      
        this.store.subscribe(s => {
            this.mode = "show";
            s.dashboardState.dashboardMode = "show";
        });
    }
    //
    getDashboard(id) {
        let result;
        result = this.dashboards.find(s => s.id == id);
        return result;
    }
    widgetConfig(id) {
        let widgets = [];
        if (id > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidgets(this.dashboardId).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp) => {
                widgets = resp.map(info => new WidgetInjection({
                    componentName: {
                        key: WidgetInjection.metadata.COMPONENTNAME,
                        value: info.componentName
                    },
                    columnSpan: {
                        key: WidgetInjection.metadata.COLUMNSPAN,
                        value: info.columnSpan
                    },
                    dashboardId: {
                        key: WidgetInjection.metadata.DASHBOARDID,
                        value: info.dashboardId
                    },
                    description: {
                        key: WidgetInjection.metadata.DESCRIPTION,
                        value: info.description
                    },
                    positionNumber: {
                        key: WidgetInjection.metadata.POSITIONNUMBER,
                        value: info.positionNumber
                    },
                    widgetProperties: {
                        key: WidgetInjection.metadata.WIDGETPROPERTIES,
                        value: info.widgetProperties
                    },
                    rowSpan: {
                        key: WidgetInjection.metadata.ROWSPAN,
                        value: info.rowSpan
                    },
                    id: {
                        key: WidgetInjection.metadata.ID,
                        value: info.id
                    }
                }, this.srv.getComponent(info.componentName)));
                this.widget = widgets.find(s => s.input.id.value == id);
                this.widgetViewVisible = true;
                this.mode = "config";
                this.class = "col-md-9";
                this.store.subscribe(s => {
                    s.dashboardState.dashboardMode = "config";
                    s.dashboardState.widgetInfo = resp.find(s => s.id == id);
                    this.colWidth = this.width / s.dashboardState.widgetInfo.columnSpan;
                    this.rowHeight = this.height / s.dashboardState.widgetInfo.rowSpan;
                    //
                    this.dashboardWidget.onWidgetConfig(this.widget);
                });
            });
            promise.catch(err => {
                this.indicatorVisible = false;
                Utils.errorMessage(err.message);
            });
        }
    }
    widgetConfigNew(id) {
        if (id > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getInjectionWidget(id).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp) => {
                this.widget = resp;
                this.mode = "config";
                this.class = "col-md-9";
                this.store.subscribe(s => {
                    s.dashboardState.dashboardMode = "config";
                    this.dashSrv.getWidget(id).subscribe(w => {
                        s.dashboardState.widgetInfo = w;
                        this.colWidth = this.width / s.dashboardState.widgetInfo.columnSpan;
                        this.rowHeight = this.height / s.dashboardState.widgetInfo.rowSpan;
                        //
                        this.dashboardWidget.onWidgetConfig(this.widget);
                    });
                });
            });
            promise.catch(err => {
                this.indicatorVisible = false;
                Utils.errorMessage(err.message);
            });
        }
    }
    widgetCopy(id) {
        if (id > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getInjectionWidget(id).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp) => {
                this.widget = resp;
                this.mode = "copy";
                this.class = "col-md-9";
                this.store.subscribe(s => {
                    s.dashboardState.dashboardMode = "copy";
                    this.dashSrv.getWidget(id).subscribe(w => {
                        s.dashboardState.widgetInfo = w;
                        this.dashboardWidget.onWidgetConfig(this.widget);
                    });
                });
            });
            promise.catch(err => {
                this.indicatorVisible = false;
                Utils.errorMessage(err.message);
            });
        }
    }
    setWidgetInjection(wdget) {
        this.widget = new WidgetInjection({
            componentName: {
                key: WidgetInjection.metadata.COMPONENTNAME,
                value: wdget.componentName
            },
            columnSpan: {
                key: WidgetInjection.metadata.COLUMNSPAN,
                value: wdget.columnSpan
            },
            dashboardId: {
                key: WidgetInjection.metadata.DASHBOARDID,
                value: wdget.dashboardId
            },
            description: {
                key: WidgetInjection.metadata.DESCRIPTION,
                value: wdget.description
            },
            positionNumber: {
                key: WidgetInjection.metadata.POSITIONNUMBER,
                value: wdget.positionNumber
            },
            widgetProperties: {
                key: WidgetInjection.metadata.WIDGETPROPERTIES,
                value: wdget.widgetProperties
            },
            rowSpan: {
                key: WidgetInjection.metadata.ROWSPAN,
                value: wdget.rowSpan
            },
            id: {
                key: WidgetInjection.metadata.ID,
                value: wdget.id
            }
        }, this.srv.getComponent(wdget.componentName));
        this.widgetViewVisible = true;
    }
    saveProjectState(param) {
        if (param.widgeId > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidget(param.widgeId).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp) => {
                resp.widgetProperties = param.param;
                this.dashSrv.saveWidget(resp).subscribe(result => {
                    //this.onRefresh();
                }, Error => Utils.errorMessage(Error.message));
            });
            promise.catch(err => {
                Utils.errorMessage(err.message);
            });
        }
    }
    //private mapDashboardsToUI() {
    //	this.dashboards.sort((obj1, obj2) => {
    //		if (obj1.isFavorite) {
    //			return 1;
    //		}
    //		if (!obj1.isFavorite) {
    //			return -1;
    //		}
    //		return 0;
    //	})
    //		this.dataSource = new DataSource({
    //	store: new ArrayStore({
    //		data: this.dashboards,
    //		key: "id",
    //	})
    //});
    //this.initDashboard = this.dashboardId;
    //	}
    mapDashboardsToUI() {
        this.dashboards.sort((obj1, obj2) => {
            if (obj1.isFavorite) {
                return -1;
            }
            if (obj2.isFavorite) {
                return 1;
            }
            if (obj1.name.toUpperCase() > obj2.name.toUpperCase()) {
                return 1;
            }
            if (obj1.name.toUpperCase() < obj2.name.toUpperCase()) {
                return -1;
            }
            return 0;
        });
        this.dataSource = new DataSource({
            store: new ArrayStore({
                data: this.dashboards,
                key: "id",
            })
        });
        this.initDashboard = this.dashboardId;
    }
    setIcon(id) {
        let db = this.dashboards.find(d => d.id == id);
        if (db != undefined && db.isFavorite) {
            this.favoritesIcon = "glyphicon glyphicon-star";
            this.hintFavorite = "This panel is a favorite. Set it as not a favorite.";
        }
        else {
            this.favoritesIcon = "glyphicon glyphicon-star-empty";
            this.hintFavorite = "This panel is not a favorite. Set it as a favorite.";
        }
    }
};
__decorate([
    ViewChild(DxDataGridComponent)
], DashboardsComponent.prototype, "grid", void 0);
__decorate([
    ViewChild(DashboardWidgetsComponent)
], DashboardsComponent.prototype, "dashboardWidget", void 0);
__decorate([
    ViewChild(DxPopupComponent)
], DashboardsComponent.prototype, "popup", void 0);
__decorate([
    ViewChild(WidgetFactoryComponent)
], DashboardsComponent.prototype, "widgetFactory", void 0);
__decorate([
    ViewChild(DxLookupComponent)
], DashboardsComponent.prototype, "lookUp", void 0);
DashboardsComponent = __decorate([
    Component({
        templateUrl: "./dashboards.component.html",
        styleUrls: ["./dashboards.component.css"],
        entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
    })
], DashboardsComponent);
export { DashboardsComponent };
//# sourceMappingURL=dashboards.component.js.map