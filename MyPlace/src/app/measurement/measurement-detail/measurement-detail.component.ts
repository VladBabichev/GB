import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { MeasurementService } from "../state/measurement.service"
import { MeasurementSpecificationModalComponent } from "../measurement-specification-modal/measurement-specification-modal.component";
import { DxDataGridComponent } from "devextreme-angular";
import { LocalizationBaseComponent } from "../../core/localization-base.component";

@Component({
    templateUrl: './measurement-detail.component.html',
    styleUrls: ['./measurement-detail.component.css']
})
export class MeasurementDetailComponent extends LocalizationBaseComponent implements OnInit {

    @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;
    
    form: FormGroup;
    measurement: any;
    isEdit: boolean;
    specificationsList: any[] = [];
    specificationItems: number[] = [];
    measurementItems: any[] = [];
    argumentTypes: any[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private measurementService: MeasurementService) {
            super();
    }

    ngOnInit() : void {

        this.argumentUniqueValidation = this.argumentUniqueValidation.bind(this);
        this.argumentTypes = [ { id: 1, name: "Cycle" }, { id: 2, name: "Date" } ];
        this.measurement = this.route.snapshot.data['measurement'] || {};
        this.isEdit = this.measurement != null;

        this.measurementItems = this.measurement.items || [];
        this.specificationsList = this.measurement.specificationAssigments || [];
        this.specificationItems = (this.measurement.specificationAssigments || []).map(item => item.id);

        this.form = this.fb.group({
            measurementId: this.measurement.measurementId,
            name: [this.measurement.name || '', [Validators.required, Validators.maxLength(128)]],
            projectId: this.route.snapshot.params["projectId"],
            specificationAssigments: this.fb.array(this.getMeasurementValues(this.measurement.specificationAssigments)),
            items: this.fb.array(this.getMeasurementValues(this.measurement.items))
        });
    }

    get measurements(): FormArray {
        return this.form.get("items") as FormArray;
    }

    onMeasurementRowInit(e: any) {
        e.data.id = (new Date()).getTime();
    }

    onMeasurementRowValidating(e: any) {
        const errorMessages = e.brokenRules.map(rule => rule.message);
        if (errorMessages.length > 0)
        {
            e.errorText = errorMessages.join();
            setTimeout(() => {
                let errorRow = e.component.element().find(".dx-error-message");
                errorRow.get(0).innerHTML = errorMessages.join("<br/>");
            });
        }
    }

    onMeasurementAdded(e: any) {
        this.measurements.push(this.fb.group({
            index: e.data.index,
            value: e.data.value
        }));
    }

    argumentUniqueValidation(e: any) {
        return this.measurementItems.find(item => item.index == e.data.index && item.id != e.data.id) == undefined;
    }

    onAddSpecification(): void {
        const specificationSelectionComponent = this.modalService.open(MeasurementSpecificationModalComponent).componentInstance;

        specificationSelectionComponent.title = this.translate("select-specification-title");
        specificationSelectionComponent.selectedSpecifications.subscribe((data:any[]) => {
            data.forEach(item => {
                if (!this.specificationsList.find(e => e.id == item.id)){
                    this.specificationsList.push(item);
                    this.specificationItems.push(item.id);
                }
            })
        });
    }

    validateControl(name: string): boolean {
        const control = this.form.get(name);
        return control.valid || control.untouched;
    }

    onCancel() : void {
        this.navigateToMeasurements();
    }

    onSubmit() : void {
        if (this.grid.instance.hasEditData()) {
            this.grid.instance.saveEditData();
        }

        this.form.setControl("items", this.fb.array(this.getMeasurementValues(this.measurementItems)));
        this.form.setControl("specificationAssigments", this.fb.array(this.getMeasurementValues(
            this.specificationsList.filter(
                item => this.specificationItems.find(selected => item.id == selected)))));

        this.validate(this.form);
        if (this.form.invalid)
            return
            
        this.measurementService.saveMeasurement(this.form.value)
            .subscribe(data => {
                this.navigateToMeasurements();
            });
    }

    private navigateToMeasurements() {
        var projectId = this.route.snapshot.paramMap.get('projectId');
        this.router.navigateByUrl(`projects/${projectId}/measurements`)
    }

    private getMeasurementValues(values: any[]): FormGroup[] {
        const items : FormGroup[] = [];

        (values || []).forEach(item => {
            items.push(this.fb.group(item))
        });

        return items;
    }

    private validate(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);

            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormControl) {
                this.validate(((control) as any) as FormGroup);
            }
        });
    }    
}