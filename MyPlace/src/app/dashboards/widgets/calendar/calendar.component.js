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
let CalendarComponent = class CalendarComponent extends WidgetBase {
    constructor(injector) {
        super(injector.get(WidgetInjection.metadata.COMPONENTNAME), injector.get(WidgetInjection.metadata.COLUMNSPAN), injector.get(WidgetInjection.metadata.ROWSPAN), injector.get(WidgetInjection.metadata.WIDGETPROPERTIES), injector.get(WidgetInjection.metadata.DASHBOARDID), injector.get(WidgetInjection.metadata.POSITIONNUMBER), injector.get(WidgetInjection.metadata.DESCRIPTION), injector.get(WidgetInjection.metadata.ID));
        this.injector = injector;
        this.isMainMenuVisible = false;
        this.now = new Date();
        this.currentValue = new Date();
        this.firstDay = 0;
        this.minDateValue = undefined;
        this.maxDateValue = undefined;
        this.disabledDates = null;
        this.zoomLevels = [
            "month", "year", "decade", "century"
        ];
        this.cellTemplate = "cell";
        this.holydays = [[1, 0], [4, 6], [25, 11]];
        this.onBubleRefresh = new EventEmitter();
    }
    isWeekend(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    }
    ngOnInit() {
        //this.dataSource = this.injector.get(WidgetInjection.metadata.WIDGET);
        ////console.log(r);
        ////alert(r);
    }
    setMinDate(e) {
        if (e.value) {
            this.minDateValue = new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 3);
        }
        else {
            this.minDateValue = undefined;
        }
    }
    setMaxDate(e) {
        if (e.value) {
            this.maxDateValue = new Date(this.now.getTime() + 1000 * 60 * 60 * 24 * 3);
        }
        else {
            this.maxDateValue = undefined;
        }
    }
    disableWeekend(e) {
        if (e.value) {
            var that = this;
            that.disabledDates = function (data) {
                return data.view === "month" && that.isWeekend(data.date);
            };
        }
        else {
            this.disabledDates = undefined;
        }
    }
    setFirstDay(e) {
        if (e.value) {
            this.firstDay = 1;
        }
        else {
            this.firstDay = 0;
        }
    }
    useCellTemplate(e) {
        if (e.value) {
            this.cellTemplate = "custom";
        }
        else {
            this.cellTemplate = "cell";
        }
    }
};
__decorate([
    Output()
], CalendarComponent.prototype, "onBubleRefresh", void 0);
CalendarComponent = __decorate([
    Component({
        selector: "app-calendar",
        templateUrl: "./calendar.component.html",
        styleUrls: ["./calendar.component.css"]
    })
], CalendarComponent);
export { CalendarComponent };
//# sourceMappingURL=calendar.component.js.map