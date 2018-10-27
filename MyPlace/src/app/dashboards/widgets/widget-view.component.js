var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input, ViewChild } from '@angular/core';
import { MarkdownComponent } from './markdown/markdown.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { BatteryChargeComponent } from './batteryCharge/batteryCharge.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DxPopupComponent } from 'devextreme-angular';
let WidgetViewComponent = class WidgetViewComponent {
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor() {
        this.popupVisible = true;
        this.width = 300;
        this.height = 250;
    }
    //  ==============================================================================
    //  ng
    //  ==============================================================================
    ngOnInit() {
    }
    //  ==============================================================================
    //  events handlers
    //  ==============================================================================
    onSubmit() {
    }
    onCancel() {
    }
    onRefresh() {
    }
    popup_hiding(e) {
        this.popup.instance.content().remove();
    }
};
__decorate([
    ViewChild(DxPopupComponent)
], WidgetViewComponent.prototype, "popup", void 0);
__decorate([
    Input()
], WidgetViewComponent.prototype, "widget", void 0);
__decorate([
    Input()
], WidgetViewComponent.prototype, "width", void 0);
__decorate([
    Input()
], WidgetViewComponent.prototype, "height", void 0);
WidgetViewComponent = __decorate([
    Component({
        selector: 'app-widgetView',
        templateUrl: './widget-view.component.html',
        styleUrls: ['./widget-view.component.css'],
        entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
    })
], WidgetViewComponent);
export { WidgetViewComponent };
//# sourceMappingURL=widget-view.component.js.map