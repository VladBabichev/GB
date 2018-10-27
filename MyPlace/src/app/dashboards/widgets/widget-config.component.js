var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { WidgetFactoryComponent } from "../widgets/widgetFactory.component";
import { MarkdownComponent } from '../widgets/markdown/markdown.component';
import { WelcomeComponent } from '../widgets/welcome/welcome.component';
import { BatteryChargeComponent } from '../widgets/batteryCharge/batteryCharge.component';
import { CalendarComponent } from '../widgets/calendar/calendar.component';
import { WidgetCommands } from '../model/constants';
import { FormControl, FormGroup } from "@angular/forms";
import { DxScrollViewComponent } from 'devextreme-angular';
let WidgetConfigComponent = class WidgetConfigComponent {
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(srv, store, dashSrv) {
        this.srv = srv;
        this.store = store;
        this.dashSrv = dashSrv;
        this.widgetRange = "1x1";
        this.bubble = new EventEmitter();
        this.init();
    }
    validate(arg0) {
        throw new Error("Method not implemented.");
    }
    //  ==============================================================================
    //  ng
    //  ==============================================================================
    ngOnInit() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboard.id;
            this.widgetRange = `${s.dashboardState.widgetInfo.rowSpan}x${s.dashboardState.widgetInfo.columnSpan}`;
            //alert(`${this.widgetInfo.rowSpan}x${this.widgetInfo.columnSpan}`);
            this.widgetRanges = this.getRanges(s.dashboardState.dashboard.columnsCount);
            this.widgetInfo = s.dashboardState.widgetInfo;
            this.getWidgetConfig(this.widgetInfo.id);
            this.form = new FormGroup({
                description: new FormControl(this.widgetInfo.description)
            });
        });
    }
    ngAfterViewChecked() {
        this.setHeight();
    }
    //  ==============================================================================
    //  events handlers
    //  ==============================================================================
    onRefresh() {
    }
    onRangeValueChanged(e) {
        let toArray = e.value.split("x");
        this.widgetInfo.rowSpan = Number(toArray[0]);
        this.widgetInfo.columnSpan = Number(toArray[1]);
        this.store.subscribe(s => {
            s.dashboardState.widgetInfo = this.widgetInfo;
            this.dashboardId = s.dashboardState.dashboardId;
            //alert("index:"+index);
            //this.dashSrv.saveWidget(this.widgetInfo, this.dashboardId).subscribe(s => {
            //    let command: IWidgetCommand = { commandName: WidgetCommands.refreshDashboardWidgets, componentName: "DashboardsComponent", param: null };
            //    this.bubble.emit(command);
            //});
            let command = { commandName: WidgetCommands.rowColSpanChanges, componentName: "DashboardsComponent", param: null };
            this.bubble.emit(command);
        });
    }
    onBubble(e) {
        this.bubble.emit(e);
    }
    onSubmit() {
        if (this.form.invalid)
            return;
        let result = this.form.value;
        this.widgetInfo.description = result.description;
        this.store.subscribe(s => {
            //this.widgetFactory.onRefresh();
            s.dashboardState.widgetInfo = this.widgetInfo;
            this.dashSrv.saveWidget(this.widgetInfo).subscribe(s => {
                let command = { commandName: WidgetCommands.refreshDashboardWidgets, componentName: "DashboardsComponent", param: null };
                this.bubble.emit(command);
                //this.onSave(null);
            });
        });
    }
    onSave(e) {
        let command = { commandName: WidgetCommands.saveWidgets, componentName: "DashboardsComponent", param: null };
        this.bubble.emit(command);
    }
    onClose(e) {
        let command = { commandName: WidgetCommands.show, componentName: "DashboardsComponent", param: null };
        this.onBubble(command);
    }
    //  ==============================================================================
    //  private methods
    //  ==============================================================================
    init() {
        //var domRect = document.getElementById('element').getBoundingClientRect();
        //var height = document.getElementById('element').style.height;
        //let h = (document.querySelector('#placeHolder'))[0].offsetHeight;
        //let w = (document.querySelector('#placeHolder'))[0].offsetWidth;
    }
    setHeight() {
        if (this.myContainer) {
            var r = this.myContainer.nativeElement.getBoundingClientRect();
            var e = document.documentElement;
            var h = e.clientHeight - r.top - window.pageYOffset -
                this.calcFullHeight(this.myContainer, false, false, true, true) -
                this.calcFullHeight(this.myHeader, true, true, true, true) -
                this.calcFullHeight(this.myForm, false, true, true, true) -
                this.calcFullHeight(this.myDescription, true, true, true, true) -
                this.calcFullHeight(this.mySize, true, true, true, true) -
                this.calcFullHeight(this.myButtons, true, true, true, true);
            var newHeight = h.toString() + "px";
            var offset = this.calcFullWidth(this.myForm, false, false, true, false);
            var newWidth = this.myForm.nativeElement.offsetWidth - offset;
            if (this.scrollView.height != newHeight)
                this.scrollView.height = newHeight;
            //if (this.myButtons.nativeElement.offsetWidth != newWidth)
            //	this.myButtons.nativeElement.offsetWidth = newWidth;
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
    calcFullWidth(er, isHeight = true, isMargin = true, isPadding = true, isBorder = true) {
        var result = 0;
        var style = getComputedStyle(er.nativeElement);
        if (isHeight) {
            result += er.nativeElement.offsetWidth;
        }
        if (isMargin) {
            result += parseInt(style.marginLeft.replace("px", ""));
            result += parseInt(style.marginRight.replace("px", ""));
        }
        if (isPadding) {
            result += parseInt(style.paddingLeft.replace("px", ""));
            result += parseInt(style.paddingRight.replace("px", ""));
        }
        if (isBorder) {
            result += parseInt(style.borderLeftWidth.replace("px", ""));
            result += parseInt(style.borderRightWidth.replace("px", ""));
        }
        return result;
    }
    getRanges(cols) {
        let result = [];
        for (var i = 1; i <= cols; i++) {
            for (var j = 1; j <= cols; j++) {
                result.push(`${i}x${j}`);
            }
        }
        return result;
    }
    getWidgetConfig(id) {
        this.dashSrv.getInjectionWidget(id, true).subscribe(r => this.widget = r);
    }
};
__decorate([
    ViewChild("myContainer")
], WidgetConfigComponent.prototype, "myContainer", void 0);
__decorate([
    ViewChild("myHeader")
], WidgetConfigComponent.prototype, "myHeader", void 0);
__decorate([
    ViewChild("myForm")
], WidgetConfigComponent.prototype, "myForm", void 0);
__decorate([
    ViewChild("myDescription")
], WidgetConfigComponent.prototype, "myDescription", void 0);
__decorate([
    ViewChild("mySize")
], WidgetConfigComponent.prototype, "mySize", void 0);
__decorate([
    ViewChild("myButtons")
], WidgetConfigComponent.prototype, "myButtons", void 0);
__decorate([
    ViewChild(DxScrollViewComponent)
], WidgetConfigComponent.prototype, "scrollView", void 0);
__decorate([
    Output()
], WidgetConfigComponent.prototype, "bubble", void 0);
__decorate([
    ViewChild(WidgetFactoryComponent)
], WidgetConfigComponent.prototype, "widgetFactory", void 0);
WidgetConfigComponent = __decorate([
    Component({
        selector: 'app-widgetConfig',
        templateUrl: './widget-config.component.html',
        styleUrls: ['./widget-config.component.css'],
        entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
    })
], WidgetConfigComponent);
export { WidgetConfigComponent };
//# sourceMappingURL=widget-config.component.js.map