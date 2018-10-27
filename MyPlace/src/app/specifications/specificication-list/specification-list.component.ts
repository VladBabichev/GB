import { Component, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { DxDataGridComponent } from "devextreme-angular";
import { on } from "devextreme/events";

import { SpecificationService } from "../../shared/services/specification.service";

@Component({
    selector: 'app-battery-specification-list',
    templateUrl: './specification-list.component.html',
    styleUrls: ['./specification-list.component.css']
})
export class SpecificationListComponent {
    @Input() public dataSource : any;
    @ViewChild(DxDataGridComponent) private grid: DxDataGridComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private specificationService: SpecificationService)
    {
    }

    onAddNewSpecification(): void {
        this.router.navigate(["add"], { relativeTo: this.route });
    } 

    onRefresh(): void {
        this.grid.instance.refresh();
    }

    onRowRemoving(e: any): void {     
        this.specificationService.deleteBatterySpecification(e.data.id)
            .subscribe();
        //this.store.dispatch(new ViewDeleted(e.data.id));
    }

    onEditingStart(e: any) {
        e.cancel = true;
    }

    onCellPrepared(e: any): void {
        if (e.rowType == "data" && e.column.command == "edit") {
            let cellElement = e.cellElement.get(0),
                editLink = cellElement.querySelector(".dx-link-edit");

            on(editLink, "dxclick", (event) => {
                this.router.navigate([e.key], { relativeTo: this.route });      
            });
        }
    }
}