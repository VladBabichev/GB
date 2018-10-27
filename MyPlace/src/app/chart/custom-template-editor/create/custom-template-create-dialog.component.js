var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as ChartActions from "../../state/chart.actions";
let CustomTemplateCreateDialogComponent = class CustomTemplateCreateDialogComponent {
    constructor(activeModal, store) {
        this.activeModal = activeModal;
        this.store = store;
    }
    ngOnInit() {
        this.newTemplateSnapshotForm = new FormGroup({
            templateName: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
        });
    }
    onCreateTemplate() {
        this.validate(this.newTemplateSnapshotForm);
        if (this.newTemplateSnapshotForm.valid) {
            this.store.dispatch(new ChartActions.CreateTemplateFromChartConfirmDialogOpen(this.newTemplateSnapshotForm.value.templateName));
            this.activeModal.close();
        }
    }
    validateTemplateName() {
        const control = this.newTemplateSnapshotForm.get("templateName");
        return control.valid || control.untouched;
    }
    validate(formGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof FormControl) {
                this.validate((control));
            }
        });
    }
};
CustomTemplateCreateDialogComponent = __decorate([
    Component({
        templateUrl: "custom-template-create-dialog.component.html",
        styleUrls: ["custom-template-create-dialog.component.css"]
    })
], CustomTemplateCreateDialogComponent);
export { CustomTemplateCreateDialogComponent };
//# sourceMappingURL=custom-template-create-dialog.component.js.map