import { AdminService } from "../../admin/admin.service";
import { Role, CompaniesResult, RolesResult, User, Project, ResourceGroup, UserRole, Company } from "../model/interfaces";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../../state";
import { Observable, Subject, ErrorObserver, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from "@angular/common/http/src/response";

import { DxDataGridComponent } from "devextreme-angular";
import * as Utils from "../../shared/utils";

interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number;
    selectedRowsData: Role;
}

@Component({
    selector: "app-admin-roles",
    styleUrls: ["./admin-roles.component.css"],
    templateUrl: "./admin-roles.component.html",
    providers: [AdminService]
})

export class AdminRoleComponent {
    roles: Role[];
    companies: Company[];
    selected = [];
    userRoles: UserRole[];
    user: User;
    isAdmin: boolean = false;
    isOwner: boolean = false;
    err$: ErrorObserver<User>
    err: HttpErrorResponse;

    @ViewChild("rolesGrid") rolesGrid: DxDataGridComponent;

    constructor(private adminSrv: AdminService, actions$: Actions, private store: Store<AppState>) {
        //this.store.select(s => s.admin).subscribe(r => this.user = r.user);   
        //this.store.select(s => s.admin).subscribe(r => this.companies = r.companies);    
    }

    ngOnInit() {
        //roles
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getRoles()
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result: Role[]) => {
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
        promise.then((result: User) => {
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

    onRefresh(): void {
        // user role
        this.getUserRoles();
        // companies
        this.getComponies();
    }

    onRowUpdated(e) {
        var companyId: any;
        if (e.data.companyId == undefined) {
            companyId = e.key.companyId;
        }
        else {
            companyId = e.data.companyId;
        }

        var roleId: any;
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

        let r: UserRole = { userId: e.key.userId, roleId: roleId, companyId: companyId, roleName: "", userName: "", email: "", isAdmin: false, isOwner: false };
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
            }
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
                }
            }
        }
    }

    deactivateUser(e: any) {
        this.setUserActiveState(e, false);
    }

    activateUser(e: any) {
        this.setUserActiveState(e, true);
    }

    showActiveUsers(): void {
        this.getUserRoles();    
    }

    showInActiveUsers(): void {
        this.getUserRoles(false);    
    }

    isActivationActionEnabled(e: any) : boolean {
        const model = e.row.data;
        return model.roleId != null 
            && model.roleId != undefined
            && model.roleId != "-1"
            && model.companyId > 0;
    }

    getComponies(): void {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getCompanies(1).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result: Company[]) => {
            this.companies = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    getUserRoles(isActive: boolean = true): void {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUserRoles(isActive)
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result: UserRole[]) => {
            this.userRoles = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }

    private setUserActiveState(e: any, isActive: boolean) {
        const model = JSON.parse(JSON.stringify(e.row.data));
        model.isActive = isActive;

        this.adminSrv.updateUser(model).subscribe(
            _ => this.getUserRoles(!isActive),
            err => Utils.errorMessage(err.message)
        );
    }
}