import { Component, Output, Injector} from "@angular/core";
import { EventEmitter } from "events";
import { WidgetBase } from "../widget-base";
import { WidgetInjection } from "../../model/widgetInjection";
import { ProjectsGridComponent } from "./projects-grid.component";
import { IProjectsWidgetParam, IWidgetCommand } from "../../model/interfaces";
import { WidgetCommands } from "../../model/constants";

@Component({   
    templateUrl: "./projects-widget.component.html",
    styleUrls: ["./projects-widget.component.css"]
})
export class ProjectsWidgetComponent extends WidgetBase {  
    dataSource: any; 
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
    onSaveProjectViewerState(e) {
      
        let par: IProjectsWidgetParam = { param:e,widgeId:this.id  };
        let command: IWidgetCommand = { commandName: WidgetCommands.saveProjectViewerState, componentName: "DashboardsComponent", param: par };
        this.bubble(command);       
    }
}
