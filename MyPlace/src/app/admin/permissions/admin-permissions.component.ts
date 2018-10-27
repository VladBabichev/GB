import { AdminService } from "../../admin/admin.service";
import { User,Permission,PermissionResult,UserRole } from "./../model/interfaces";
import { Component } from '@angular/core';
import { TabModule } from 'angular-tabs-component';
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../../state";
import { Observable, Subject } from "rxjs";
import { AdminState } from "./../state/admin.state";
import { Get, SelectCompanies } from "./../state/admin.actions";


interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number;
    selectedRowsData: UserRole;
}

@Component({
    templateUrl: "./admin-permissions.component.html",
    selector: "app-admin-permissions",
    providers: [AdminService]
})

export class AdminPermissionComponent {
    users: UserRole[];
    userPermissions: Permission[];     
    user: User;
    currentUserId: string;

    constructor(private adminSrv: AdminService, actions$: Actions, private store: Store<AppState>) {
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

	onContentReady(e): void {
		if (this.users != null && this.users != undefined && this.users.length > 0) {
			if (e.component.getSelectedRowKeys().length == 0)
				e.component.selectRowsByIndexes([0]);
		}
	}  

	onCellPrepared(e): void {
		if (e.data != undefined) {
			e.cellElement.css("background-color", e.data.backColor);
			e.cellElement.css("color", e.data.foreColor);
		}
    }

    onRefresh(): void {
		var promise = new Promise((resolve, reject) => {
			this.adminSrv.getContributors().subscribe(result => this.users = result);
			resolve();
		});      
       this.adminSrv.getUserPermissions(this.currentUserId).subscribe(result => this.userPermissions = result);
	}

	onUserSelectionChanged(e: ISelectionChangedEvent): void {

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
}