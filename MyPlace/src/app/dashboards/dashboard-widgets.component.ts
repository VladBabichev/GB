import { Component, ViewChild, OnInit, AfterViewChecked, Output, EventEmitter, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, Event, NavigationEnd } from "@angular/router";
import { Store } from "@ngrx/store";
import { DxDataGridComponent } from "devextreme-angular";
import { PopupService } from "../shared/popup/popup.service";
import { WidgetInfo, IWidgetViewParam, DashboardInfo } from "./model/interfaces";
import * as Utils from "../shared/utils";
import { WidgetContainerComponent } from "./widgets/widgetContainer.component";
import { DashboardService } from "./services/dashboard.service";
import { Observable } from "rxjs";
import { AppState, DashboardState, DashBoardMode, DashBoardIdAction } from "../state";
import { WidgetComponentsService } from "./services/widgetComponents.service";
import { IWidgetComponent, IWidgetCommand } from "./model/interfaces"
import { WidgetCommands } from "./model/constants";


//  ==============================================================================
//  interfaces
//  ==============================================================================
interface ICellPreparedEvent {
    data: any;
    cellElement: any; // JQuery
    column: {
        command: string
    };
    rowType: string;
}
interface IEditorPreparingEvent {
    editorName: string;
    dataField: string;
    parentType: string;
    editorOptions: { height: number };
}
interface IRowPreparedEvent {
    data: any;
    rowElement: any; // JQuery
    rowType: string;
}
interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number[];
    selectedRowsData: any[];
}
interface ISearchPanel {
    name: string;
    fullName: string;
    value: string;
    previousValue: string;
}

//  ==============================================================================
//  meta
//  ==============================================================================
@Component({
    selector: "app-dashboard-widgets",
    templateUrl: "./dashboard-widgets.component.html",
    styleUrls: ["./dashboard-widgets.component.css"]
})
export class DashboardWidgetsComponent  implements OnInit, AfterViewChecked {
    //  ==============================================================================
    //  declarations
    //  ==============================================================================
    //@ViewChild(DxDataGridComponent) grid: DxDataGridComponent;
	@ViewChild("addWidgetsGrid") addWidgetsGrid: DxDataGridComponent;
	@ViewChild("addWidgetsHeader") addWidgetsHeader: ElementRef;
	@ViewChild("addWidgetsButton") addWidgetsButton: ElementRef;
	@ViewChild("addWidgetsContainer") addWidgetsContainer: ElementRef;
    @ViewChild(WidgetContainerComponent) widgetContainer: WidgetContainerComponent;
    widgetComponents: IWidgetComponent[];
    filterRowVisible = false;
    currentFontStyle: any;
    currentColor: any;
    saleAmountHeaderFilter: any;
    applyFilterTypes: any;
    currentFilter: any;
    showFilterRow: boolean;
    showHeaderFilter: boolean;
    clickTimer: any;
    lastRowCLickedId: any;
    indicatorVisible: boolean = false;
    dashboardId: number;
    cols: number;
    mode: string = "show";
    currentWidget: WidgetInfo;
    @Output() widgetAdded = new EventEmitter<number>();
    @Output() cancel = new EventEmitter();
    @Output() bubble = new EventEmitter<IWidgetCommand>();
    state$: Observable<DashboardState>;
    componentName: string;
    class: string = "col-md - 12";
    widgets: WidgetInfo[] = [];
	@Output() onContainerRefresh = new EventEmitter();
	@Output() onAddWidgetButtonClick = new EventEmitter();
    dashboards: DashboardInfo[] = [];
    dashboardCopyId: number = 0;

    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private popSrv: PopupService,
        private dashSrv: DashboardService,
        private widgetSrv: WidgetComponentsService
    ) {
        this.init();
    }

    //    =============================================================================
    //      ng 
    //    =============================================================================
    ngOnInit() {
        this.dashSrv.getDashboards().subscribe(resp => this.dashboards = resp,
            error => Utils.errorMessage(error.message));
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

    onContentReady(e): void {

    }

    onRefresh(): void {
        if (this.widgetContainer != null && this.widgetContainer != undefined) {
            this.widgetContainer.onRefresh();
        }
    }

    onCellPrepared(e: ICellPreparedEvent): void {
        if (e.rowType === "data" && e.column.command === "select") {
            e.cellElement.find(".dx-select-checkbox").dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }

        if (e.rowType === "data" && e.column.command === "edit" && e.data.failed) {
            e.cellElement.css("font-style", this.currentFontStyle);
            e.cellElement.css("color", this.currentColor);
        }
    }

    onEditorPreparing(e: IEditorPreparingEvent): void {
        if (e.dataField === "comments") {
            e.editorName = "dxTextArea";
        }

        if (e.parentType === "filterRow") {
            e.editorOptions.height = undefined;
        }
    }

    onRowPrepared(e: IRowPreparedEvent): void {
        if (e.rowType === "data") {

        }
    }

	onSelectionChanged(e: ISelectionChangedEvent): void {
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
            promise.then((r: WidgetInfo[]) => {
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

    onCancel(): void {
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
        let command: IWidgetCommand = e;
        if (command != null && command != undefined && command.componentName == "DashboardWidgetsComponent") {
            if (command.commandName == WidgetCommands.config) {
                let param: IWidgetViewParam = command.param;
                this.setMode("config");
                this.store.subscribe(s => {
                    this.dashSrv.getWidgets(s.dashboardState.dashboardId).subscribe(d => s.dashboardState.widgetInfo = d.find(r => r.id == param.widgetId));
                }
                )
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
    public setMode(mode: string) {
        this.store.subscribe(s => {
            this.mode = mode;
            s.dashboardState.dashboardMode = mode;
        })
    }

    public Refresh() {
        this.store.subscribe(s => {
            this.mode = s.dashboardState.dashboardMode;
            this.dashboardId = s.dashboardState.dashboardId;
            if (this.widgetContainer != null && this.widgetContainer != undefined)
                this.widgetContainer.Refresh();
        })
    }

    public RefreshRowColWidgetContainer() {
        this.widgetContainer.RefreshRowCol();
    }
    public saveWidgets() {
        this.widgetContainer.SaveWidgets();
    }
    //    =============================================================================
    //       private methods
    //    =============================================================================  

    //

    private addWidget() {
        let widget: WidgetInfo = {
            columnSpan: 1, componentName: this.componentName,
            dashboardId: this.dashboardId, description:
                this.componentName, positionNumber: 1, rowSpan: 1, widgetProperties: null, id: 0
        }
        var promise = new Promise((resolve, reject) => {
            this.dashSrv.saveWidget(widget)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((r: number) => {
            if (this.widgetContainer != null && this.widgetContainer != undefined) {
                this.widgetContainer.onRefresh();
            }
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    private init() {
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

        })
	}

	private setAddWidgetsGridHeight() {
		if (this.addWidgetsGrid && this.addWidgetsButton && this.addWidgetsHeader && this.addWidgetsContainer) {

			//var eContainer: HTMLElement = this.addWidgetsContainer.nativeElement;
			//var eHeader: HTMLElement = this.addWidgetsHeader.nativeElement;
			//var eButton: HTMLElement = this.addWidgetsButton.nativeElement;

			var h: number = this.addWidgetsContainer.nativeElement.offsetHeight -
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

	calcFullHeight(er: ElementRef, isHeight: boolean = true, isMargin: boolean = true, isPadding: boolean = true, isBorder: boolean = true): number {
		var result: number = 0;
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

	isSelectedWidgetRow(name: string): boolean {
		return this.componentName == name;
	}
}
