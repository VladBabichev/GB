var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Input, Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { EdmLiteral } from "devextreme/data/odata/utils";
import "devextreme/integration/jquery";
import * as filesize from "filesize";
import { environment } from "../../../../environments/environment";
import { Unauthorized } from "../../../state";
//import * as FileSaver from "file-saver";
//import { PopupService } from "../shared/popup/popup.service";
//import notify from 'devextreme/ui/notify';
//import { FileBlob } from "../shared/model/file.blob";
import * as Utils from "../../../shared/utils";
import { LocalizationBaseComponent } from "../../../core/localization-base.component";
function hasData(project) {
    return project.isReady && !project.failed;
}
let ProjectsGridComponent = class ProjectsGridComponent extends LocalizationBaseComponent {
    constructor(router, route, store, http, projectService) {
        super();
        this.router = router;
        this.route = route;
        this.store = store;
        this.http = http;
        this.projectService = projectService;
        this.maxProjects = environment.maxProjects;
        this.customQuery = "";
        this.step = 1;
        this.selected = [];
        this.selectedProjects = [];
        this.filterRowVisible = false;
        this.hasStitchedFromNames = false;
        this.onSaveProjectViewerState = new EventEmitter();
        this.loadProjectViewerState = () => {
            var result;
            try {
                result = JSON.parse(this.widgetProperties);
            }
            catch (_a) {
                result = null;
            }
            return result;
        };
        this.saveProjectViewerState = (state) => {
            this.widgetProperties = JSON.stringify(state);
            this.onSaveProjectViewerState.emit(this.widgetProperties);
        };
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
    formatFileSize(row) {
        return filesize(row.fileSize);
    }
    formatNumCycles(row) {
        return hasData(row) ? row.numCycles : undefined;
    }
    onCellPrepared(e) {
        if (e.rowType === "data" && e.column.command === "select" && !hasData(e.data)) {
            e.cellElement.find(".dx-select-checkbox").dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }
        if (e.rowType === "data" && e.column.command === "edit" && e.data.failed) {
            e.cellElement.css("font-style", this.currentFontStyle);
            e.cellElement.css("color", this.currentColor);
        }
    }
    onEditingStart(e) {
        if (e.data.stitchedFromNames != null && e.data.stitchedFromNames != undefined)
            this.hasStitchedFromNames = !!e.data.stitchedFromNames;
    }
    onEditorPreparing(e) {
        if (e.dataField === "comments") {
            e.editorName = "dxTextArea";
        }
        if (e.parentType === "filterRow") {
            e.editorOptions.height = undefined;
        }
    }
    customizeItem(item) {
        if (item.dataField === "stitchedFromNames" && !this.hasStitchedFromNames) {
            item.visible = false;
        }
    }
    onRowPrepared(e) {
        if (e.rowType === "data") {
            if (!e.data.isReady && !e.data.failed) {
                e.rowElement.css("color", "lightgrey");
                e.rowElement.css("font-style", "italic");
                e.rowElement.prop("title", "Project data is not ready");
            }
            else if (e.data.failed) {
                this.currentFontStyle = e.rowElement.css("font-style");
                this.currentColor = e.rowElement.css("color");
                e.rowElement.css("color", "crimson");
                e.rowElement.css("font-style", "italic");
                e.rowElement.prop("title", "Project parse failed because of " + (e.data.error || "unknown reason"));
            }
        }
    }
    onToggleFilterRowClick() {
        this.filterRowVisible = !this.filterRowVisible;
        this.showFilterRow = !this.showFilterRow;
        if (!this.filterRowVisible) {
            this.grid.instance.clearFilter();
        }
    }
    calculateDateTimeFilterExpression(filterValue, selectedFilterOperation) {
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
    customizeColumns(columns) {
        columns.find(col => col.dataField === "createdAt").serializeValue = (val) => val;
        columns.find(col => col.dataField === "updatedAt").serializeValue = (val) => val;
    }
    onODataError(error) {
        if (error && error.httpStatus === 401) {
            this.store.dispatch(new Unauthorized());
        }
        Utils.errorMessage(error.message);
    }
    onODataBeforeSend(req) {
        req.params.customQuery = this.customQuery;
    }
    getHeight(e) {
        return e.clientHeight;
    }
    onRowClick(e) {
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
    onSearch(e) {
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
};
__decorate([
    ViewChild(DxDataGridComponent)
], ProjectsGridComponent.prototype, "grid", void 0);
__decorate([
    Input()
], ProjectsGridComponent.prototype, "widgetProperties", void 0);
__decorate([
    Output()
], ProjectsGridComponent.prototype, "onSaveProjectViewerState", void 0);
ProjectsGridComponent = __decorate([
    Component({
        selector: 'app-projectsGrid',
        templateUrl: "./projects-grid.component.html",
        styleUrls: ["./projects-grid.component.css"]
    })
], ProjectsGridComponent);
export { ProjectsGridComponent };
//# sourceMappingURL=projects-grid.component.js.map