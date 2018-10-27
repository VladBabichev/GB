var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Output } from "@angular/core";
import { WidgetInjection } from "../../model/widgetInjection";
import { EventEmitter } from "events";
import { WidgetBase } from "../widget-base";
let BatteryChargeConfigComponent = class BatteryChargeConfigComponent extends WidgetBase {
    constructor(injector) {
        super(injector.get(WidgetInjection.metadata.COMPONENTNAME), injector.get(WidgetInjection.metadata.COLUMNSPAN), injector.get(WidgetInjection.metadata.ROWSPAN), injector.get(WidgetInjection.metadata.WIDGETPROPERTIES), injector.get(WidgetInjection.metadata.DASHBOARDID), injector.get(WidgetInjection.metadata.POSITIONNUMBER), injector.get(WidgetInjection.metadata.DESCRIPTION), injector.get(WidgetInjection.metadata.ID));
        this.injector = injector;
        this.isMainMenuVisible = false;
        this.customizeText = "Battery ";
        this.onBubleRefresh = new EventEmitter();
    }
    ngOnInit() {
        //this.dataSource = this.injector.get(WidgetInjection.metadata.WIDGET);   
        ////console.log(r);
        ////alert(r);
    }
};
__decorate([
    Output()
], BatteryChargeConfigComponent.prototype, "onBubleRefresh", void 0);
BatteryChargeConfigComponent = __decorate([
    Component({
        templateUrl: "./batteryChargeConfig.component.html",
        styleUrls: ["./batteryChargeConfig.component.css"]
    })
], BatteryChargeConfigComponent);
export { BatteryChargeConfigComponent };
//# sourceMappingURL=batteryChargeConfig.component.js.map