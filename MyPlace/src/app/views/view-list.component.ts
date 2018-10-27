import { Component, ViewChild, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { DxDataGridComponent } from "devextreme-angular";
import { EdmLiteral } from 'devextreme/data/odata/utils';
import { ClipboardService } from "ngx-clipboard";

import { environment } from "../../environments/environment";
import { PlotTemplateShort, View } from "../view/model/view-projects-params";
import { ViewService, } from "../view/state/view.service";
import { AppState } from "../state";
import { SelectView, StartRefreshPlotTemplates, SetProjects } from "../chart/state/chart.actions";
import { ViewDeleted, ViewProjects } from "../view/state/view.actions";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { ChartService } from "../chart/state/chart.service";
import { LocalizationBaseComponent } from "../core/localization-base.component";

interface ICellPreparedEvent {
    data: View;
    cellElement: any; // JQuery
    column: {
        command: string
    };
    rowType: string;
}

interface EditingStartEvent {
    data: View;
}

interface IEditorPreparingEvent {
    editorName: string;
    dataField: string;
    parentType: string;
    editorOptions: { height: number; }
}

interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number;
    selectedRow: View;
}

interface IRowPreparedEvent {
    data: View;
    rowElement: any; // JQuery
    rowType: string;
}

interface SimpleItem {
    dataField: string;
    visible: boolean;
}

@Component({
    templateUrl: "./view-list.component.html",
    styleUrls: ["./view-list.component.css"]
})

export class ViewListComponent extends LocalizationBaseComponent {
    @ViewChild(DxDataGridComponent)
    grid: DxDataGridComponent;
    maxProjects = environment.maxProjects; 
    dataSource: any;
    filterRowVisible = false;
    private hasStitchedFromNames = false;
    private links = [];
    step = 1;
    sharedView: any;
    sharedLink: string;
    showSharedLinkInfo: boolean;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private router: Router,
        private store: Store<AppState>,
        private viewService: ViewService,
        private modalService: NgbModal,
        private chartService: ChartService,
        private clipboardService: ClipboardService ) {

        super();

        this.step = 1;
        this.store.dispatch(new ViewProjects());
        this.store.select(s => s.viewer.views).subscribe(s => this.dataSource = s);
	}

    onRefresh(): void {
        this.grid.instance.refresh();
    }

    onCloseChart(): void {
        this.step = 1;
    }

    onCellPrepared(e: ICellPreparedEvent): void {
        if (e.rowType === "data" && e.column.command === "select") {
            e.cellElement.find(".dx-select-checkbox").dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }
    }

    onRowRemoving(e: IRowPreparedEvent): void {     
            this.store.dispatch(new ViewDeleted(e.data.id));
            this.step = 1;          
    }

    onSelectionChanged(e: ISelectionChangedEvent): void {
        this.store.dispatch(new SelectView(e.component.getSelectedRowsData()[0]));
        //this.store.dispatch(new StartRefreshPlotTemplates());        
        this.step = 2;
        //alert(e.component.getSelectedRowsData()[0].id);
    }

    calculateDateTimeFilterExpression(filterValue: any, selectedFilterOperation: string): void {
        const filter = this["defaultCalculateFilterExpression"](filterValue, selectedFilterOperation);
        if (filter) {
            if (Array.isArray(filter[0])) {
                filter[0][2] = new EdmLiteral(filter[0][2].toISOString())
                filter[2][2] = new EdmLiteral(filter[2][2].toISOString())
            }
            else {
                filter[2] = new EdmLiteral(filter[2].toISOString())
            }
        }
        return filter;
    }

    onShareView(dialogContent, data: any): void {
        let currentLink = this.links.find(item => item.id == data.id);
        if (!currentLink) {
            currentLink = {
                id: data.id,
                name: data.name,
                link: null
            }

            this.links.push(currentLink);
        }

        this.sharedLink = currentLink.link;
        this.showSharedLinkInfo = false;
        this.sharedView = data;
        this.modalService.open(dialogContent);
    }

    onCreateSharedLink(id: any, expirationDuration: number): void {
        this.chartService.getSharedViewToken(id, expirationDuration)
            .subscribe(token => {
                const currentLink = this.links.find(item => item.id == id);
                currentLink.link = `${this.document.location.origin}/shared/view/${token}`; 

                this.sharedLink = currentLink.link;
            });
    }

    onCopySharedLink(): void {
        this.showSharedLinkInfo = true;
        this.clipboardService.copyFromContent(this.sharedLink);
	}
}
