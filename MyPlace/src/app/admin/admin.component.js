var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AdminService } from "../admin/admin.service";
import { Component } from '@angular/core';
import * as Utils from "../shared/utils";
let AdminComponent = class AdminComponent {
    //@ViewChild("permissionsCmp") permissionComponent: AdminPermissionComponent;
    //@ViewChild("rolesCmp") roleComponent: AdminRoleComponent;
    constructor(adminSrv, actions$, store, route) {
        this.adminSrv = adminSrv;
        this.store = store;
        this.route = route;
        this.isAdmin = false;
        this.isOwner = false;
        this.companyName = "";
        this.ownerTabs = [
            {
                id: 0,
                text: "Companies",
                icon: ""
            },
            {
                id: 1,
                text: "Users",
                icon: ""
            }
        ];
        this.ownerTab = "Companies";
        this.adminTabs = [
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
            }
        ];
        this.adminTab = "Users";
        this.store.select(s => s.admin).subscribe(r => this.user = r.user);
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
    getUser() {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUser().subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
            this.companyName = result.companyName;
            this.isOwner = result.isOwner;
            this.isAdmin = result.isAdmin;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
};
AdminComponent = __decorate([
    Component({
        templateUrl: "./admin.component.html",
        selector: "app-admin",
        providers: [AdminService]
    })
], AdminComponent);
export { AdminComponent };
//# sourceMappingURL=admin.component.js.map