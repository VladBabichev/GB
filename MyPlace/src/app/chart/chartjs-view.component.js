var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventEmitter, Output, Input, ViewChild } from "@angular/core";
import { ofType } from "@ngrx/effects";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import * as ChartActions from "./state/chart.actions";
import { ChartJSComponent } from "./chart/chartjs.component";
import * as FileSaver from "file-saver";
import * as jsPDF from 'jspdf';
import * as Utils from "../shared/utils";
import { LocalizationBaseComponent } from "../core/localization-base.component";
let ChartJSViewComponent = class ChartJSViewComponent extends LocalizationBaseComponent {
    constructor(actions$, store) {
        super();
        this.store = store;
        this.displaySystemPlotSelector = true;
        this.displayCustomTemplates = true;
        this.displayBackButton = false;
        this.close = new EventEmitter();
        this.cycleFilterVisible = false;
        this.legendVisible = false;
        this.shareVisible = false;
        this.refreshErrorVisible = false;
        this.exportErrorVisible = false;
        this.hasAverageProjects = false;
        this.dead$ = new Subject();
        this.state$ = this.store.select(s => s.chart);
        actions$.pipe(ofType(ChartActions.START_REFRESH), takeUntil(this.dead$)).subscribe(() => this.refreshErrorVisible = false);
        actions$.pipe(ofType(ChartActions.REFRESH_PLOT_TEMPLATE_COMPLEATED), takeUntil(this.dead$)).subscribe((action) => {
            if (action.chart != null) {
                this.shareVisible = true;
                this.legendVisible = action.chart.plotParameters.legendShowen;
            }
        });
        actions$.pipe(ofType(ChartActions.SELECT_VIEW_COMPLEATED), takeUntil(this.dead$)).subscribe((action) => {
            if (action.chart != null) {
                this.shareVisible = true;
                this.legendVisible = action.chart.plotParameters.legendShowen;
            }
        });
        actions$.pipe(ofType(ChartActions.END_REFRESH), takeUntil(this.dead$)).subscribe((action) => {
            if (action.chart != null) {
                this.refreshErrorVisible = false;
                if (action.chart.selectedTemplateName !== null) {
                    this.shareVisible = true;
                    this.legendVisible = action.chart.plotParameters.legendShowen;
                }
                else {
                    this.shareVisible = false;
                    this.legendVisible = action.chart.plotParameters.legendShowen;
                }
                this.hasAverageProjects = action.chart.projects.filter(item => item.isAveragePlot).length !== 0;
            }
        });
        actions$.pipe(ofType(ChartActions.END_DATAPOINTS_REFRESH), takeUntil(this.dead$)).subscribe((action) => {
            this.refreshErrorVisible = false;
            if (action.chart.selectedTemplateName !== null) {
                this.shareVisible = true;
                this.legendVisible = action.chart.plotParameters.legendShowen;
            }
            else {
                this.shareVisible = false;
                this.legendVisible = action.chart.plotParameters.legendShowen;
            }
            this.hasAverageProjects = action.chart.projects.filter(item => item.isAveragePlot).length !== 0;
        });
        actions$.pipe(ofType(ChartActions.REFRESH_FAILED), takeUntil(this.dead$)).subscribe((action) => {
            const errorAction = action;
            Utils.errorMessage(errorAction.error.message);
        });
        actions$.pipe(ofType(ChartActions.START_EXPORT, ChartActions.START_EXPORT_ALL), takeUntil(this.dead$)).subscribe(() => this.exportErrorVisible = false);
        actions$.pipe(ofType(ChartActions.EXPORT_FAILED), takeUntil(this.dead$)).subscribe(() => this.exportErrorVisible = true);
        actions$.pipe(ofType(ChartActions.PLOTS_SETTINGS), takeUntil(this.dead$)).subscribe(() => this.refreshErrorVisible = false);
        actions$.pipe(ofType(ChartActions.START_PLOT_TEMPLATE_REFRESH), takeUntil(this.dead$)).subscribe(() => this.refreshErrorVisible = false);
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.dead$.next();
        this.dead$.complete();
    }
    onCloseClick() {
        this.close.emit();
    }
    onToggleEraseSettingsClick() {
        this.store.dispatch(new ChartActions.SetDefaultParams());
        this.store.dispatch(new ChartActions.SetDefaultCycleFilter({
            from: null,
            to: null,
            everyNth: null,
            custom: null,
            disableCharge: null,
            disableDischarge: null,
            threshold: null,
            minY: null,
            maxY: null
        }));
    }
    onRefresh() {
        this.store.dispatch(new ChartActions.StartRefresh());
        this.store.dispatch(new ChartActions.PlotsSettings());
    }
    onExport() {
        const chartInstance = this.appChartComponent;
        const markup = chartInstance.canvasChart.canvas.toDataURL("image/png");
        this.store.dispatch(new ChartActions.StartExport(Utils.dataURIToBlob(markup)));
    }
    onExportAll() {
        const chartInstance = this.appChartComponent;
        const markup = chartInstance.canvasChart.canvas.toDataURL("image/png");
        this.store.dispatch(new ChartActions.StartExportAll(Utils.dataURIToBlob(markup)));
    }
    onPrintChart() {
        this.appChartComponent.canvasChart.print();
    }
    onExportChart(format) {
        const ext = format.toLowerCase();
        const chartInstance = this.appChartComponent;
        const markup = chartInstance.canvasChart.canvas.toDataURL(`image/${ext}`);
        if (ext == "pdf") {
            var pdf = new jsPDF({
                orientation: "landscape",
                unit: "pt",
                format: [+chartInstance.canvasChart.get("width"), +chartInstance.canvasChart.get("height")]
            });
            pdf.addImage(chartInstance.canvasChart.canvas.toDataURL(`image/png`), 'PNG', 0, 0, +chartInstance.canvasChart.get("width"), +chartInstance.canvasChart.get("height"));
            pdf.save("Export.pdf");
        }
        else {
            FileSaver.saveAs(Utils.dataURIToBlob(markup), `Export.${ext}`);
        }
    }
    onCreateTemplate() {
        this.store.dispatch(new ChartActions.CreateTemplateFromChartDialogOpen());
    }
    onApplyChartAppearance(settings) {
        this.store.dispatch(new ChartActions.SetPlotSettings(settings));
    }
    onToggleLegendClick() {
        this.appChartComponent.onShowHideLegend();
    }
    onToggleSelectorClick() {
        this.appChartComponent.selectorVisible = !this.appChartComponent.selectorVisible;
        this.store.dispatch(new ChartActions.ToggleSelector());
        if (!this.appChartComponent.selectorVisible)
            this.appChartComponent.onRefresh();
    }
    onShareSave(shareSettings) {
        this.store.dispatch(new ChartActions.ShareTemplate(shareSettings.objectIds, shareSettings.email));
    }
    onStateOfCharge(stateOfCharge) {
        this.store.select(s => s.chart.projects).subscribe(s => this.projectIds = s);
        this.store.dispatch(new ChartActions.SetStateOfCharge(stateOfCharge, this.projectIds));
    }
    onCycleFilterSave(cycleFilter) {
        this.store.dispatch(new ChartActions.SetCycleFilter(cycleFilter));
    }
    onAggregationSettingsSave(aggregationSettings) {
        this.store.dispatch(new ChartActions.SetAggregationSettings(aggregationSettings));
    }
    onUomSettingsSave(uomSettings) {
        this.store.dispatch(new ChartActions.SetUoMSettings(uomSettings));
    }
    onAxisRangeSave(axisRange) {
        let msg = "";
        if (axisRange.xAxis.from != null && (axisRange.xAxis.from >= axisRange.xAxis.to)) {
            msg = `The 'from (${axisRange.xAxis.from})' value of the x-axis cant't be greater or equal then 'to (${axisRange.xAxis.to})' value.` + "\n";
        }
        if (axisRange.yAxis.from != null && (axisRange.yAxis.from >= axisRange.yAxis.to)) {
            msg += `The 'from (${axisRange.yAxis.from})' value of the y-axis cant't be greater or equal then 'to (${axisRange.yAxis.from})' value.\n`;
        }
        if (axisRange.y2Axis.from != null && (axisRange.y2Axis.from >= axisRange.y2Axis.to)) {
            msg += `The 'from (${axisRange.y2Axis.from})' value of the y2-axis cant't be greater or equal then 'to (${axisRange.y2Axis.from})' value.`;
        }
        if (msg == "")
            this.store.dispatch(new ChartActions.SetAxisRange(axisRange));
        else {
            this.appChartComponent.onRefresh();
            Utils.warningMessage(msg);
        }
    }
    onChartSettingsSave(chartSettings) {
        this.store.dispatch(new ChartActions.SetChartSettings(chartSettings));
    }
    setPlotType(plotType) {
        this.store.dispatch(new ChartActions.SetPlotType(plotType));
    }
    onSeriesSave(series) {
        this.store.dispatch(new ChartActions.SetSeriesSettings(series));
    }
    onGetPlots() {
        this.store.dispatch(new ChartActions.PlotsSettings());
    }
    onPlotTemplateDeleted(template) {
        this.store.dispatch(new ChartActions.DeletePlotsTemplate(template));
    }
    onPlotTemplateSelected(template) {
        this.store.dispatch(new ChartActions.SelectPlotsTemplate(template));
    }
    onPlotTemplateSave(template) {
        this.store.dispatch(new ChartActions.SavePlotsTemplate(template));
    }
};
__decorate([
    ViewChild(ChartJSComponent)
], ChartJSViewComponent.prototype, "appChartComponent", void 0);
__decorate([
    Input()
], ChartJSViewComponent.prototype, "displaySystemPlotSelector", void 0);
__decorate([
    Input()
], ChartJSViewComponent.prototype, "displayCustomTemplates", void 0);
__decorate([
    Input()
], ChartJSViewComponent.prototype, "displayBackButton", void 0);
__decorate([
    Output()
], ChartJSViewComponent.prototype, "close", void 0);
ChartJSViewComponent = __decorate([
    Component({
        selector: "app-chartjs-view",
        templateUrl: "./chartjs-view.component.html",
        styleUrls: ["./chart-view.component.css"]
    })
], ChartJSViewComponent);
export { ChartJSViewComponent };
//# sourceMappingURL=chartjs-view.component.js.map