import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SpecificationExpectationModalComponent } from "./specification-expectation-modal/specification-expectation-modal.component";
import { SpecificationService } from "../../shared/services/specification.service";

interface TargetType {
	targetTypeId: number;
    targetTypeName: string;
}

@Component({
    templateUrl: './specification-detail.component.html',
    styleUrls: ['./specification-detail.component.css']
})
export class SpecificationDetailComponent implements OnInit {

    form: FormGroup;
    specification: any;
    isEdit: boolean;
	targetTypes: TargetType[];
    targetType: TargetType;
    absoluteUnits: boolean;
    measureUnit: string;
    constraintItems: any[] = [];

    get constraints(): FormArray {
        return this.form.get("constraints") as FormArray;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private specificationService: SpecificationService) {
    }

    ngOnInit(): void {
        this.specification = this.route.snapshot.data['specification'] || {};
        this.isEdit = this.route.snapshot.data['specification'] != null;
        this.argumentUniqueValidation = this.argumentUniqueValidation.bind(this);

        this.targetTypes = this.getTargeType();
        this.absoluteUnits = !this.specification.percentageData;
        this.measureUnit = this.specification.percentageData === true ? "%" : this.specification.unit;
        this.constraintItems = (this.specification.constraints || []).map(item => {
            item.id = item.measureIndex;
            return item;
        });

        this.form = this.fb.group({
            name: [this.specification.name || '', [Validators.required, Validators.maxLength(256)]],
            contact: [this.specification.contact || '', [Validators.required, Validators.maxLength(256)]],
            email: [this.specification.email || '', Validators.email],
            requestor: this.specification.requestor || '',
            targetCycles: this.specification.targetCycles || null,
            percentageData: this.specification.percentageData,
            basePercentageIndex: this.specification.basePercentageIndex,
            comments: this.specification.comments || '',
            constraints: this.fb.array(this.getConstraints(this.specification.constraints)),
			targetTypeId: this.specification.targetTypeId || 1,
            unit: [this.specification.unit || '', 
                (() => {
                    if (this.absoluteUnits)
                        return [Validators.required, Validators.maxLength(20)]
                    return []
                })()
            ]
        });

        this.formValueChanged();
    }

    validateControl(name: string): boolean {
        const control = this.form.get(name);
        return control.valid || control.untouched;
    }

    onAddExpectation(): void {
		const expectationComponent = this.modalService.open(SpecificationExpectationModalComponent).componentInstance;

		let targetName: string = this.targetTypes.find(t => t.targetTypeId == this.form.value.targetTypeId).targetTypeName;
		expectationComponent.unit = this.measureUnit;
		expectationComponent.targetType = targetName;
        expectationComponent.title = "Add new constraint";
        expectationComponent.expectationAdded.subscribe(data => {
            this.constraints.push(this.fb.group(data));
        })
    }

    onExpectationRowInit(e: any) {
        e.data.id = (new Date()).getTime();
    }

    onExpectationRowValidating(e: any) {
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

    onExpectationAdded(e: any) {
        this.constraints.push(this.fb.group({
            index: e.data.measureIndex,
            value: e.data.measureValue
        }));
    }

    argumentUniqueValidation(e: any) {
        return this.constraintItems.find(item => item.measureIndex == e.data.measureIndex && item.id != e.data.id) == undefined;
    }    

    onExpectationRemoving(e: any): void {
        const index = this.constraints.controls.findIndex(el => el === e.data);
        if (index >= 0) {
            this.constraints.removeAt(index);
        }
    }

    onSpecificationUnitPercentageChanged(): void {
        this.absoluteUnits = !this.form.value.percentageData;
        this.measureUnit = !this.absoluteUnits ? "%" : this.form.value.unit;
    }

    onSubmit(): void {

        this.form.setControl("constraints", this.fb.array(this.getConstraints(this.constraintItems)));

        this.validate(this.form);
        if (this.form.invalid)
            return;

        if (this.isEdit) {
            this.specificationService.updateBatterySpecification(this.specification.id, this.form.value)
            .subscribe(data => {
                this.router.navigate(['specifications']);
            });
        }
        else {
            this.specificationService.saveBatterySpecification(this.form.value)
            .subscribe(data => {
                this.router.navigate(['specifications']);
            });
        }
    }

    onCancel() : void {
        this.router.navigate(['specifications']);
    }

    private getConstraints(constraints: any[]): any {
        const items = []
        
        if (!constraints)
            return items;
        
        constraints.forEach(item => {
            items.push(this.fb.group(item))
        });

        return items;
    }

    private formValueChanged(): void {
        this.form.get("percentageData").valueChanges.subscribe(
            (percentage: boolean) => {
                const unitControl = this.form.get("unit");
                if (percentage) {
                    unitControl.clearValidators();
                }
                else {
                    unitControl.setValidators([Validators.required, Validators.maxLength(20)]);
                }

                unitControl.updateValueAndValidity();
            }
        );
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
    // temporaty 
    private getTargeType(): TargetType[] {
		return [{ targetTypeId: 1, targetTypeName: "Cycle" }, { targetTypeId: 2, targetTypeName: "Day" }];
    }
}