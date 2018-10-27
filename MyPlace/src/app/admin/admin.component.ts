import { AdminService, Tab } from "../admin/admin.service";
import { User } from "./model/interfaces";
import { Component } from '@angular/core';
//import { TabModule } from 'angular-tabs-component';
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState, AuthState } from "../state";
import { Observable } from "rxjs";
import * as Utils from "../shared/utils";
import { Router } from "@angular/router";

@Component({
    templateUrl: "./admin.component.html",
    selector: "app-admin",
    providers: [AdminService]
})

export class AdminComponent {   
    user: User;
    isAdmin: boolean = false;
    isOwner: boolean = false;
	companyName: string = "";
	state$: Observable<AuthState>;
    router: Router;

	ownerTabs: Tab[] = [
	{
		id: 0,
		text: "Companies",
		icon: ""
	},
	{
		id: 1,
		text: "Users",
		icon: ""
		}];
	ownerTab: string = "Companies";

	adminTabs: Tab[] = [
		{
			id: 0,
			text: "Users",
			icon: ""
		},
		{
			id: 1,
			text: "Resources",
			icon: ""
		},
		{
			id: 2,
			text: "Permissions",
			icon: ""
		}];
	adminTab: string = "Users";


	//@ViewChild("permissionsCmp") permissionComponent: AdminPermissionComponent;
	//@ViewChild("rolesCmp") roleComponent: AdminRoleComponent;

    constructor(private adminSrv: AdminService, actions$: Actions, private store: Store<AppState>, private route: Router) {
      this.store.select(s => s.admin).subscribe(r => this.user=r.user);   
        this.state$ = this.store.select(s => s.auth);
        this.router = route;
    }

    ngOnInit() {
        this.getUser();
        this.state$.subscribe(r => {
            if (!r.isAdmin && !r.isOwner) {
                if (this.route.url.toString().toLowerCase().indexOf("admin") >= 0) {
                    this.router.navigate(["/projects"]);
                }
            }
        });      
    }    
	
	selectOwnerTab(e) {
		this.ownerTab = this.ownerTabs[e.itemIndex].text;
	}
	selectAdminTab(e) {
		this.adminTab = this.adminTabs[e.itemIndex].text;
    }
    // ================================================================================
    //  private methods
    // ================================================================================
    private getUser(): void {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUser().subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result: User) => {
            this.companyName = result.companyName;
            this.isOwner = result.isOwner;
            this.isAdmin = result.isAdmin;
        });
        promise.catch(err => {           
            Utils.errorMessage(err.message);
        });
    }
}