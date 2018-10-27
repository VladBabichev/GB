var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AdminService } from "../../admin/admin.service";
import { Component } from '@angular/core';
let AdminPermissionComponent = class AdminPermissionComponent {
    constructor(adminSrv, actions$, store) {
        this.adminSrv = adminSrv;
        this.store = store;
    }
    ngOnInit() {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUser().subscribe(result => this.user = result);
            resolve();
        });
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getContributors().subscribe(result => this.users = result);
            resolve();
        });
    }
    onContentReady(e) {
        if (this.users != null && this.users != undefined && this.users.length > 0) {
            if (e.component.getSelectedRowKeys().length == 0)
                e.component.selectRowsByIndexes([0]);
        }
    }
    onCellPrepared(e) {
        if (e.data != undefined) {
            e.cellElement.css("background-color", e.data.backColor);
            e.cellElement.css("color", e.data.foreColor);
        }
    }
    onRefresh() {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getContributors().subscribe(result => this.users = result);
            resolve();
        });
        this.adminSrv.getUserPermissions(this.currentUserId).subscribe(result => this.userPermissions = result);
    }
    onUserSelectionChanged(e) {
        this.currentUserId = e.component.getSelectedRowsData()[0].userId;
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUserPermissions(this.currentUserId).subscribe(result => this.userPermissions = result);
            resolve();
        });
    }
    onPermissionRowUpdated(e) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveUserPermission({ resourceGroupId: e.key.resourceGroupId, userId: e.key.userId, resourceName: "", checked: e.data.checked }).subscribe();
            resolve();
        });
    }
};
AdminPermissionComponent = __decorate([
    Component({
        templateUrl: "./admin-permissions.component.html",
        selector: "app-admin-permissions",
        providers: [AdminService]
    })
], AdminPermissionComponent);
export { AdminPermissionComponent };
//# sourceMappingURL=admin-permissions.component.js.map