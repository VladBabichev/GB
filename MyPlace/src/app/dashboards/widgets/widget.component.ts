import { Component, Input, Output, EventEmitter} from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { WidgetComponentsService } from "../services/widgetComponents.service";
import { IWidgetComponent, WidgetInfo } from "../model/interfaces";
import { DashboardService } from "../services/dashboard.service";
import * as Utils from "../../shared/utils";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app/state";

@Component({
    selector: "app-widget",
    templateUrl: "./widget.component.html",
    styleUrls: ["./widget.component.css"]
})

export class WidgetComponent {
    form: FormGroup;
    widgetComponents: IWidgetComponent[];
    @Input() cols: number = 12;
    @Input() dashboardId: number;
    @Output() widgetAdded = new EventEmitter<WidgetInfo>();
    @Output() cancel = new EventEmitter();
    totalWidgets: number = 1;
    isEdit: boolean = false;

    widget: WidgetInfo = { positionNumber: 1, description: "", columnSpan: 1, componentName: "welcome", dashboardId: 0, rowSpan: 1, widgetProperties: "",id:0 };

    constructor(
        private fb: FormBuilder,
        private widgetService: WidgetComponentsService,
        private dashboardService: DashboardService,
        private store: Store<AppState>
    ) {
    }

    ngOnInit(): void {
        this.widgetService.getWidgetComponents().subscribe(r => this.widgetComponents = r);

        this.form = new FormGroup({
            name: new FormControl(this.widget.positionNumber, Validators.required),
            description: new FormControl(this.widget.description),
            colsSpan: new FormControl(this.widget.columnSpan),
            componentName: new FormControl(this.widget.componentName),
            rowsSpan: new FormControl(this.widget.rowSpan),
            positionNumber: new FormControl(this.widget.positionNumber)
        });

        //this.form = this.fb.group({
        //    name: [this.widget.name || '', [Validators.required, Validators.maxLength(256)]],
        //    description: this.widget.description,
        //    colsSpan: this.widget.colsSpan,
        //    componentName: this.widget.componentName,        
        //    rowsSpan: this.widget.rowsSpan
        //});
    }

    validateControl(name: string): boolean {
        const control = this.form.get(name);
        return control.valid || control.untouched;
    }

    onSubmit(): void {
        this.validate(this.form);
        if (this.form.invalid)
            return;

        this.store.subscribe(s => this.dashboardId = s.dashboardState.dashboardId);
        console.log(this.store);
        //alert(this.dashboardId);

        this.widget = this.form.value;     
        var promise = new Promise((resolve, reject) => {
            this.dashboardService.saveWidget(this.widget)           
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((r: WidgetInfo) => {
            this.widgetAdded.emit(this.widget);
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
            this.widgetAdded.emit(this.widget);
        });
    }

    onCancel(): void {
        // this.router.navigate(['specifications']);
        this.cancel.emit();
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
