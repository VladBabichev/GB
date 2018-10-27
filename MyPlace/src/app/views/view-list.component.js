var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, ViewChild, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { DxDataGridComponent } from "devextreme-angular";
import { EdmLiteral } from 'devextreme/data/odata/utils';
import { environment } from "../../environments/environment";
import { SelectView } from "../chart/state/chart.actions";
import { ViewDeleted, ViewProjects } from "../view/state/view.actions";
import { LocalizationBaseComponent } from "../core/localization-base.component";
let ViewListComponent = class ViewListComponent extends LocalizationBaseComponent {
    constructor(document, router, store, viewService, modalService, chartService, clipboardService) {
        super();
        this.document = document;
        this.router = router;
        this.store = store;
        this.viewService = viewService;
        this.modalService = modalService;
        this.chartService = chartService;
        this.clipboardService = clipboardService;
        this.maxProjects = environment.maxProjects;
        this.filterRowVisible = false;
        this.hasStitchedFromNames = false;
        this.links = [];
        this.step = 1;
        this.step = 1;
        this.store.dispatch(new ViewProjects());
        this.store.select(s => s.viewer.views).subscribe(s => this.dataSource = s);
    }
    onRefresh() {
        this.grid.instance.refresh();
    }
    onCloseChart() {
        this.step = 1;
    }
    onCellPrepared(e) {
        if (e.rowType === "data" && e.column.command === "select") {
            e.cellElement.find(".dx-select-checkbox").dxCheckBox("instance").option("disabled", true);
            e.cellElement.off();
        }
    }
    onRowRemoving(e) {
        this.store.dispatch(new ViewDeleted(e.data.id));
        this.step = 1;
    }
    onSelectionChanged(e) {
        this.store.dispatch(new SelectView(e.component.getSelectedRowsData()[0]));
        //this.store.dispatch(new StartRefreshPlotTemplates());        
        this.step = 2;
        //alert(e.component.getSelectedRowsData()[0].id);
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
    onShareView(dialogContent, data) {
        let currentLink = this.links.find(item => item.id == data.id);
        if (!currentLink) {
            currentLink = {
                id: data.id,
                name: data.name,
                link: null
            };
            this.links.push(currentLink);
        }
        this.sharedLink = currentLink.link;
        this.showSharedLinkInfo = false;
        this.sharedView = data;
        this.modalService.open(dialogContent);
    }
    onCreateSharedLink(id, expirationDuration) {
        this.chartService.getSharedViewToken(id, expirationDuration)
            .subscribe(token => {
            const currentLink = this.links.find(item => item.id == id);
            currentLink.link = `${this.document.location.origin}/shared/view/${token}`;
            this.sharedLink = currentLink.link;
        });
    }
    onCopySharedLink() {
        this.showSharedLinkInfo = true;
        this.clipboardService.copyFromContent(this.sharedLink);
    }
};
__decorate([
    ViewChild(DxDataGridComponent)
], ViewListComponent.prototype, "grid", void 0);
ViewListComponent = __decorate([
    Component({
        templateUrl: "./view-list.component.html",
        styleUrls: ["./view-list.component.css"]
    }),
    __param(0, Inject(DOCUMENT))
], ViewListComponent);
export { ViewListComponent };
//# sourceMappingURL=view-list.component.js.map