import {
	Component, OnInit, AfterViewChecked, InjectionToken, Input, ViewChild,
	ViewChildren, QueryList, Output, EventEmitter, ElementRef 
} from '@angular/core';
import { WidgetInjection } from '../model/widgetInjection';
import { WidgetComponentsService } from '../services/widgetComponents.service';
import { WidgetFactoryComponent } from "../widgets/widgetFactory.component";
//import { ObservableMedia, MediaChange,MockMediaQueryList } from '@angular/flex-layout';

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/startWith';
import { MarkdownComponent } from '../widgets/markdown/markdown.component';
import { WelcomeComponent } from '../widgets/welcome/welcome.component';
import { BatteryChargeComponent } from '../widgets/batteryCharge/batteryCharge.component';
import { CalendarComponent } from '../widgets/calendar/calendar.component';
import { WidgetInfo, IWidgetCommand, IWidgetDragParam } from '../model/interfaces';
import { Store } from "@ngrx/store";
import { AppState } from "../../../app/state";
import { DashboardService } from "../services/dashboard.service";
import * as Utils from "../../shared/utils";
import { WidgetCommands, WidgetMode } from "../model/constants";
import { AfterContentInit } from '@angular/core';
import { MatGridList } from '@angular/material';
import { Command, CommandName } from 'selenium-webdriver';
import { Observable, of } from 'rxjs';
import { BatteryChargeConfigComponent } from './batteryCharge/batteryChargeConfig.component';
import { forEach } from '@angular/router/src/utils/collection';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular';
@Component({
    selector: 'app-widgetContainer',
    templateUrl: './widgetContainer.component.html',
    styleUrls: ['./widgetContainer.component.css'],
    entryComponents: [MarkdownComponent,
        WelcomeComponent,
        BatteryChargeComponent,
        CalendarComponent,
        BatteryChargeConfigComponent]
})

export class WidgetContainerComponent implements OnInit, AfterViewChecked {
    //  ==============================================================================
    //  declarations
    //  ==============================================================================
	@ViewChild("container") myContainer: ElementRef;
	@ViewChild(DxScrollViewComponent) scrollView: DxScrollViewComponent;
    widgets: WidgetInjection[] = [];
    cols_big: number = 1;
    cols_sml: number = 3;
    selectedWidget: WidgetInjection;
    @Input() dashboardId: number;
    @Input() cols: number = 10;
    rowHeight: number = 400;
    @ViewChild(WidgetFactoryComponent) widgetFactory: WidgetFactoryComponent;
    @ViewChildren(WidgetFactoryComponent) components: QueryList<WidgetFactoryComponent>;
    @ViewChild(MatGridList) grid: MatGridList;
    isMainMenuVisible: boolean = false;
    isMenuVisible: boolean = false;
    @Output() editWidget = new EventEmitter<WidgetInjection>();
    @Output() bubble = new EventEmitter<WidgetCommands>();
    indicatorVisible: boolean;
    mode: string = "show";
    currentWidget: any;
    isDragstart: boolean = false;
    dragStartWidget: any;
    dargEndWidget: any;
    draggable: boolean = false;
    styleBackground: string = "white";
    styleBackgroundGrid: string = "white";
    styleWidgetBorder: string = "thin";
    bordeColor: "black";
	styleBorderWidth: string = "1px";
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================

    constructor(private widgetService: WidgetComponentsService,
        private store: Store<AppState>,
        private dashSrv: DashboardService
        //private observableMedia: ObservableMedia
    ) {
        this.init();
    }

    //  ==============================================================================
    //  ng
    //  ==============================================================================
    ngOnInit() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboardId;
            this.getWidgets();
            this.mode = s.dashboardState.dashboardMode;
        })
	}

	ngAfterViewChecked() {
		this.setHeight();
	}

    //  ==============================================================================
    //  events handlers
    //  ==============================================================================
    onRefresh() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboardId;
            this.mode = s.dashboardState.dashboardMode;
            if (this.mode == "show")
                this.draggable = false;
            this.getWidgets();
        })

    }
    onSelection(e, v) {
        this.selectedWidget = v.selected.map(item => item.value);
        //console.error(e.option.selected, v);
    }

    onMouseOver(event, v) {
        this.components.forEach((x) => {
            if (x.componentId.value != v.input.id.value)
                x.setMenuVisible(false);
        });
        this.widgetFactory = this.components.find(r => r.componentId.value == v.input.id.value);
        if (this.widgetFactory != null && this.widgetFactory != undefined) {
            this.widgetFactory.onMouseOver(v, this.isDragstart, this.dragStartWidget);
            this.isDragstart = false;
        }
    }
    onMouseLeave(event, v) {
        this.isMainMenuVisible = false;
        this.widgetFactory = this.components.find(r => r.componentId.value == v.input.id.value);
        if (this.widgetFactory != null && this.widgetFactory != undefined) {
            this.widgetFactory.onMouseLeave(event, v);
        }
    }

    onWidgetEdit(e) {
        this.editWidget.emit(e);
    }

    onChildrenRefresh(e) {
        this.bubble.emit(e);
	}
	
	onInitialized(e) {
	}

	onUpdated(e) {
		//this.setHeight();
	}

    onResize(event) {
    }

    onMouseUp(event, v) {
   }

    onBubble(event) {

        let command: IWidgetCommand = event;
        if (command.commandName == WidgetCommands.config)
            this.draggable = true;

        if (command != null && command != undefined && command.componentName != "WidgetContainerComponent") {
            this.bubble.emit(event);
        }
        else {
            if (command.commandName == WidgetCommands.refreshAfterDrag) {
                let param: IWidgetDragParam = command.param;
                let posTo = this.widgets.find(f => f.input.id.value == param.widgetToId).input.positionNumber.value;
                let posFrom = this.widgets.find(f => f.input.id.value == param.widgetFromId).input.positionNumber.value;

                if (posFrom > posTo)
                    this.dragDropBack(param);
                else
                    this.dragDropForward(param);
            }
        }
    }

    //  ==============================================================================
    //  public methods
    //  ==============================================================================
    public SaveWidgets() {
        this.draggable = false;
        this.store.subscribe(s => this.widgetFactory.SaveWidget(s.dashboardState.widgetInfo));

        let result: WidgetInfo[] = this.widgets.map(r => <WidgetInfo>{
            columnSpan: r.input.columnSpan.value,
            componentName: r.input.componentName.value,
            dashboardId: r.input.dashboardId.value,
            description: r.input.description.value,
            id: r.input.id.value,
            positionNumber: r.input.positionNumber.value,
            rowSpan: r.input.rowSpan.value,
            widgetProperties: r.input.widgetProperties.value
        });
        //alert();
        this.dashSrv.saveWidgets({ dashboardId: this.dashboardId, widgetInfo: result }).subscribe(r => r);
    }

    public RefreshRowCol() {
        this.store.subscribe(s => {
            this.updateWidget(s.dashboardState.widgetInfo).subscribe(s => s);
        })
    }
    public Refresh() {
        this.store.subscribe(s => {
            this.dashSrv.getDashboardDefaults().subscribe(d => {
                this.cols = d.cols;
                this.rowHeight = d.rowHeight;
                if (s.dashboardState.dashboard != null && s.dashboardState.dashboard != undefined) {
                    if (s.dashboardState.dashboard.columnsCount > 0)
                        this.cols = s.dashboardState.dashboard.columnsCount;

                    if (s.dashboardState.dashboard.rowHeight != null && s.dashboardState.dashboard.rowHeight > 0)
                        this.rowHeight = s.dashboardState.dashboard.rowHeight;
                }
                this.dashboardId = s.dashboardState.dashboardId;
                this.mode = s.dashboardState.dashboardMode;
                if (this.mode == "show" || this.mode == "empty")
                    this.draggable = false;
                else
                    this.draggable = true;

                this.getWidgets();
            })
        })
	}

    //  ==============================================================================
    //  private methods
    //  ==============================================================================

	private setHeight() {
		if (this.myContainer) {
			var r = this.myContainer.nativeElement.getBoundingClientRect();
			var e: HTMLElement = document.documentElement
			var h: number = e.clientHeight - r.top - window.pageYOffset - 10;
			var newHeight: string = h.toString() + "px";

			if (this.scrollView.height != newHeight)
				this.scrollView.height = newHeight;
		}
	}

    // Drag&Drop
    private dragDropBack(param: IWidgetDragParam) {
        let newPos = this.widgets.find(f => f.input.id.value == param.widgetToId).input.positionNumber.value;
        this.widgets.filter(f => f.input.id.value == param.widgetFromId).map(m => m.input.positionNumber.value = newPos);

        this.widgets.sort((obj1, obj2) => {
            if (obj1.input.positionNumber.value > obj2.input.positionNumber.value) {
                return 1;
            }
            if (obj1.input.positionNumber.value < obj2.input.positionNumber.value) {
                return -1;
            }
            return 0;
        }).filter(f => f.input.positionNumber.value >= newPos && f.input.id.value != param.widgetFromId).map(m => {
            newPos = newPos + 1;
            m.input.positionNumber.value = newPos;
            // alert(m.input.id.value);
        });

        this.widgets = this.widgets.sort((obj1, obj2) => {
            if (obj1.input.positionNumber.value > obj2.input.positionNumber.value) {
                return 1;
            }
            if (obj1.input.positionNumber.value < obj2.input.positionNumber.value) {
                return -1;
            }
            return 0;
        });
    }

    private dragDropForward(param: IWidgetDragParam) {
        let newPos = this.widgets.find(f => f.input.id.value == param.widgetToId).input.positionNumber.value;
        this.widgets.filter(f => f.input.id.value == param.widgetFromId).map(m => m.input.positionNumber.value = newPos);

        this.widgets.sort((obj1, obj2) => {
            if (obj1.input.positionNumber.value > obj2.input.positionNumber.value) {
                return 1;
            }
            if (obj1.input.positionNumber.value < obj2.input.positionNumber.value) {
                return -1;
            }
            return 0;
        }).filter(f => f.input.positionNumber.value <= newPos && f.input.id.value != param.widgetFromId).map(m => {
            newPos = newPos - 1;
            m.input.positionNumber.value = newPos;
        });

        this.widgets = this.widgets.sort((obj1, obj2) => {
            if (obj1.input.positionNumber.value > obj2.input.positionNumber.value) {
                return 1;
            }
            if (obj1.input.positionNumber.value < obj2.input.positionNumber.value) {
                return -1;
            }
            return 0;
        });
    }

    private init() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboardId;
            if (s.dashboardState.dashboard != null && s.dashboardState.dashboard != undefined) {
                if (s.dashboardState.dashboard.columnsCount > 0)
                    this.cols = s.dashboardState.dashboard.columnsCount;

                if (s.dashboardState.dashboard.rowHeight > 0)
                    this.rowHeight = s.dashboardState.dashboard.rowHeight;
            }
            this.mode = s.dashboardState.dashboardMode;
            if (this.widgetFactory != null && this.widgetFactory != undefined)
                this.widgetFactory.onRefresh();

        })
    }
    //
    private getWidgets(): void {
        this.dashSrv.getInjectionWidgets(this.dashboardId, false).subscribe(r => {
            //this.observableMedia.asObservable()
            //    .subscribe((changes: MediaChange) => {
            //        //this.grid.cols = this.countBySize[changes.mqAlias];

            //    }
            //);
            this.widgets = r;
        });
    }
    //============================================================================================
    // set layout
    //============================================================================================
    private setLayout() {
        /* Grid column map */
        const cols_map = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 10],
            ['xl', 18]
        ]);
        /* Big card column span map */
        const cols_map_big = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 4],
            ['lg', 4],
            ['xl', 4]
        ]);
        /* Small card column span map */
        const cols_map_sml = new Map([
            ['xs', 1],
            ['sm', 2],
            ['md', 2],
            ['lg', 2],
            ['xl', 2]
        ]);
        let start_cols: number;
        let start_cols_big: number;
        let start_cols_sml: number;

        //cols_map.forEach((cols, mqAlias) => {
        //    if (this.observableMedia.isActive(mqAlias)) {
        //        start_cols = cols;
        //    }
        //});
        //cols_map_big.forEach((cols_big, mqAlias) => {
        //    if (this.observableMedia.isActive(mqAlias)) {
        //        start_cols_big = cols_big;
        //    }
        //});
        //cols_map_sml.forEach((cols_sml, mqAliast) => {
        //    if (this.observableMedia.isActive(mqAliast)) {
        //        start_cols_sml = cols_sml;
        //    }
        //});
        //this.observableMedia.subscribe(r => { this.cols = cols_map.get(r.mqAlias) });

        //this.cols = this.observableMedia.asObservable()
        //  .map(change => {
        //    return cols_map.get(change.mqAlias);
        //  }).startWith(start_cols);


        //this.cols_big = this.observableMedia.asObservable()
        //  .map(change => {
        //    return cols_map_big.get(change.mqAlias);
        //  }).startWith(start_cols_big);
        //this.cols_sml = this.observableMedia.asObservable()
        //  .map(change => {
        //    return cols_map_sml.get(change.mqAlias);
        //  }).startWith(start_cols_sml);

    }

    private updateWidget(widget: WidgetInfo): Observable<boolean> {
        return new Observable(
            observer => {
                this.widgets.find(r => r.input.id.value == widget.id).input.columnSpan.value = widget.columnSpan;
                this.widgets.find(r => r.input.id.value == widget.id).input.rowSpan.value = widget.rowSpan;
                observer.next(true);
            }
        );
    }

    // drag &drop
    /**
     * LIST ITEM DRAP ENTERED
    */
    dragenter($event, v) {
        let target = $event.currentTarget;
        //console.log(target);
        //alert("end");
        //let target = $event.currentTarget;
        //if (this.isbefore(this.currentWidget, target)) {
        //    target.parentNode.insertBefore(this.currentWidget, target); // insert before
        //}
        //else {
        //    target.parentNode.insertBefore(this.currentWidget, target.nextSibling); //insert after
        //}
    }

    /**
     * LIST ITEM DRAG STARTED
     */
    dragstart($event, v) {
        this.currentWidget = $event.currentTarget;
        $event.dataTransfer.effectAllowed = 'move';
        this.isDragstart = true;
        this.dragStartWidget = v;
    }
}
