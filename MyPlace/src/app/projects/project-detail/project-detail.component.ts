import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState, UploadState, BeforeStartUpload } from "../../state";

@Component({
    templateUrl: "./project-detail.component.html",
    styleUrls: ["./project-detail.component.css"]
})
export class ProjectDetailComponent implements OnInit {
    form: FormGroup;
    state$: Observable<UploadState>;

    constructor(private store: Store<AppState>) {
        this.state$ = this.store.select(s => s.upload);
    }

    public ngOnInit(): void {
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

    public onSubmit(file: File[]): void {
        const project = { ...this.form.value, file: file };
        this.store.dispatch(new BeforeStartUpload(project));
    }
}
