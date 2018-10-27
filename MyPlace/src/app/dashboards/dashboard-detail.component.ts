import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { WidgetComponentsService } from "./services/widgetComponents.service";
import { IWidgetComponent, WidgetInfo } from "./model/interfaces";
import { DashboardService } from "./services/dashboard.service";
import * as Utils from "./../shared/utils";
import { Store } from "@ngrx/store";
import { AppState } from "../../app/state";
import { DashboardInfo,Team} from "../dashboards/model/interfaces"
import {  NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

    //  ==============================================================================
    //  meta
    //  ==============================================================================
@Component({
    selector: "app-dashboard-detail",
    templateUrl: "./dashboard-detail.component.html",
    styleUrls: ["./dashboard-detail.component.css"]
})

    //  ==============================================================================
    //  class
    //  ==============================================================================
export class DashboardDetailComponent {   
    //  ==============================================================================
    //  declarations
    //  ==============================================================================
    form: FormGroup;  
    @Output() dashboardAdded = new EventEmitter<number>();
    @Output() cancel = new EventEmitter();
    dashboard: DashboardInfo = { columnsCount: 6, description: "", id: 0, name: "", rowHeight:400, isFavorite:false};
    dashboardId: number= 0;
    dashboardHeader: string = "Create a dashboard";
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(
        private fb: FormBuilder,
        private widgetService: WidgetComponentsService,
        private dashboardService: DashboardService,        
        public activeModal: NgbActiveModal,
        private store: Store<AppState>
    ) {
    //  ==============================================================================
    //  the constructor code
    //  ==============================================================================
       
    }

    //    =============================================================================
    //      ng 
    //    =============================================================================
    ngOnInit(): void {
        
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
    onSubmit(): void {
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
        promise.then((r: number) => {
            this.dashboardId = r;                   
            this.activeModal.close(this.dashboardId);
        });
        promise.catch(err => {         
            Utils.errorMessage(err.message);          
            this.activeModal.close(-1);
        });
    }

    onCancel(): void {           
        this.activeModal.close(-1);       
    }
    //    =============================================================================
    //       private methods
    //    =============================================================================
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
