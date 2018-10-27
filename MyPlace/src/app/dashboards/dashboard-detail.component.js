var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as Utils from "./../shared/utils";
//  ==============================================================================
//  meta
//  ==============================================================================
let DashboardDetailComponent = 
//  ==============================================================================
//  class
//  ==============================================================================
class DashboardDetailComponent {
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(fb, widgetService, dashboardService, activeModal, store) {
        //  ==============================================================================
        //  the constructor code
        //  ==============================================================================
        this.fb = fb;
        this.widgetService = widgetService;
        this.dashboardService = dashboardService;
        this.activeModal = activeModal;
        this.store = store;
        this.dashboardAdded = new EventEmitter();
        this.cancel = new EventEmitter();
        this.dashboard = { columnsCount: 6, description: "", id: 0, name: "", rowHeight: 400, isFavorite: false };
        this.dashboardId = 0;
        this.dashboardHeader = "Create a dashboard";
    }
    //    =============================================================================
    //      ng 
    //    =============================================================================
    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.dashboard.name, Validators.required),
            description: new FormControl(this.dashboard.description),
            columnsCount: new FormControl(this.dashboard.columnsCount),
            rowHeight: new FormControl(this.dashboard.rowHeight)
        });
        if (this.dashboardId > 0)
            this.dashboardHeader = "Edit dashboard";
        else
            this.dashboardHeader = "Create a dashboard";
        //this.widgetService.getGridColumsCount().subscribe(w => {
        //    this.ColumnsMax = w;
        //})       
    }
    //    =============================================================================
    //      events handlers
    //    =============================================================================
    onSubmit() {
        this.validate(this.form);
        if (this.form.invalid)
            return;
        this.dashboard = this.form.value;
        this.dashboard.id = this.dashboardId;
        //console.log(this.dashboard);
        //alert(this.dashboard.id);
        var promise = new Promise((resolve, reject) => {
            this.dashboardService.saveDashboard(this.dashboard)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((r) => {
            this.dashboardId = r;
            this.activeModal.close(this.dashboardId);
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
            this.activeModal.close(-1);
        });
    }
    onCancel() {
        this.activeModal.close(-1);
    }
    //    =============================================================================
    //       private methods
    //    =============================================================================
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
    Output()
], DashboardDetailComponent.prototype, "dashboardAdded", void 0);
__decorate([
    Output()
], DashboardDetailComponent.prototype, "cancel", void 0);
DashboardDetailComponent = __decorate([
    Component({
        selector: "app-dashboard-detail",
        templateUrl: "./dashboard-detail.component.html",
        styleUrls: ["./dashboard-detail.component.css"]
    })
    //  ==============================================================================
    //  class
    //  ==============================================================================
], DashboardDetailComponent);
export { DashboardDetailComponent };
//# sourceMappingURL=dashboard-detail.component.js.map