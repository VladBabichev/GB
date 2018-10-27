import { AdminService, Tab } from "../../admin/admin.service";
import { User,ResourceGroup, ResourceGroupsResult,Company,Resource,ResourceResult } from "./../model/interfaces";
import { Component } from '@angular/core';
//import { TabModule } from 'angular-tabs-component';
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../../state";
import { Observable, Subject, ErrorObserver } from "rxjs";
import { AdminState } from "./../state/admin.state";
import { SelectResouceGroups,SelectResouceProjects } from "./../state/admin.actions";
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { DxTabsModule, DxSelectBoxModule } from 'devextreme-angular';

interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number;
    selectedRowsData: ResourceGroup;
}

@Component({
    templateUrl: "./admin-resourceGroups.component.html",
    selector: "app-admin-resourceGroups",
    providers: [AdminService]
})

export class AdminResourceGroupComponent {   
    resourceGroupResult:any
    resourceGroups: ResourceGroup[];    
    user: User;
    companies: Company[]; 
	projects: Resource[]; 
	specifications: Resource[]; 
	templates: Resource[]; 
	views: Resource[]; 
	dashboards: Resource[]; 
    resourceGroupId: number;
    isOwner: boolean = false;
    error: any;
	errResult: HttpErrorResponse;

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
	resourceTabs: Tab[] = [
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
		}];

	resourceTab: string = "Projects";

    constructor(private adminSrv: AdminService, actions$: Actions, private store: Store<AppState>) {      
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

	onContentReady(e): void {
		if (this.resourceGroups != null && this.resourceGroups != undefined && this.resourceGroups.length > 0) {
			if (e.component.getSelectedRowKeys().length == 0)
				e.component.selectRowsByIndexes([0]);          
		}
	}  

    onRefresh(): void {
        this.loadResourceGroups();
		this.loadResources();
        //this.store.dispatch(new SelectResouceProjects(this.resourceGroupId));
        //this.store.select(s => s.admin).subscribe(r => this.projects = r.resourceProjects);
	}

	onRowRemoved(e) {      
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.deleteResourceGroup({ resourceGroupId: e.key, companyId: this.user.companyId, name: "" }).subscribe(r => resolve(r),  error => reject(error));
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
    onSelectionChanged(e: ISelectionChangedEvent): void {
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

		var d: ResourceGroup = this.getResourceGroupById(e.key);
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
	private loadResourceGroups() {
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

	private loadResources() {
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
	
 	private getResourceGroupById(id: any): ResourceGroup {
		var result: ResourceGroup;
		for (var i = 0; i < this.resourceGroups.length; i++) {
			if (this.resourceGroups[i].resourceGroupId == id) {
				result = this.resourceGroups[i];
				break;
			}
		}
		return result;
	}


}