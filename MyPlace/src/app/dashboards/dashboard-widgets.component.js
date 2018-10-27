var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import * as Utils from "../shared/utils";
import { WidgetContainerComponent } from "./widgets/widgetContainer.component";
import { WidgetCommands } from "./model/constants";
//  ==============================================================================
//  meta
//  ==============================================================================
let DashboardWidgetsComponent = class DashboardWidgetsComponent {
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(router, route, store, popSrv, dashSrv, widgetSrv) {
        this.router = router;
        this.route = route;
        this.store = store;
        this.popSrv = popSrv;
        this.dashSrv = dashSrv;
        this.widgetSrv = widgetSrv;
        this.filterRowVisible = false;
        this.indicatorVisible = false;
        this.mode = "show";
        this.widgetAdded = new EventEmitter();
        this.cancel = new EventEmitter();
        this.bubble = new EventEmitter();
        this.class = "col-md - 12";
        this.widgets = [];
        this.onContainerRefresh = new EventEmitter();
        this.onAddWidgetButtonClick = new EventEmitter();
        this.dashboards = [];
        this.dashboardCopyId = 0;
        this.init();
    }
    //    =============================================================================
    //      ng 
    //    =============================================================================
    ngOnInit() {
        this.dashSrv.getDashboards().subscribe(resp => this.dashboards = resp, error => Utils.errorMessage(error.message));
    }
    ngAfterViewChecked() {
        //this.setAddWidgetsContainerHeight();
        if (this.mode == "edit")
            this.setAddWidgetsGridHeight();
    }
    //    =============================================================================
    //      events handlers
    //    =============================================================================
    onAddWidget() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboardId;
            this.addWidget();
        }).unsubscribe();
    }
    onContentReady(e) {
    }
    onRefresh() {
        if (this.widgetContainer != null && this.widgetContainer != undefined) {
            this.widgetContainer.onRefresh();
        }
    }
    onCellPrepared(e) {
        if (e.rowType === "data" && e.column.command === "select") {
            e.cellElement.find(".dx-select-checkbox").dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }
        if (e.rowType === "data" && e.column.command === "edit" && e.data.failed) {
            e.cellElement.css("font-style", this.currentFontStyle);
            e.cellElement.css("color", this.currentColor);
        }
    }
    onEditorPreparing(e) {
        if (e.dataField === "comments") {
            e.editorName = "dxTextArea";
        }
        if (e.parentType === "filterRow") {
            e.editorOptions.height = undefined;
        }
    }
    onRowPrepared(e) {
        if (e.rowType === "data") {
        }
    }
    onSelectionChanged(e) {
        this.componentName = e.component.getSelectedRowsData()[0].componentName;
    }
    onWidgetEdit(e) {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboardId;
            this.mode = s.dashboardState.dashboardMode;
            this.cols = s.dashboardState.dashboard.columnsCount;
            this.init();
        });
    }
    onWidgetConfig(e) {
        this.store.subscribe(s => {
            this.mode = s.dashboardState.dashboardMode;
            this.class = "col-md-12";
        });
    }
    onEndEdit(e) {
        this.store.subscribe(s => {
            var promise = new Promise((resolve, reject) => {
                this.dashSrv.getWidgets(s.dashboardState.dashboardId)
                    .subscribe(r => resolve(r), error => reject(error));
            });
            promise.then((r) => {
                if (this.dashboardId < 0 || r.length > 0)
                    this.mode = "show";
                else
                    this.mode = "empty";
                s.dashboardState.dashboardMode = this.mode;
                this.class = "col-md-12";
                this.saveWidgets();
                this.onContainerRefresh.emit();
            });
            promise.catch(err => {
                Utils.errorMessage(err.message);
            });
        });
    }
    //
    onDashboardAddWidgets(e) {
        //this.store.subscribe(s => {
        //    this.mode = "edit";
        //    s.dashboardState.dashboardMode = "edit";
        //    this.dashboardId = s.dashboardState.dashboardId;
        //    this.class = "col-md-9";
        //});
        this.onAddWidgetButtonClick.emit();
    }
    onCancel() {
        this.cancel.emit();
    }
    //onSave(): void {
    //    this.store.subscribe(s => this.dashboardId = s.dashboardState.dashboardId);
    //    var promise = new Promise((resolve, reject) => {
    //        this.dashSrv.saveWidget(null, this.dashboardId)
    //            .subscribe(r => resolve(r), error => reject(error));
    //    });
    //    promise.then((r: number) => {
    //        this.widgetAdded.emit(r);
    //    });
    //    promise.catch(err => {
    //        Utils.errorMessage(err.message);
    //        this.cancel.emit(null);
    //    });
    //}
    onBubble(e) {
        let command = e;
        if (command != null && command != undefined && command.componentName == "DashboardWidgetsComponent") {
            if (command.commandName == WidgetCommands.config) {
                let param = command.param;
                this.setMode("config");
                this.store.subscribe(s => {
                    this.dashSrv.getWidgets(s.dashboardState.dashboardId).subscribe(d => s.dashboardState.widgetInfo = d.find(r => r.id == param.widgetId));
                });
            }
            else if (command.commandName == WidgetCommands.delete) {
                this.Refresh();
            }
            else if (command.commandName == WidgetCommands.refreshDashboardWidgets) {
                this.Refresh();
            }
        }
        else
            this.bubble.emit(e);
    }
    //    =============================================================================
    //       public methods
    //    =============================================================================  
    setMode(mode) {
        this.store.subscribe(s => {
            this.mode = mode;
            s.dashboardState.dashboardMode = mode;
        });
    }
    Refresh() {
        this.store.subscribe(s => {
            this.mode = s.dashboardState.dashboardMode;
            this.dashboardId = s.dashboardState.dashboardId;
            if (this.widgetContainer != null && this.widgetContainer != undefined)
                this.widgetContainer.Refresh();
        });
    }
    RefreshRowColWidgetContainer() {
        this.widgetContainer.RefreshRowCol();
    }
    saveWidgets() {
        this.widgetContainer.SaveWidgets();
    }
    //    =============================================================================
    //       private methods
    //    =============================================================================  
    //
    addWidget() {
        let widget = {
            columnSpan: 1, componentName: this.componentName,
            dashboardId: this.dashboardId, description: this.componentName, positionNumber: 1, rowSpan: 1, widgetProperties: null, id: 0
        };
        var promise = new Promise((resolve, reject) => {
            this.dashSrv.saveWidget(widget)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((r) => {
            if (this.widgetContainer != null && this.widgetContainer != undefined) {
                this.widgetContainer.onRefresh();
            }
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    init() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboardId;
            this.mode = s.dashboardState.dashboardMode;
            if (this.mode == "edit")
                this.class = "col-md-9";
            else
                this.class = "col-md-12";
            this.widgetSrv.getWidgetComponents().subscribe(s => {
                this.widgetComponents = s;
                if (this.widgetContainer != null && this.widgetContainer != undefined)
                    this.widgetContainer.Refresh();
            });
        });
    }
    setAddWidgetsGridHeight() {
        if (this.addWidgetsGrid && this.addWidgetsButton && this.addWidgetsHeader && this.addWidgetsContainer) {
            //var eContainer: HTMLElement = this.addWidgetsContainer.nativeElement;
            //var eHeader: HTMLElement = this.addWidgetsHeader.nativeElement;
            //var eButton: HTMLElement = this.addWidgetsButton.nativeElement;
            var h = this.addWidgetsContainer.nativeElement.offsetHeight -
                this.calcFullHeight(this.addWidgetsContainer, false, false, true, true) -
                this.calcFullHeight(this.addWidgetsHeader, true, true, false, true) -
                this.calcFullHeight(this.addWidgetsButton, true, true, false, true);
            //eContainer.offsetHeight - eHeader.offsetHeight - eButton.offsetHeight;
            //console.log("H1=" + h.toString());
            //var style = getComputedStyle(eContainer);
            //h -= parseInt(style.paddingTop.replace("px",""));
            //h -= parseInt(style.paddingBottom.replace("px", ""));
            //h -= parseInt(style.borderTopWidth.replace("px", ""));
            //h -= parseInt(style.borderBottomWidth.replace("px", ""));
            //console.log("eContainer");
            //console.log(style);
            //style = getComputedStyle(eHeader);
            //h -= parseInt(style.marginTop.replace("px", ""));
            //h -= parseInt(style.marginBottom.replace("px", ""));
            //h -= parseInt(style.borderTopWidth.replace("px", ""));
            //h -= parseInt(style.borderBottomWidth.replace("px", ""));
            //console.log("eHeader");
            //console.log(style);
            //style = getComputedStyle(eButton);
            //h -= parseInt(style.marginTop.replace("px", ""));
            //h -= parseInt(style.marginBottom.replace("px", ""));
            //h -= parseInt(style.borderTopWidth.replace("px", ""));
            //h -= parseInt(style.borderBottomWidth.replace("px", ""));
            //console.log("eButton");
            //console.log(style);
            //console.log("H2=" + h.toString());
            this.addWidgetsGrid.height = h;
            //this.addWidgetsGrid.searchPanel.width = 800; // eHeader.offsetWidth - 10;
        }
    }
    calcFullHeight(er, isHeight = true, isMargin = true, isPadding = true, isBorder = true) {
        var result = 0;
        var style = getComputedStyle(er.nativeElement);
        if (isHeight) {
            result += er.nativeElement.offsetHeight;
        }
        if (isMargin) {
            result += parseInt(style.marginTop.replace("px", ""));
            result += parseInt(style.marginBottom.replace("px", ""));
        }
        if (isPadding) {
            result += parseInt(style.paddingTop.replace("px", ""));
            result += parseInt(style.paddingBottom.replace("px", ""));
        }
        if (isBorder) {
            result += parseInt(style.borderTopWidth.replace("px", ""));
            result += parseInt(style.borderBottomWidth.replace("px", ""));
        }
        return result;
    }
    isSelectedWidgetRow(name) {
        return this.componentName == name;
    }
};
__decorate([
    ViewChild("addWidgetsGrid")
], DashboardWidgetsComponent.prototype, "addWidgetsGrid", void 0);
__decorate([
    ViewChild("addWidgetsHeader")
], DashboardWidgetsComponent.prototype, "addWidgetsHeader", void 0);
__decorate([
    ViewChild("addWidgetsButton")
], DashboardWidgetsComponent.prototype, "addWidgetsButton", void 0);
__decorate([
    ViewChild("addWidgetsContainer")
], DashboardWidgetsComponent.prototype, "addWidgetsContainer", void 0);
__decorate([
    ViewChild(WidgetContainerComponent)
], DashboardWidgetsComponent.prototype, "widgetContainer", void 0);
__decorate([
    Output()
], DashboardWidgetsComponent.prototype, "widgetAdded", void 0);
__decorate([
    Output()
], DashboardWidgetsComponent.prototype, "cancel", void 0);
__decorate([
    Output()
], DashboardWidgetsComponent.prototype, "bubble", void 0);
__decorate([
    Output()
], DashboardWidgetsComponent.prototype, "onContainerRefresh", void 0);
__decorate([
    Output()
], DashboardWidgetsComponent.prototype, "onAddWidgetButtonClick", void 0);
DashboardWidgetsComponent = __decorate([
    Component({
        selector: "app-dashboard-widgets",
        templateUrl: "./dashboard-widgets.component.html",
        styleUrls: ["./dashboard-widgets.component.css"]
    })
], DashboardWidgetsComponent);
export { DashboardWidgetsComponent };
//# sourceMappingURL=dashboard-widgets.component.js.map