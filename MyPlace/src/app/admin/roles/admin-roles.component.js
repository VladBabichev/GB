var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AdminService } from "../../admin/admin.service";
import { Component, ViewChild } from '@angular/core';
import * as Utils from "../../shared/utils";
let AdminRoleComponent = class AdminRoleComponent {
    constructor(adminSrv, actions$, store) {
        this.adminSrv = adminSrv;
        this.store = store;
        this.selected = [];
        this.isAdmin = false;
        this.isOwner = false;
        //this.store.select(s => s.admin).subscribe(r => this.user = r.user);   
        //this.store.select(s => s.admin).subscribe(r => this.companies = r.companies);    
    }
    ngOnInit() {
        //roles
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getRoles()
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
            this.roles = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
        // user role
        this.getUserRoles();
        // Owner
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUser().subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
            this.isOwner = result.isOwner;
            this.user = result;
            //alert(this.isOwner);
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
        // companies
        this.getComponies();
    }
    onRefresh() {
        // user role
        this.getUserRoles();
        // companies
        this.getComponies();
    }
    onRowUpdated(e) {
        var companyId;
        if (e.data.companyId == undefined) {
            companyId = e.key.companyId;
        }
        else {
            companyId = e.data.companyId;
        }
        var roleId;
        if (e.data.roleId == undefined) {
            roleId = e.key.roleId;
        }
        else {
            roleId = e.data.roleId;
        }
        if (this.isOwner && (companyId == 0 || companyId == null || companyId == undefined || companyId == NaN)) {
            e.data.roleId = "-1";
            e.key.roleId = "-1";
            roleId = "-1";
        }
        let r = { userId: e.key.userId, roleId: roleId, companyId: companyId, roleName: "", userName: "", email: "", isAdmin: false, isOwner: false };
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveRole(r).subscribe();
            resolve();
        });
    }
    onRowRemoving(e) {
        e.cancel = new Promise((resolve, reject) => {
            this.adminSrv.deleteUser(e.key.userId).subscribe(r => resolve(r), error => reject(error));
        }).then(r => {
            return false;
        }).catch(err => {
            Utils.errorMessage(err.message);
            return true;
        });
    }
    onEditorPreparing(e) {
        if (e.dataField == "companyId") {
            let standardHandler = e.editorOptions.onValueChanged;
            let grid = this.rolesGrid;
            e.editorOptions.onValueChanged = function (e) {
                standardHandler(e); // Calling the standard handler to save the edited value
                grid.instance.saveEditData();
            };
        }
        else if (e.dataField == "roleId") {
            if (this.isOwner) {
                if (e.row.data.companyId == 0 || e.row.data.companyId == null || e.row.data.companyId == undefined || e.row.data.companyId == NaN) {
                    e.editorOptions.disabled = true;
                }
            }
            else {
                e.editorOptions.disabled = false;
                let standardHandler = e.editorOptions.onValueChanged;
                let grid = this.rolesGrid;
                e.editorOptions.onValueChanged = function (e) {
                    standardHandler(e); // Calling the standard handler to save the edited value
                    grid.instance.saveEditData();
                };
            }
        }
    }
    deactivateUser(e) {
        this.setUserActiveState(e, false);
    }
    activateUser(e) {
        this.setUserActiveState(e, true);
    }
    showActiveUsers() {
        this.getUserRoles();
    }
    showInActiveUsers() {
        this.getUserRoles(false);
    }
    isActivationActionEnabled(e) {
        const model = e.row.data;
        return model.roleId != null
            && model.roleId != undefined
            && model.roleId != "-1"
            && model.companyId > 0;
    }
    getComponies() {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getCompanies(1).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
            this.companies = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    getUserRoles(isActive = true) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUserRoles(isActive)
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
            this.userRoles = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    setUserActiveState(e, isActive) {
        const model = JSON.parse(JSON.stringify(e.row.data));
        model.isActive = isActive;
        this.adminSrv.updateUser(model).subscribe(_ => this.getUserRoles(!isActive), err => Utils.errorMessage(err.message));
    }
};
__decorate([
    ViewChild("rolesGrid")
], AdminRoleComponent.prototype, "rolesGrid", void 0);
AdminRoleComponent = __decorate([
    Component({
        selector: "app-admin-roles",
        styleUrls: ["./admin-roles.component.css"],
        templateUrl: "./admin-roles.component.html",
        providers: [AdminService]
    })
], AdminRoleComponent);
export { AdminRoleComponent };
//# sourceMappingURL=admin-roles.component.js.map