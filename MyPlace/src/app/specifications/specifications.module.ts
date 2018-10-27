import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from '@angular/forms';

import {
    DxDataGridModule,
    DevExtremeModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxRangeSelectorModule
} from "devextreme-angular";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from '../shared/shared.module';

import { SpecificationsComponent } from "./specifications.component";
import { SpecificationsRouteModule } from "./specifications-routes.module";
import { SpecificationListComponent } from "./specificication-list/specification-list.component";
import { SpecificationDetailComponent } from "./specification-detail/specification-detail.component";
import { SpecificationExpectationModalComponent } from "./specification-detail/specification-expectation-modal/specification-expectation-modal.component";

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
        SpecificationsRouteModule, 
        NgbModule
    ],
    declarations: [
        SpecificationsComponent,
        SpecificationDetailComponent,
        SpecificationListComponent,
        SpecificationExpectationModalComponent
    ],
    entryComponents: [SpecificationExpectationModalComponent]
  })
  export class SpecificationsModule {}