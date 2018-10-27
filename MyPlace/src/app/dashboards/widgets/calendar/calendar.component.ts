import { Component, ViewChild, AfterViewInit, Injector, Output} from "@angular/core";
import { WelcomeWidget } from "../../model/interfaces";
import { WidgetInjection } from "../../model/widgetInjection";
import { EventEmitter } from "events";
import { WidgetBase } from "../widget-base";

@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent extends WidgetBase {
    isMainMenuVisible: boolean = false;
    now: Date = new Date();
    currentValue: Date = new Date();
    firstDay: number = 0;
    minDateValue: Date = undefined;
    maxDateValue: Date = undefined;
    disabledDates: Function = null;
    zoomLevels: string[] = [
        "month", "year", "decade", "century"
    ];
    cellTemplate = "cell";
    holydays: any = [[1, 0], [4, 6], [25, 11]];
    isWeekend(date) {
        var day = date.getDay();

        return day === 0 || day === 6;
    }
    @Output() onBubleRefresh = new EventEmitter();
    constructor(private injector: Injector) {
        super(injector.get(WidgetInjection.metadata.COMPONENTNAME),
            injector.get(WidgetInjection.metadata.COLUMNSPAN),
            injector.get(WidgetInjection.metadata.ROWSPAN),
            injector.get(WidgetInjection.metadata.WIDGETPROPERTIES),
            injector.get(WidgetInjection.metadata.DASHBOARDID),
            injector.get(WidgetInjection.metadata.POSITIONNUMBER),
            injector.get(WidgetInjection.metadata.DESCRIPTION),
            injector.get(WidgetInjection.metadata.ID)
        );
    }
    dataSource: WelcomeWidget[];

    ngOnInit() {
        //this.dataSource = this.injector.get(WidgetInjection.metadata.WIDGET);

        ////console.log(r);
        ////alert(r);
    }

    setMinDate(e) {
        if (e.value) {
            this.minDateValue = new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 3);
        } else {
            this.minDateValue = undefined;
        }
    }
    setMaxDate(e) {
        if (e.value) {
            this.maxDateValue = new Date(this.now.getTime() + 1000 * 60 * 60 * 24 * 3);
        } else {
            this.maxDateValue = undefined;
        }
    }
    disableWeekend(e) {
        if (e.value) {
            var that = this;
            that.disabledDates = function (data) {
                return data.view === "month" && that.isWeekend(data.date);
            };
        } else {
            this.disabledDates = undefined;
        }
    }
    setFirstDay(e) {
        if (e.value) {
            this.firstDay = 1;
        } else {
            this.firstDay = 0;
        }
    }
    useCellTemplate(e) {
        if (e.value) {
            this.cellTemplate = "custom";
        } else {
            this.cellTemplate = "cell";
        }
    }
}
