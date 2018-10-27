var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input, ViewChild, ViewChildren, Output, EventEmitter } from '@angular/core';
import { WidgetFactoryComponent } from "../widgets/widgetFactory.component";
//import { ObservableMedia, MediaChange,MockMediaQueryList } from '@angular/flex-layout';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/startWith';
import { MarkdownComponent } from '../widgets/markdown/markdown.component';
import { WelcomeComponent } from '../widgets/welcome/welcome.component';
import { BatteryChargeComponent } from '../widgets/batteryCharge/batteryCharge.component';
import { CalendarComponent } from '../widgets/calendar/calendar.component';
import { WidgetCommands } from "../model/constants";
import { MatGridList } from '@angular/material';
import { Observable } from 'rxjs';
import { BatteryChargeConfigComponent } from './batteryCharge/batteryChargeConfig.component';
import { DxScrollViewComponent } from 'devextreme-angular';
let WidgetContainerComponent = class WidgetContainerComponent {
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(widgetService, store, dashSrv
    //private observableMedia: ObservableMedia
    ) {
        this.widgetService = widgetService;
        this.store = store;
        this.dashSrv = dashSrv;
        this.widgets = [];
        this.cols_big = 1;
        this.cols_sml = 3;
        this.cols = 10;
        this.rowHeight = 400;
        this.isMainMenuVisible = false;
        this.isMenuVisible = false;
        this.editWidget = new EventEmitter();
        this.bubble = new EventEmitter();
        this.mode = "show";
        this.isDragstart = false;
        this.draggable = false;
        this.styleBackground = "white";
        this.styleBackgroundGrid = "white";
        this.styleWidgetBorder = "thin";
        this.styleBorderWidth = "1px";
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
        });
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
        });
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
        let command = event;
        if (command.commandName == WidgetCommands.config)
            this.draggable = true;
        if (command != null && command != undefined && command.componentName != "WidgetContainerComponent") {
            this.bubble.emit(event);
        }
        else {
            if (command.commandName == WidgetCommands.refreshAfterDrag) {
                let param = command.param;
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
    SaveWidgets() {
        this.draggable = false;
        this.store.subscribe(s => this.widgetFactory.SaveWidget(s.dashboardState.widgetInfo));
        let result = this.widgets.map(r => ({
            columnSpan: r.input.columnSpan.value,
            componentName: r.input.componentName.value,
            dashboardId: r.input.dashboardId.value,
            description: r.input.description.value,
            id: r.input.id.value,
            positionNumber: r.input.positionNumber.value,
            rowSpan: r.input.rowSpan.value,
            widgetProperties: r.input.widgetProperties.value
        }));
        //alert();
        this.dashSrv.saveWidgets({ dashboardId: this.dashboardId, widgetInfo: result }).subscribe(r => r);
    }
    RefreshRowCol() {
        this.store.subscribe(s => {
            this.updateWidget(s.dashboardState.widgetInfo).subscribe(s => s);
        });
    }
    Refresh() {
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
            });
        });
    }
    //  ==============================================================================
    //  private methods
    //  ==============================================================================
    setHeight() {
        if (this.myContainer) {
            var r = this.myContainer.nativeElement.getBoundingClientRect();
            var e = document.documentElement;
            var h = e.clientHeight - r.top - window.pageYOffset - 10;
            var newHeight = h.toString() + "px";
            if (this.scrollView.height != newHeight)
                this.scrollView.height = newHeight;
        }
    }
    // Drag&Drop
    dragDropBack(param) {
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
    dragDropForward(param) {
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
    init() {
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
        });
    }
    //
    getWidgets() {
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
    setLayout() {
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
        let start_cols;
        let start_cols_big;
        let start_cols_sml;
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
    updateWidget(widget) {
        return new Observable(observer => {
            this.widgets.find(r => r.input.id.value == widget.id).input.columnSpan.value = widget.columnSpan;
            this.widgets.find(r => r.input.id.value == widget.id).input.rowSpan.value = widget.rowSpan;
            observer.next(true);
        });
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
};
__decorate([
    ViewChild("container")
], WidgetContainerComponent.prototype, "myContainer", void 0);
__decorate([
    ViewChild(DxScrollViewComponent)
], WidgetContainerComponent.prototype, "scrollView", void 0);
__decorate([
    Input()
], WidgetContainerComponent.prototype, "dashboardId", void 0);
__decorate([
    Input()
], WidgetContainerComponent.prototype, "cols", void 0);
__decorate([
    ViewChild(WidgetFactoryComponent)
], WidgetContainerComponent.prototype, "widgetFactory", void 0);
__decorate([
    ViewChildren(WidgetFactoryComponent)
], WidgetContainerComponent.prototype, "components", void 0);
__decorate([
    ViewChild(MatGridList)
], WidgetContainerComponent.prototype, "grid", void 0);
__decorate([
    Output()
], WidgetContainerComponent.prototype, "editWidget", void 0);
__decorate([
    Output()
], WidgetContainerComponent.prototype, "bubble", void 0);
WidgetContainerComponent = __decorate([
    Component({
        selector: 'app-widgetContainer',
        templateUrl: './widgetContainer.component.html',
        styleUrls: ['./widgetContainer.component.css'],
        entryComponents: [MarkdownComponent,
            WelcomeComponent,
            BatteryChargeComponent,
            CalendarComponent,
            BatteryChargeConfigComponent]
    })
], WidgetContainerComponent);
export { WidgetContainerComponent };
//# sourceMappingURL=widgetContainer.component.js.map