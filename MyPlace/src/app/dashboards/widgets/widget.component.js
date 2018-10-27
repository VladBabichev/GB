var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as Utils from "../../shared/utils";
let WidgetComponent = class WidgetComponent {
    constructor(fb, widgetService, dashboardService, store) {
        this.fb = fb;
        this.widgetService = widgetService;
        this.dashboardService = dashboardService;
        this.store = store;
        this.cols = 12;
        this.widgetAdded = new EventEmitter();
        this.cancel = new EventEmitter();
        this.totalWidgets = 1;
        this.isEdit = false;
        this.widget = { positionNumber: 1, description: "", columnSpan: 1, componentName: "welcome", dashboardId: 0, rowSpan: 1, widgetProperties: "", id: 0 };
    }
    ngOnInit() {
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
    validateControl(name) {
        const control = this.form.get(name);
        return control.valid || control.untouched;
    }
    onSubmit() {
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
        promise.then((r) => {
            this.widgetAdded.emit(this.widget);
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
            this.widgetAdded.emit(this.widget);
        });
    }
    onCancel() {
        // this.router.navigate(['specifications']);
        this.cancel.emit();
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
__decorate([
    Input()
], WidgetComponent.prototype, "cols", void 0);
__decorate([
    Input()
], WidgetComponent.prototype, "dashboardId", void 0);
__decorate([
    Output()
], WidgetComponent.prototype, "widgetAdded", void 0);
__decorate([
    Output()
], WidgetComponent.prototype, "cancel", void 0);
WidgetComponent = __decorate([
    Component({
        selector: "app-widget",
        templateUrl: "./widget.component.html",
        styleUrls: ["./widget.component.css"]
    })
], WidgetComponent);
export { WidgetComponent };
//# sourceMappingURL=widget.component.js.map