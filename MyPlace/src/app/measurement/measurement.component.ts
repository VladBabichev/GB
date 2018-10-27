import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';

import { environment } from "../../environments/environment";
import { MeasurementListComponent } from "./measurement-list/measurement-list.component";

@Component({
    templateUrl: "./measurement.component.html",
	styleUrls: ["./measurement.component.css"]
})
export class MeasurementComponent implements OnInit {

	public measurements: DataSource;
	@ViewChild(MeasurementListComponent) measurementsList: MeasurementListComponent;
	
	constructor(
        private router: Router, 
        private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.measurements = this.getDataSource();
	}
	
	onAddNewMeasurement() : void {
        this.router.navigate(["add"], { relativeTo: this.route });
	}

	onRefresh() : void {
		this.measurementsList.refresh();
	}

	onBack() : void {
		this.router.navigate(['/projects']);
	}

	private getDataSource(): any {
		var baseUrl = `${environment.serverBaseUrl}api`;
		var currentProject = this.route.snapshot.params["projectId"];

		return {
		  store: createStore({
			key: 'measurementId',
			loadUrl: `${baseUrl}/measurements?projectId=${currentProject}`,
			updateUrl: `${baseUrl}/measurements?projectId=${currentProject}`,
			deleteUrl: `${baseUrl}/measurements?projectId=${currentProject}`,
			onBeforeSend: function(method, ajaxOptions) {
			  ajaxOptions.xhrFields = { withCredentials: true };
			}
		  })
		}
	}
}

// import { NgModule, Component, Input, ViewChild, OnInit } from "@angular/core";
// import { Router, ActivatedRoute } from "@angular/router";
// import { DxDataGridComponent } from "devextreme-angular";

// import { BrowserModule } from '@angular/platform-browser';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';

// import { environment } from "../../environments/environment";
// import { createStore } from 'devextreme-aspnet-data-nojquery';
// import CustomStore from 'devextreme/data/custom_store';
// import DataSource from 'devextreme/data/data_source';

// import { MeasurementService } from "./state/measurement.service";
// import { specification } from "./model/measurement";
// import { measurement } from "./model/measurement";


// @Component({
//     templateUrl: "./measurement.component.html",
// 	styleUrls: ["./measurement.component.css"]
// })

// export class MeasurementComponent implements OnInit {
// 	@Input() public dataSource: any;
// 	@ViewChild(DxDataGridComponent) private grid: DxDataGridComponent;

// 	specifications: specification[];
// 	projectId: any;
// 	projectName: string;

// 	constructor(
// 		private router: Router,
// 		private route: ActivatedRoute,
// 		private measurementService: MeasurementService) {
// 	}
// 	ngOnInit() {
// 		this.projectId = this.route.snapshot.paramMap.get("projectId");
// 		this.projectName = this.route.snapshot.paramMap.get("projectName");
// 		var promise = new Promise((resolve, reject) => {
// 			this.measurementService.getMeasurements(this.projectId).subscribe(result => this.specifications = result);
// 			resolve();
// 		});
// 	}

//     onRefresh(): void {
// 		this.grid.instance.refresh();
//     }

// 	onInitNewRow(e) {
// 		let specId: number = e.element[0].attributes["data-master"].value;
// 		e.data.projectId = this.projectId;
// 		e.data.specificationId = specId;
// 	}

// 	onRowUpdated(e) {
// 		let specId: number = e.element[0].attributes["data-master"].value;
// 		var promise = new Promise((resolve, reject) => {
// 			this.measurementService.saveMeasurement({ measurementId: e.key.measurementId, projectId: this.projectId, measure: e.key.measure, value: e.key.value, specificationId: specId }).subscribe(result => e.key.measurementId = result);
// 			resolve();
// 		});
// 	}

// 	onRowRemoved(e) {
// 		let specId: number = e.element[0].attributes["data-master"].value;
// 		var promise = new Promise((resolve, reject) => {
// 			this.measurementService.deleteMeasurement({ measurementId: e.key.measurementId, projectId: this.projectId, measure: e.key.measure, value: e.key.value, specificationId: specId }).subscribe();
// 			resolve();
// 		});
// 	}

//     onRowValidating(e) {
// 		let specId: number = e.element[0].attributes["data-master"].value;
// 		let spec: specification = this.specifications.find(r => r.id == specId);
// 		e.errorText = spec.targetTypeName + " must be unique." 
// 		let mex: any = spec.measurements.find(mr => mr.measure == e.newData.measure && mr.measurementId != e.newData.measurementId);
// 		if (mex == undefined || mex == null) {
//             e.isValid = true;
//         }
//             else {
//             e.cancel = true
//             e.isValid = false;
//         }
// 	}

// 	public onBack(): void {
// 		this.router.navigate(['/projects']);
// 	}
// }