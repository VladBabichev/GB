var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AdminService } from "../../admin/admin.service";
import { Component } from '@angular/core';
let AdminResourceGroupComponent = class AdminResourceGroupComponent {
    constructor(adminSrv, actions$, store) {
        this.adminSrv = adminSrv;
        this.store = store;
        this.isOwner = false;
        //resourceTabs: Tab[] = [
        //	{
        //		id: 0,
        //		text: "Projects",
        //		icon: ""
        //	},
        //	{
        //		id: 1,
        //		text: "Views",
        //		icon: ""
        //	},
        //	{
        //		id: 2,
        //		text: "Specifications",
        //		icon: ""
        //	},
        //	{
        //		id: 3,
        //		text: "Devices",
        //		icon: ""
        //	},
        //	{
        //		id: 4,
        //		text: "Plot Templates",
        //		icon: ""
        //	}];
        this.resourceTabs = [
            {
                id: 0,
                text: "Projects",
                icon: ""
            },
            {
                id: 1,
                text: "Plot Templates",
                icon: ""
            },
            {
                id: 2,
                text: "Views",
                icon: ""
            },
            {
                id: 3,
                text: "Specifications",
                icon: ""
            },
            {
                id: 3,
                text: "Dashboards",
                icon: ""
            }
        ];
        this.resourceTab = "Projects";
    }
    ngOnInit() {
        //this.store.select(s => s.admin).subscribe(r => this.resourceGroups = r.resourceGroups);
        //this.store.select(s => s.admin).subscribe(r => this.projects = r.resourceProjects);
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUser().subscribe(result => this.user = result);
            resolve();
        });
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getUser().subscribe(result => this.isOwner = result.isOwner);
            resolve();
        });
        this.loadResourceGroups();
    }
    onContentReady(e) {
        if (this.resourceGroups != null && this.resourceGroups != undefined && this.resourceGroups.length > 0) {
            if (e.component.getSelectedRowKeys().length == 0)
                e.component.selectRowsByIndexes([0]);
        }
    }
    onRefresh() {
        this.loadResourceGroups();
        this.loadResources();
        //this.store.dispatch(new SelectResouceProjects(this.resourceGroupId));
        //this.store.select(s => s.admin).subscribe(r => this.projects = r.resourceProjects);
    }
    onRowRemoved(e) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.deleteResourceGroup({ resourceGroupId: e.key, companyId: this.user.companyId, name: "" }).subscribe(r => resolve(r), error => reject(error));
        });
        promise.then(r => {
            this.error = null;
            //this.onRefresh();
        });
        promise.catch(err => {
            //this.onRefresh();
            this.errResult = err;
            this.error = this.errResult.message;
        });
    }
    onSelectionChanged(e) {
        this.resourceGroupId = e.component.getSelectedRowKeys()[0];
        this.loadResources();
    }
    onResourceGroupUpdated(e) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveResourceGroup({ resourceGroupId: e.key, name: e.data.name, companyId: this.user.companyId }).subscribe(result => e.key = result);
            resolve();
        });
    }
    onResourceGroupInserted(e) {
        var d = this.getResourceGroupById(e.key);
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveResourceGroup({ resourceGroupId: 0, name: e.data.name, companyId: this.user.companyId }).subscribe(result => {
                d.resourceGroupId = result;
                e.component.selectRows([result], false);
            });
            resolve();
        });
    }
    onResourceUpdated(e) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveResource({ resourceGroupId: e.key.resourceGroupId, resourceTypeId: e.key.resourceTypeId, resourceId: e.key.resourceId, name: "", isSelected: e.data.isSelected }).subscribe(result => e.key = result);
            resolve();
        });
    }
    selectResourceTab(e) {
        this.resourceTab = this.resourceTabs[e.itemIndex].text;
    }
    // private methods
    loadResourceGroups() {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getResouceGroups().subscribe(result => resolve(result), error => reject(error));
        });
        promise.then(r => {
            this.error = null;
            this.resourceGroupResult = r;
            this.resourceGroups = this.resourceGroupResult;
        });
        promise.catch(err => {
            this.errResult = err;
            this.error = this.errResult.message;
        });
    }
    loadResources() {
        var prjPromise = new Promise((resolve, reject) => {
            this.adminSrv.getResouceProjects(this.resourceGroupId).subscribe(result => this.projects = result);
            resolve();
        });
        var templPromise = new Promise((resolve, reject) => {
            this.adminSrv.getResouceTemplates(this.resourceGroupId).subscribe(result => this.templates = result);
            resolve();
        });
        var viewPromise = new Promise((resolve, reject) => {
            this.adminSrv.getResouceViews(this.resourceGroupId).subscribe(result => this.views = result);
            resolve();
        });
        var spcPromise = new Promise((resolve, reject) => {
            this.adminSrv.getResouceSpecifications(this.resourceGroupId).subscribe(result => this.specifications = result);
            resolve();
        });
        var dsbPromise = new Promise((resolve, reject) => {
            this.adminSrv.getResouceDashboards(this.resourceGroupId).subscribe(result => this.dashboards = result);
            resolve();
        });
    }
    getResourceGroupById(id) {
        var result;
        for (var i = 0; i < this.resourceGroups.length; i++) {
            if (this.resourceGroups[i].resourceGroupId == id) {
                result = this.resourceGroups[i];
                break;
            }
        }
        return result;
    }
};
AdminResourceGroupComponent = __decorate([
    Component({
        templateUrl: "./admin-resourceGroups.component.html",
        selector: "app-admin-resourceGroups",
        providers: [AdminService]
    })
], AdminResourceGroupComponent);
export { AdminResourceGroupComponent };
//# sourceMappingURL=admin-resourceGroups.component.js.map