import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Event, NavigationEnd } from "@angular/router";
import { Store } from "@ngrx/store";
import { DxDataGridComponent, DxPopupComponent } from "devextreme-angular";
import { AppState, DashboardState, DashBoardMode } from "../state";
import { PopupService } from "../shared/popup/popup.service";
import { DashboardService } from "./services/dashboard.service";
import { WidgetComponentsService } from "./services/widgetComponents.service";
import { DashboardInfo, WidgetInfo, DashboardInfoUI, IProjectsWidgetParam } from "./model/interfaces";
import * as Utils from "../shared/utils";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DashboardDetailComponent } from "./dashboard-detail.component";
import { Observable, of } from "rxjs";
import { DashboardWidgetsComponent } from "./dashboard-widgets.component";
import { IWidget, IWidgetCommand, IWidgetViewParam } from "./model/interfaces";
import { WidgetCommands, DashboardGroup } from "./model/constants";
import { WidgetInjection } from "./model/widgetInjection";
import { MarkdownComponent } from "./widgets/markdown/markdown.component";
import { WelcomeComponent } from "./widgets/welcome/welcome.component";
import { BatteryChargeComponent } from "./widgets/batteryCharge/batteryCharge.component";
import { CalendarComponent } from "./widgets/calendar/calendar.component";
import { DxLookupModule, DxLookupComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { WidgetFactoryComponent } from "./widgets/widgetFactory.component";
import { noUndefined } from "@angular/compiler/src/util";
import lookup from "devextreme/ui/lookup";

@Component({
    templateUrl: "./dashboards.component.html",
    styleUrls: ["./dashboards.component.css"],
    entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
})
export class DashboardsComponent implements OnInit {
    @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;
    @ViewChild(DashboardWidgetsComponent) dashboardWidget: DashboardWidgetsComponent;
    @ViewChild(DxPopupComponent) popup: DxPopupComponent;
    @ViewChild(WidgetFactoryComponent) widgetFactory: WidgetFactoryComponent;
    @ViewChild(DxLookupComponent) lookUp: DxLookupComponent;
    dashboards: DashboardInfo[] = [];
    indicatorVisible: boolean = false;
    dashboardId: number=-1;
    state$: Observable<DashboardState>;
    widgetViewVisible: boolean = false;
    widget: WidgetInjection;
    width: number = 300;
    height: number = 250;
    width2: number = 300;
    height2: number = 250;
    viewStyle: string;
    mode: string = "show";
    class: string = "col-md-12";
    colWidth: number;
    rowHeight: number;
    dashboardCopyId: number = 0;
    dashboardsCopy: DashboardInfo[] = [];
    popupVisible: boolean = false;
    hintFavorite: string;
    initDashboard: number = -1;
    dataSource: any;
    favoritesIcon: string = "favorites";
   
    //    =============================================================================
    //     constructor
    //    =============================================================================
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private popSrv: PopupService,
        private dashSrv: DashboardService,
        private modalService: NgbModal,
        private srv: WidgetComponentsService
    ) {

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
            let currentDashboard: DashboardInfo = this.dashboards.find(d => d.id == this.dashboardId);
			if (currentDashboard != null && currentDashboard != undefined) {
				currentDashboard.isFavorite = !currentDashboard.isFavorite;
                //if (currentDashboard.isFavorite)
                //    currentDashboard.isFavorite = false;
                //else
                //    currentDashboard.isFavorite = true;
                this.dashSrv.saveDashboard(currentDashboard).subscribe(r => {
                    this.getDashboards(true);
                })
            }
           // this.mapDashboardsToUI();
        }
    }
   
    onDashboardChanged(data) {
        if (data.value.id != undefined) {
            this.setToStore(data.value.id, "show");
            let db: DashboardInfo = this.dashboards.find(d => d.id == data.value.id);
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
        let command: IWidgetCommand = event;
        if (command != null && command != undefined && command.componentName == "DashboardsComponent") {
            if (command.commandName == WidgetCommands.view) {
                let param: IWidgetViewParam = command.param;
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
                    })
                })
            }
            else if (command.commandName == WidgetCommands.config) {

                let param: IWidgetViewParam = command.param;
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
                    })
                })
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
                let param: IWidgetViewParam = command.param;
                this.widgetCopy(param.widgetId);
            }
            else if (command.commandName == WidgetCommands.saveProjectViewerState) {
                let param: IProjectsWidgetParam = command.param;

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
            let newWidget: WidgetInfo = s.dashboardState.widgetInfo;
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
    private setShowMode() {
        this.widgetViewVisible = false;
        this.store.subscribe(s => {
            this.mode = "show";
            this.class = "col-md-12";
            s.dashboardState.dashboardMode = "show";
            this.setToStore(s.dashboardState.dashboardId, s.dashboardState.dashboardMode);
            this.widget = null;
        });
    }

    private addDashboard(dashboardId: number) {
        const modalRef = this.modalService.open(DashboardDetailComponent, { windowClass: 'template-editor-modal' });
        modalRef.componentInstance.dashboardId = dashboardId;
        if (dashboardId > 0)
            modalRef.componentInstance.dashboard = this.getDashboard(dashboardId);

        modalRef.result.then((result: number) => {
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
        }, err => { Utils.errorMessage(err) });
    }

    private getDashboards(isInit: boolean): void {
        this.indicatorVisible = true;
        var promise = new Promise((resolve, reject) => {
            this.dashSrv.getDashboards().subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp: DashboardInfo[]) => {
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
    private setToStore(dashboardId: number, mode: string) {
        this.dashboardId = dashboardId;
        if (dashboardId > 0) {
            let db: DashboardInfo = this.getDashboard(dashboardId);
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidgets(dashboardId)
                    .subscribe(r => resolve(r), error => reject(error));
            });
            promise.then((r: WidgetInfo[]) => {
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
        })
    }
    //
    getDashboard(id: number): DashboardInfo {
        let result: DashboardInfo;
        result = this.dashboards.find(s => s.id == id);
        return result;
    }
    private widgetConfig(id: number): void {
        let widgets: WidgetInjection[] = [];
        if (id > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidgets(this.dashboardId).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp: WidgetInfo[]) => {

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
                })
            });
            promise.catch(err => {
                this.indicatorVisible = false;
                Utils.errorMessage(err.message);
            });
        }

    }
    private widgetConfigNew(id: number): void {
        if (id > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getInjectionWidget(id).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp: WidgetInjection) => {
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
                    })
                })
            });
            promise.catch(err => {
                this.indicatorVisible = false;
                Utils.errorMessage(err.message);
            });
        }
    }

    private widgetCopy(id: number): void {
        if (id > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getInjectionWidget(id).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp: WidgetInjection) => {
                this.widget = resp;
                this.mode = "copy";
                this.class = "col-md-9";
                this.store.subscribe(s => {
                    s.dashboardState.dashboardMode = "copy";
                    this.dashSrv.getWidget(id).subscribe(w => {
                        s.dashboardState.widgetInfo = w;

                        this.dashboardWidget.onWidgetConfig(this.widget);
                    })
                })
            });
            promise.catch(err => {
                this.indicatorVisible = false;
                Utils.errorMessage(err.message);
            });
        }
    }

    private setWidgetInjection(wdget: WidgetInfo) {
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


    private saveProjectState(param: IProjectsWidgetParam) {
        if (param.widgeId > 0) {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidget(param.widgeId).subscribe(resp => resolve(resp), error => reject(error));
            });
            promise.then((resp: WidgetInfo) => {
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
	private mapDashboardsToUI() {
		this.dashboards.sort((obj1, obj2) => {
			if (obj1.isFavorite ) {
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

    private setIcon(id) {
        let db: DashboardInfo = this.dashboards.find(d => d.id == id);
        if (db != undefined && db.isFavorite) {
			this.favoritesIcon = "glyphicon glyphicon-star";
			this.hintFavorite = "This panel is a favorite. Set it as not a favorite.";
        }
        else {
            this.favoritesIcon = "glyphicon glyphicon-star-empty";
			this.hintFavorite = "This panel is not a favorite. Set it as a favorite.";
        }      
    }
}

