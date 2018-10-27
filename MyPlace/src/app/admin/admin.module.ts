import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import {
    DxDataGridModule,
    DevExtremeModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxRangeSelectorModule
} from "devextreme-angular";

import { SharedModule } from '../shared/shared.module';
import { AdminRouteModule } from "./admin-routes.module";
import { AdminComponent } from "./admin.component";
import { TabModule } from "angular-tabs-component";
import { AdminRoleComponent } from "./roles/admin-roles.component";
import { AdminCompanyComponent } from "./companies/admin-companies.component";
import { AdminResourceGroupComponent } from "./resourceGroups/admin-resourceGroups.component";
import { AdminPermissionComponent } from ".//permissions/admin-permissions.component";
//import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        DxDataGridModule,
        DevExtremeModule,
        DxNumberBoxModule,
        DxRangeSelectorModule,
        DxTextBoxModule,
        AdminRouteModule,
        TabModule
    ],
    declarations: [
        AdminComponent,
        AdminRoleComponent,
        AdminCompanyComponent,
        AdminResourceGroupComponent,
        AdminPermissionComponent
    ]
})
export class AdminModule {
}