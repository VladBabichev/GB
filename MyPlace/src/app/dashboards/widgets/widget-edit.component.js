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
let WidgetEditComponent = class WidgetEditComponent {
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
        var domRect = document.getElementById('element').getBoundingClientRect();
        var height = document.getElementById('element').style.height;
        let h = (document.querySelector('#placeHolder'))[0].offsetHeight;
        let w = (document.querySelector('#placeHolder'))[0].offsetWidth;
    }
};
__decorate([
    ViewChild(MarkdownComponent)
], WidgetEditComponent.prototype, "markdownComponent", void 0);
__decorate([
    ViewChild(WelcomeComponent)
], WidgetEditComponent.prototype, "welcomeComponent", void 0);
__decorate([
    ViewChildren('placeHolder')
], WidgetEditComponent.prototype, "widgetComponent", void 0);
WidgetEditComponent = __decorate([
    Component({
        selector: 'app-widgetView',
        templateUrl: './widget-edit.component.html',
        styleUrls: ['./widget-edit.component.css'],
        entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
    })
], WidgetEditComponent);
export { WidgetEditComponent };
//# sourceMappingURL=widget-edit.component.js.map