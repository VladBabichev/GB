import { Component, ViewChild, AfterViewInit, Injector, Output} from "@angular/core";
import { WelcomeWidget,IWidget,WidgetInfo } from "../../model/interfaces";
import { WidgetInjection} from "../../model/widgetInjection";
import { EventEmitter } from '@angular/core';
import { WidgetBase } from "../widget-base";


@Component({
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.css"]
})
export class WelcomeComponent extends WidgetBase {      
    
    isMainMenuVisible: boolean = false;
    customizeText: any = "Welcome"; 
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
    onDashboardEdit(e) {
        this.onBubble.emit(e);
    }
}
