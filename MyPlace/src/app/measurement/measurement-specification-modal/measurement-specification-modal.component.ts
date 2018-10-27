import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
import { environment } from "../../../environments/environment";

@Component({
    templateUrl: "./measurement-specification-modal.component.html",
    styleUrls: ["measurement-specification-modal.component.css"]
})
export class MeasurementSpecificationModalComponent implements OnInit {

    @Output() public selectedSpecifications = new EventEmitter<any[]>();

    public title: string;
	public form: FormGroup;
	public targetType: string;
    public unit: string;
    
    specifications: DataSource;
    selectedItems: any[];

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            measureIndex: null,
            measureValue: null
        });

        this.selectedItems = [];
        this.specifications = this.getDataSource();
    }

    onSave(): void {
        this.selectedSpecifications.emit(this.selectedItems);
        this.activeModal.close();
    }

    onSpecificationCellPrepared(e: any) : void {
        debugger
        if (e.rowType === "data" && e.column.command === 'select' && e.data.measurementId > 0) {
            e.cellElement.find('.dx-select-checkbox').dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }
    }

    onSpecificationSelectionChanged(e: any) : void {
		this.selectedItems = e.component.getSelectedRowsData();
    }

    private getDataSource(): any {
        var baseUrl = `${environment.serverBaseUrl}api`;
        
        return {
            store: createStore({
                key: 'id',
                loadUrl: `${baseUrl}/specifications?excludeAssigned=true`,
                updateUrl: `${baseUrl}/specifications`,
                deleteUrl: `${baseUrl}/specifications`,
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            })
        }
    }
}