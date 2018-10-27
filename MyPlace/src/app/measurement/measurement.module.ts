import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
    DxDataGridModule,
    DevExtremeModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxRangeSelectorModule
} from "devextreme-angular";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";

import { SharedModule } from "../shared/shared.module";

import { MeasurementComponent } from "./measurement.component";
import { MeasurementDetailComponent } from "./measurement-detail/measurement-detail.component";
import { MeasurementsRouteModule } from "./measurement-routes.module";
import { MeasurementListComponent } from "./measurement-list/measurement-list.component";
import { MeasurementService } from "./state/measurement.service";
import { MeasurementDetailResolver } from "./measurement-detail/measurement-detail.resolver";
import { MeasurementSpecificationModalComponent } from "./measurement-specification-modal/measurement-specification-modal.component";

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        DxDataGridModule,
        DevExtremeModule,
        DxNumberBoxModule,
        DxRangeSelectorModule,
        DxTextBoxModule,
        NgbModule,
        AngularMultiSelectModule,
        MeasurementsRouteModule
    ],
    declarations: [
        MeasurementComponent,
        MeasurementListComponent,
        MeasurementDetailComponent,
        MeasurementSpecificationModalComponent
    ],
    providers: [
        MeasurementService,
        MeasurementDetailResolver
    ],
    entryComponents: [MeasurementSpecificationModalComponent]
  })
  export class MeasurementsModule {}