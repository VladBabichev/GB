var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BeforeStartUpload } from "../../state";
let ProjectDetailComponent = class ProjectDetailComponent {
    constructor(store) {
        this.store = store;
        this.state$ = this.store.select(s => s.upload);
    }
    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
            testName: new FormControl(null, Validators.maxLength(256)),
            testType: new FormControl(null, Validators.maxLength(256)),
            channel: new FormControl(null, Validators.maxLength(256)),
            tag: new FormControl(null, Validators.maxLength(256)),
            mass: new FormControl(null),
            activeMaterialFraction: new FormControl(null),
            theoreticalCapacity: new FormControl(null),
            area: new FormControl(null),
            batteryName: new FormControl(null, Validators.maxLength(128)),
            build: new FormControl(null, Validators.maxLength(128)),
            packSupplier: new FormControl(null, Validators.maxLength(128)),
            cellSupplier: new FormControl(null, Validators.maxLength(128)),
            testOwner: new FormControl(null, Validators.maxLength(128)),
            temperature: new FormControl(null),
            serialNumber: new FormControl(null, Validators.maxLength(128)),
            technology: new FormControl(null, Validators.maxLength(128)),
            nameplateCapacity: new FormControl(null, Validators.maxLength(128)),
            tester: new FormControl(null, Validators.maxLength(128)),
            procedure: new FormControl(null, Validators.maxLength(128)),
            comments: new FormControl(null, Validators.maxLength(256))
        });
    }
    onSubmit(file) {
        const project = Object.assign({}, this.form.value, { file: file });
        this.store.dispatch(new BeforeStartUpload(project));
    }
};
ProjectDetailComponent = __decorate([
    Component({
        templateUrl: "./project-detail.component.html",
        styleUrls: ["./project-detail.component.css"]
    })
], ProjectDetailComponent);
export { ProjectDetailComponent };
//# sourceMappingURL=project-detail.component.js.map