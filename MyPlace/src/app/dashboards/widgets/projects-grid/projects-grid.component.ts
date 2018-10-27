import { Input, Component, ViewChild, AfterViewInit, Injector, Output, EventEmitter} from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd,Event } from "@angular/router";


import { Store } from "@ngrx/store";
import {
    filter,
    withLatestFrom,
    take
} from 'rxjs/operators';

import { DxDataGridComponent } from "devextreme-angular";
import DxDataGrid from 'devextreme/ui/data_grid';
import { EdmLiteral } from "devextreme/data/odata/utils";
import "devextreme/integration/jquery";
import * as filesize from "filesize";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ProjectListItem } from "../../../projects/model/project-list-item";
import { AppState, SetProjects, StartRefreshPlotTemplates, Unauthorized, ProjectsState } from "../../../state";

import { ProjectService } from "../../../project/state/project.service";
//import * as FileSaver from "file-saver";

//import { PopupService } from "../shared/popup/popup.service";
//import notify from 'devextreme/ui/notify';
//import { FileBlob } from "../shared/model/file.blob";
import * as Utils from "../../../shared/utils";
import { dispatch } from "rxjs/internal/observable/pairs";
import { LocalizationBaseComponent } from "../../../core/localization-base.component";
//import { EventEmitter } from "selenium-webdriver";

interface ICellPreparedEvent {
    data: ProjectListItem;
    cellElement: any; // JQuery
    column: {
        command: string
    };
    rowType: string;
}

interface EditingStartEvent {
    data: ProjectListItem;
}

interface IEditorPreparingEvent {
    editorName: string;
    dataField: string;
    parentType: string;
    editorOptions: { height: number };
}

interface IRowPreparedEvent {
    data: ProjectListItem;
    rowElement: any; // JQuery
    rowType: string;
}

interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number[];
    selectedRowsData: ProjectListItem[];
}

interface SimpleItem {
    dataField: string;
    visible: boolean;
}

interface ISearchPanel {
    name: string;
    fullName: string;
    value: string;
    previousValue: string;
}

function hasData(project: ProjectListItem): boolean {
    return project.isReady && !project.failed;
}

@Component({
	selector: 'app-projectsGrid',
    templateUrl: "./projects-grid.component.html",
    styleUrls: ["./projects-grid.component.css"]
})
export class ProjectsGridComponent extends LocalizationBaseComponent {
    @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;
    maxProjects = environment.maxProjects;
    customQuery = "";
    step = 1;
    dataSource: any;
    selected = [];
    selectedProjects = [];
    filterRowVisible = false;
    private hasStitchedFromNames = false;
    currentFontStyle: any;
    currentColor: any;
    saleAmountHeaderFilter: any;
    applyFilterTypes: any;
    currentFilter: any;
    showFilterRow: boolean;
    showHeaderFilter: boolean;
    clickTimer: any;
    lastRowCLickedId: any;
	filterBuilderPosition: any;

	@Input() widgetProperties: string;
    @Output() onSaveProjectViewerState = new EventEmitter<any>();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private http: HttpClient,
		private projectService: ProjectService) {

        super();

        this.filterBuilderPosition = { of: window, at: "top", my: "top", offset: { y: 10 } };
        this.customizeItem = this.customizeItem.bind(this);
        //this.onRowClick = this.onRowClick.bind(this);
        this.dataSource = {
            store: {
                type: "odata",
                key: "id",
                url: environment.serverBaseUrl + "odata/projects",
                version: 4,
                deserializeDates: false,
                withCredentials: true,
                errorHandler: (error) => this.onODataError(error),
                beforeSend: (req) => this.onODataBeforeSend(req)
            }
        };
        this.showFilterRow = true;
        this.showHeaderFilter = true;
        this.applyFilterTypes = [{
            key: "auto",
            name: "Immediately"
        }, {
            key: "onClick",
            name: "On Button Click"
            }];       
    }

    ngOnInit() {
        setTimeout(() => {
            this.onRefresh();
        }, 300000); 
    }

    onRefresh() {
        this.grid.instance.refresh();
        //alert();   
        setTimeout(() => {
            this.onRefresh();
        }, 300000); 
    }
    

    formatFileSize(row: ProjectListItem): string {
        return filesize(row.fileSize);
    }

    formatNumCycles(row: ProjectListItem): number | undefined {
        return hasData(row) ? row.numCycles : undefined;
    }

    onCellPrepared(e: ICellPreparedEvent): void {
        if (e.rowType === "data" && e.column.command === "select" && !hasData(e.data)) {
            e.cellElement.find(".dx-select-checkbox").dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }

        if (e.rowType === "data" && e.column.command === "edit" && e.data.failed) {
            e.cellElement.css("font-style", this.currentFontStyle);
            e.cellElement.css("color", this.currentColor);
        }
    }

    onEditingStart(e: EditingStartEvent): void {
        if (e.data.stitchedFromNames != null && e.data.stitchedFromNames != undefined)
            this.hasStitchedFromNames = !!e.data.stitchedFromNames;
    }

    onEditorPreparing(e: IEditorPreparingEvent): void {
        if (e.dataField === "comments") {
            e.editorName = "dxTextArea";
        }

        if (e.parentType === "filterRow") {
            e.editorOptions.height = undefined;
        }
    }

    customizeItem(item: SimpleItem): void {
        if (item.dataField === "stitchedFromNames" && !this.hasStitchedFromNames) {
            item.visible = false;
        }
    }

    onRowPrepared(e: IRowPreparedEvent): void {
        if (e.rowType === "data") {
            if (!e.data.isReady && !e.data.failed) {
                e.rowElement.css("color", "lightgrey");
                e.rowElement.css("font-style", "italic");
                e.rowElement.prop("title", "Project data is not ready");
            } else if (e.data.failed) {
                this.currentFontStyle = e.rowElement.css("font-style");
                this.currentColor = e.rowElement.css("color");
                e.rowElement.css("color", "crimson");
                e.rowElement.css("font-style", "italic");
                e.rowElement.prop("title", "Project parse failed because of " + (e.data.error || "unknown reason"));
            }
        }
    }

    onToggleFilterRowClick(): void {
        this.filterRowVisible = !this.filterRowVisible;
        this.showFilterRow = !this.showFilterRow;
        if (!this.filterRowVisible) {
            this.grid.instance.clearFilter();
        }
    }

    calculateDateTimeFilterExpression(filterValue: any, selectedFilterOperation: string): void {
        const filter = this["defaultCalculateFilterExpression"](filterValue, selectedFilterOperation);
        if (filter) {
            if (Array.isArray(filter[0])) {
                filter[0][2] = new EdmLiteral(filter[0][2].toISOString());
                filter[2][2] = new EdmLiteral(filter[2][2].toISOString());
            }
            else {
                filter[2] = new EdmLiteral(filter[2].toISOString());
            }
        }
        return filter;
    }

    customizeColumns(columns: any[]) {
        columns.find(col => col.dataField === "createdAt").serializeValue = (val) => val;
        columns.find(col => col.dataField === "updatedAt").serializeValue = (val) => val;
    }

    onODataError(error: any): void {
        if (error && error.httpStatus === 401) {
            this.store.dispatch(new Unauthorized());
        }
        Utils.errorMessage(error.message);
    }

    onODataBeforeSend(req: any): void {
        req.params.customQuery = this.customQuery;
    }

     loadProjectViewerState = () => {
		var result: any;
		try {
			result = JSON.parse(this.widgetProperties);
		}
		catch {
			result = null;
		}
		return result;
    }

	saveProjectViewerState = (state) => {
        this.widgetProperties = JSON.stringify(state);       
        this.onSaveProjectViewerState.emit(this.widgetProperties);		
	}

	getHeight(e: any) {
		return e.clientHeight;
	}

	onRowClick(e: any) {
    //    //var rows = e.component.getSelectedRowsData();
    //    if (this.clickTimer && this.lastRowCLickedId === e.rowIndex) {
    //        clearTimeout(this.clickTimer);
    //        this.clickTimer = null;
    //        this.lastRowCLickedId = e.rowIndex;
    //        //console.log('double'); 
    //        //let projects = [];
    //        ////console.log(projects);
    //        //projects.push(rows[0].id);
    //        ////console.log(rows); 
    //        //this.saveProjectViewerState(this.grid.instance.state());
    //        //this.store.dispatch(new SetProjects(projects));
    //        //this.step = 2;
    //        this.onPlotJS();
    //    }
    //    else {
    //        this.clickTimer = setTimeout(function () {
    //            //console.log('single');
    //        }, 150);
    //    }

    //    this.lastRowCLickedId = e.rowIndex;
    }

    // private
    onSearch(e: ISearchPanel): void {
    //    //console.log(e);     
    //    if (e.name == "searchPanel" && e.fullName == "searchPanel.text") {        
    //        if ((e.previousValue == null || e.previousValue == undefined || e.previousValue == "") &&
    //            (e.value != null && e.value != undefined && e.value != "")) {
    //            let projects:number[] = [];              
    //            for (const project of this.selectedProjects) {
    //                projects.push(project.id);                   
    //            }
    //            //this.store.dispatch(new SaveSelectedProject(projects));
    //            this.store.select(s => s.projectsState).subscribe(s => s.selectedProjects = projects);                
    //        }
    //        if ((e.value == null || e.value == undefined || e.value == "") &&
    //            (e.previousValue != null && e.previousValue != undefined && e.previousValue != "")) {
    //            this.onDeselectAllProjects(); 
    //            let projectsToSelect: number[];
    //            this.store.select(s => s.projectsState).subscribe(s =>
    //            {
    //                if (s != null && s != undefined && s.selectedProjects != null && s.selectedProjects != undefined) {
    //                    projectsToSelect = s.selectedProjects;                     
    //                    this.grid.instance.selectRows(projectsToSelect,true);    
    //                }                                  
    //            });               
    //        }
    //    }
    }

}
