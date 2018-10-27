var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DxDataGridModule, DevExtremeModule, DxTextBoxModule, DxNumberBoxModule, DxRangeSelectorModule } from "devextreme-angular";
import { SharedModule } from '../shared/shared.module';
import { AdminRouteModule } from "./admin-routes.module";
import { AdminComponent } from "./admin.component";
import { TabModule } from "angular-tabs-component";
import { AdminRoleComponent } from "./roles/admin-roles.component";
import { AdminCompanyComponent } from "./companies/admin-companies.component";
import { AdminResourceGroupComponent } from "./resourceGroups/admin-resourceGroups.component";
import { AdminPermissionComponent } from ".//permissions/admin-permissions.component";
//import { MatTabsModule } from '@angular/material/tabs';
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    NgModule({
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
], AdminModule);
export { AdminModule };
//# sourceMappingURL=admin.module.js.map