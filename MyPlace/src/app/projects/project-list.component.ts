import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, Event, NavigationEnd } from "@angular/router";
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
import { PlotTemplate } from "../chart/model/chart-plot-settings";
import { ShareSettings } from "../chart/model/share-settings";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import * as ChartActions from "../chart/state/chart.actions";
import * as PrefereceActions from "../preferences/state/preferences.actions";
import { ProjectListItem } from "./model/project-list-item";
import { AppState, SetProjects, StartRefreshPlotTemplates, Unauthorized, ProjectsState} from "../state";

import { UserPreferencesService } from "../preferences/state/preferences.service";
import { ProjectService } from "../project/state/project.service";
import { ChartService } from "../chart/state/chart.service";
import * as FileSaver from "file-saver";

import { PopupService } from "../shared/popup/popup.service";
//import notify from 'devextreme/ui/notify';
import { FileBlob } from "../shared/model/file.blob";
import * as Utils from "../shared/utils";
import { dispatch } from "rxjs/internal/observable/pairs";
import { LocalizationBaseComponent } from "../core/localization-base.component";

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

function isStitched(project: ProjectListItem): boolean {
    let result: boolean = false;
    if (project != null && project != undefined)
        result = project.stitchedFromNames != null;
    return result;
}

@Component({
    templateUrl: "./project-list.component.html",
    styleUrls: ["./project-list.component.css"]
})
export class ProjectListComponent extends LocalizationBaseComponent {
    @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;
    plotTemplates: PlotTemplate[];
    maxProjects = environment.maxProjects;
    customQuery = "";
    step = 1;
    dataSource: any;
    selected = [];
    selectedProjects = [];
    filterRowVisible = false;
    private hasStitchedFromNames = false;
    file: FileBlob;
    currentFontStyle: any;
    currentColor: any;
    saleAmountHeaderFilter: any;
    applyFilterTypes: any;
    currentFilter: any;
    showFilterRow: boolean;
    showHeaderFilter: boolean;
    clickTimer: any;
    lastRowCLickedId: any;
    isStitched: boolean = false;
    filterBuilderPosition: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private http: HttpClient,
        private projectService: ProjectService,
        private chartService: ChartService,
        private userPreferencesService: UserPreferencesService,
        private popSrv: PopupService) {

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
        this.store.dispatch(new StartRefreshPlotTemplates());
        this.store.select(s => s.chart.plotTemplates).subscribe(s => this.plotTemplates = s);
        this.loadPreferences();
        this.showFilterRow = true;
        this.showHeaderFilter = true;
        this.applyFilterTypes = [{
            key: "auto",
            name: "Immediately"
        }, {
            key: "onClick",
            name: "On Button Click"
            }];
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                // trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
                // if you need to scroll back to top, here is the right place
                window.scrollTo(0, 0);
            }
        });
    }
 
    onPlot(): void {
        this.saveProjectViewerState(this.grid.instance.state());
        this.store.dispatch(new SetProjects(this.selected));
        this.step = 2;
    }

    onPlotJS(): void {     
        this.saveProjectViewerState(this.grid.instance.state());
        this.store.dispatch(new SetProjects(this.selected));
        this.step = 0;
    }

    onAddNewProject(): void {
        this.router.navigate(["upload"]);
    }

    onToggleEraseSettingsClick(): void {
        this.customQuery = "";
        this.filterRowVisible = false;
        this.selected = [];
        this.selectedProjects = [];
        this.grid.instance.clearFilter();
        this.grid.instance.refresh();

        const state = this.grid.instance.state();

        state.pageIndex = 0;
        state.pageSize = 10;
        state.searchText = "";
        state.selectedRowKeys = [];

        for (let index = 0; index < state.columns.length; index++) {
            const column = state.columns[index];

            delete column.groupIndex;
            column.visibleIndex = index;
        }

        this.grid.instance.state(state);
    }

    onAverage(): void {

        this.step = 5;
    }

    onStitch(): void {
        this.step = 3;
    }

    onView(): void {
        if (this.isProjectsContaintsAverage())
            this.plotTemplates = this.plotTemplates.filter(r => r.name.toLocaleLowerCase().includes("cycle"));
        else
            this.store.select(s => s.chart.plotTemplates).subscribe(s => this.plotTemplates = s);

        this.step = 4;
    }

    onCloseChart(): void {
        this.step = 1;
    }

    onCloseView(): void {
        this.step = 1;
    }

    onCloseStitcher(): void {
        this.step = 1;
    }

    onDeselectAllProjects(): void {
        this.grid.instance.clearSelection();
    }

    onRefresh(): void {
        this.loadProjectViewerState()
            .then((s) => {
                // maybe we need to check if s != undefined
                this.grid.instance.state(s);
                this.grid.instance.refresh();
            });
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

    onSelectionChanged(e: ISelectionChangedEvent): void {
        const notReady = e.currentSelectedRowKeys.filter(id => !hasData(e.selectedRowsData.find(p => p.id === id)));
        e.component.deselectRows(notReady);
        this.selectedProjects = e.component.getSelectedRowsData();
        this.isStitched = isStitched(this.selectedProjects[0]);
    }

    onShareProjectSave(shareSettings: ShareSettings): void {
        let projects = [];
        for (const project of this.selectedProjects) {
            projects.push(project.id);
        }
        if (Utils.checkEmail(shareSettings.email)) {
            var promise = new Promise((resolve, reject) => {
                this.chartService.shareProject(projects, shareSettings.email)
                    .subscribe(r => resolve(r), error => reject(error));
            });
            promise.then((result: any) => {
                Utils.successMessage("All projects have been shared successfully.")
            });
            promise.catch(err => {
                Utils.errorMessage(err.message);
            });
        }
        else
            Utils.errorMessage(`The "${shareSettings.email}" is not valid email format.`)
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

    onProjectDownload(projectId): void {
        const project = this.selectedProjects.find(item => item.id === projectId);
        var promise = new Promise((resolve, reject) => {
            this.projectService.download(project)
                .pipe(filter(file => !!file))
                .subscribe(file => resolve(file), error => reject(error));
        });
        promise.then((file: FileBlob) => {
            FileSaver.saveAs(file.blob, file.name);
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }

    isAveragePlotCreationEnabled(): boolean {
        return (this.selected.length > 1 && this.selected.length < this.maxProjects) && this.selectedProjects.filter(item => item.isAveragePlot).length === 0;
    }

    loadPreferences() {
        const promise = new Promise<any>((resolve, reject) => {
            this.userPreferencesService.getPreferences()
                .pipe(filter(p => !!p))
                .subscribe(
                    preferences => {
                        resolve(preferences.otherPreferences.maxSelectedProjectCount);
                    },
                    err => {
                        Utils.errorMessage(err.message);
                        //console.error(err);
                        resolve();
                    });
        });
        promise.then(m => this.maxProjects = m > 0 ? m : environment.maxProjects);
    }

    loadProjectViewerState = () => {
        const promise = new Promise<any>((resolve, reject) => {
            this.userPreferencesService.getPreferences()
                .pipe(filter(p => !!p))
                .subscribe(
                    preferences => {
                        resolve(preferences.projectViewerPreferences);
                    },
                    err => {
                        Utils.errorMessage(err.message);
                        //console.error(err);
                        resolve();
                    });
        });

        return promise;
    }

    saveProjectViewerState = (state) => {
        const promise = new Promise<any>((resolve, reject) => {
            this.store.select(s => s.userPreferences)
                .pipe(
                    withLatestFrom(this.store),
                    take(1)
                ).subscribe(s => {
                    const prefernces = s[0].preferences;
                    prefernces.projectViewerPreferences = state;

                    this.userPreferencesService.savePreferences(prefernces)
                        .subscribe(
                            p => resolve(),
                            err => {
                                Utils.errorMessage(err.message);
                                //console.error(err);
                                resolve();
                            });
                })
        });
    }

    onDelete(e): void {
        let projects = [];
        let showProjects = "";
        for (const project of this.selectedProjects) {
            projects.push(project.id);
            showProjects += project.name + ", ";
        }
        showProjects = showProjects.replace(/,\s*$/, "");
        this.popSrv.showConfirm("Delete selected project(s)", "Do you want to delete the following project(s)? :" + showProjects).subscribe(($e) => { this.onConfirmDelete($e, projects); })
    }

    onConfirmDelete(event, projects) {
        if (event) {
            var promise = new Promise((resolve, reject) => {
                this.store.dispatch(new ChartActions.DeleteProjects(projects));
                resolve();
            });
            promise.then(() => this.onRefresh());
        }
    }

    onUpdateMeasurements(): void {
        if (this.selectedProjects.length == 1) {
            let currentprojectId: any = this.selectedProjects[0].id;
            let currentprojectName: any = this.selectedProjects[0].name;

            this.router.navigate([currentprojectId, "measurements"], { relativeTo: this.route })
            //this.router.navigate(["measurement", { projectId: currentprojectId, projectName: currentprojectName }]);
        }
    }

    getWidth(e: any) {
        var r: any = e.getBoundingClientRect();
        return r.right - r.left;
    }
    onRowClick(e: any) {
        //var rows = e.component.getSelectedRowsData();
        if (this.clickTimer && this.lastRowCLickedId === e.rowIndex) {
            clearTimeout(this.clickTimer);
            this.clickTimer = null;
            this.lastRowCLickedId = e.rowIndex;
            //console.log('double'); 
            //let projects = [];
            ////console.log(projects);
            //projects.push(rows[0].id);
            ////console.log(rows); 
            //this.saveProjectViewerState(this.grid.instance.state());
            //this.store.dispatch(new SetProjects(projects));
            //this.step = 2;
            this.onPlotJS();
        }
        else {
            this.clickTimer = setTimeout(function () {
                //console.log('single');
            }, 150);
        }

        this.lastRowCLickedId = e.rowIndex;
    }

    // private
    private isProjectsContaintsAverage(): boolean {
        let result: boolean = false;
        var r = this.selectedProjects.filter(r => r.isAveragePlot == true);
        if (r != null && r != undefined && r.length > 0)
            result = true;

        return result;
    }

    private onSearch(e: ISearchPanel): void {
        //console.log(e);     
        if (e.name == "searchPanel" && e.fullName == "searchPanel.text") {        
            if ((e.previousValue == null || e.previousValue == undefined || e.previousValue == "") &&
                (e.value != null && e.value != undefined && e.value != "")) {
                let projects:number[] = [];              
                for (const project of this.selectedProjects) {
                    projects.push(project.id);                   
                }
                //this.store.dispatch(new SaveSelectedProject(projects));
                this.store.select(s => s.projectsState).subscribe(s => s.selectedProjects = projects);                
            }
            if ((e.value == null || e.value == undefined || e.value == "") &&
                (e.previousValue != null && e.previousValue != undefined && e.previousValue != "")) {
                this.onDeselectAllProjects(); 
                let projectsToSelect: number[];
                this.store.select(s => s.projectsState).subscribe(s =>
                {
                    if (s != null && s != undefined && s.selectedProjects != null && s.selectedProjects != undefined) {
                        projectsToSelect = s.selectedProjects;                     
                        this.grid.instance.selectRows(projectsToSelect,true);    
                    }                                  
                });               
            }
        }
    }

}
