import { Component, Output, Injector} from "@angular/core";
import { DxCircularGaugeModule, DxLinearGaugeModule, DxSliderModule } from 'devextreme-angular'
import { EventEmitter } from "events";
import { WidgetBase } from "../widget-base";
import { WidgetInjection } from "../../model/widgetInjection";

@Component({   
    selector: "app-markdown",
    templateUrl: "./markdown.component.html",
    styleUrls: ["./markdown.component.css"]
})
export class MarkdownComponent extends WidgetBase {  
    dataSource: any; 
    speedValue: any = 100;
    @Output() onBubleRefresh = new EventEmitter();

    constructor(private injector: Injector    
    ) {
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

}
