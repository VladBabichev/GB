import { Component, Input } from "@angular/core";

import { Project } from "../model/project";

@Component({
    selector: "app-legend",
    templateUrl: "./project-legend.component.html",
    styleUrls: ["./project-legend.component.css"]
})
export class ProjectLegendComponent {
    @Input()
    projects: Project[];
}
