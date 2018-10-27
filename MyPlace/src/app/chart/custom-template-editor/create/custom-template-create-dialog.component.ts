import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { AppState } from "../../../state";
import * as ChartActions from "../../state/chart.actions";

@Component({
    templateUrl: "custom-template-create-dialog.component.html",
    styleUrls: ["custom-template-create-dialog.component.css"]
})
export class CustomTemplateCreateDialogComponent implements OnInit {

    newTemplateSnapshotForm: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.newTemplateSnapshotForm = new FormGroup({
            templateName: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
        });
    }

    onCreateTemplate(): void {
        this.validate(this.newTemplateSnapshotForm);

        if (this.newTemplateSnapshotForm.valid) {
            this.store.dispatch(new ChartActions.CreateTemplateFromChartConfirmDialogOpen(this.newTemplateSnapshotForm.value.templateName));
            this.activeModal.close();
        }
    }

    validateTemplateName(): boolean {
        const control = this.newTemplateSnapshotForm.get("templateName");
        return control.valid || control.untouched;
    }

    private validate(formGroup: FormGroup) : void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field); 

            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormControl) {
                this.validate(((control) as any) as FormGroup);
            }
        });
    }
}