import { Component, ViewChild, AfterViewInit, Injector, Output} from "@angular/core";
import { WelcomeWidget } from "../../model/interfaces";
import { WidgetInjection} from "../../model/widgetInjection";
import { EventEmitter } from "events";
import { WidgetBase } from "../widget-base";
@Component({
    templateUrl: "./batteryChargeConfig.component.html",
    styleUrls: ["./batteryChargeConfig.component.css"]
})
export class BatteryChargeConfigComponent extends WidgetBase {  
    isMainMenuVisible: boolean = false;
    customizeText: any = "Battery ";
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
}
