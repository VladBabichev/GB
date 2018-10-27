var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ViewChild, ViewChildren } from '@angular/core';
//import { ObservableMedia } from '@angular/flex-layout';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/startWith';
import { MarkdownComponent } from '../widgets/markdown/markdown.component';
import { WelcomeComponent } from '../widgets/welcome/welcome.component';
import { BatteryChargeComponent } from '../widgets/batteryCharge/batteryCharge.component';
import { CalendarComponent } from '../widgets/calendar/calendar.component';
let WidgetDetailComponent = class WidgetDetailComponent {
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(widgetService, store, dashSrv, activeModal) {
        this.widgetService = widgetService;
        this.store = store;
        this.dashSrv = dashSrv;
        this.activeModal = activeModal;
        this.init();
    }
    //  ==============================================================================
    //  ng
    //  ==============================================================================
    ngOnInit() {
    }
    ngAfterViewInit() {
        //let obj = this.widgetComponent.first();
        console.log(this.widgetComponent);
        alert("first");
        //this.widgetFactory = this.components.find(r => r.componentId.value == this.widgetId);
        //if (this.widgetFactory != null && this.widgetFactory != undefined) {
        //    this.widgetFactory.onMouseOver(v);
        //}
    }
    //  ==============================================================================
    //  events handlers
    //  ==============================================================================
    onSubmit() {
        this.activeModal.close(1);
    }
    onCancel() {
        this.activeModal.close(-1);
    }
    onRefresh() {
    }
    //  ==============================================================================
    //  private methods
    //  ==============================================================================
    init() {
    } //
};
__decorate([
    ViewChild(MarkdownComponent)
], WidgetDetailComponent.prototype, "markdownComponent", void 0);
__decorate([
    ViewChild(WelcomeComponent)
], WidgetDetailComponent.prototype, "welcomeComponent", void 0);
__decorate([
    ViewChildren('placeHolder')
], WidgetDetailComponent.prototype, "widgetComponent", void 0);
WidgetDetailComponent = __decorate([
    Component({
        selector: 'app-widgetDetail',
        templateUrl: './widget-detail.component.html',
        styleUrls: ['./widget-detail.component.css'],
        entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
    })
], WidgetDetailComponent);
export { WidgetDetailComponent };
//# sourceMappingURL=widget-detail.component.js.map