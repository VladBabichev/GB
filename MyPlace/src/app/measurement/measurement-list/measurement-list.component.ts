import { Component, OnInit, Input, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import * as events from "devextreme/events";
import { on } from "devextreme/events";
import { DxDataGridComponent } from "devextreme-angular";

@Component({
    selector: 'app-battery-measurement-list',
    templateUrl: "./measurement-list.component.html",
	styleUrls: ["./measurement-list.component.css"]
})
export class MeasurementListComponent {
    
    @Input() public dataSource : any;
    @ViewChild(DxDataGridComponent) measurementsGrid: DxDataGridComponent;

    constructor(
        private router: Router, 
        private route: ActivatedRoute) {
    }

    public refresh() : void {
        this.measurementsGrid.instance.refresh();
    }

    specificationCellTextValueFormat(e: any)
    {
        return e.specificationAssigments.map(item => `${item.name} (${item.unit})`).join(", ");
    }

    onEditingStart(e: any) {
        e.cancel = true;
    }

    onCellPrepared(e: any): void {
        if (e.rowType == "data" && e.column.command == "edit") {
            let cellElement = e.cellElement,
                editLink = cellElement.get(0).querySelector(".dx-link-edit");

            on(editLink, "dxclick", (args) => {
                this.router.navigate([e.key], { relativeTo: this.route });      
            });
        }
    }    
}