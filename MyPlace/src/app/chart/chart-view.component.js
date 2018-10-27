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
import { ChartComponent } from "./chart/chart.component";
import * as exportMethods from "devextreme/viz/export";
let ChartViewComponent = class ChartViewComponent {
    constructor(actions$, store) {
        this.store = store;
        this.displaySystemPlotSelector = true;
        this.displayCustomTemplates = true;
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
            this.refreshErrorReason = errorAction.error;
            this.refreshErrorVisible = true;
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
        const chartInstance = this.appChartComponent.chartComponent.instance;
        chartInstance.option("scrollBar.visible", false);
        const markup = exportMethods.getMarkup([chartInstance]);
        chartInstance.option("scrollBar.visible", true);
        const chartSize = chartInstance.getSize();
        const $this = this;
        exportMethods.exportFromMarkup(markup, {
            height: chartSize.height,
            width: chartSize.width,
            fileName: "Export",
            format: "png",
            onFileSaving: function (e) {
                $this.store.dispatch(new ChartActions.StartExport(e.data));
                e.cancel = true;
            }
        });
    }
    onExportAll() {
        const chartInstance = this.appChartComponent.chartComponent.instance;
        chartInstance.option("scrollBar.visible", false);
        const markup = exportMethods.getMarkup([chartInstance]);
        chartInstance.option("scrollBar.visible", true);
        const chartSize = chartInstance.getSize();
        const $this = this;
        exportMethods.exportFromMarkup(markup, {
            height: chartSize.height,
            width: chartSize.width,
            fileName: "Export",
            format: "png",
            onFileSaving: function (e) {
                $this.store.dispatch(new ChartActions.StartExportAll(e.data));
                e.cancel = true;
            }
        });
    }
    onPrintChart() {
        this.appChartComponent.chartComponent.instance.print();
    }
    onExportChart(format) {
        const chartInstance = this.appChartComponent.chartComponent.instance;
        chartInstance.option("scrollBar.visible", false);
        const markup = exportMethods.getMarkup([chartInstance]);
        chartInstance.option("scrollBar.visible", true);
        const chartSize = chartInstance.getSize();
        exportMethods.exportFromMarkup(markup, {
            height: chartSize.height,
            width: chartSize.width,
            fileName: "Export",
            format: format
        });
    }
    onCreateTemplate() {
        this.store.dispatch(new ChartActions.CreateTemplateFromChartDialogOpen());
    }
    onApplyChartAppearance(settings) {
        this.store.dispatch(new ChartActions.SetPlotSettings(settings));
        //this.state$.withLatestFrom(this.store).take(1).subscribe(s => {
        //    const plotParameters = s[0].plotParameters;
        //    var label = s[0].label;
        //    this.store.dispatch(new ChartActions.SetChartSettings({
        //        fontSize: label.font && label.font.size || plotParameters.fontSize,
        //        fontFamilyName: label.font && label.font.family || plotParameters.fontFamilyName,
        //        xAxisText: plotParameters.xAxisText,
        //        yAxisText: plotParameters.yAxisText,
        //        chartTitle: plotParameters.chartTitle,
        //        xLineVisible: settings.xLineVisible,
        //        yLineVisible: settings.yLineVisible,
        //        pointSize: settings.pointSize,
        //    }));
        //});
    }
    onToggleLegendClick() {
        this.store.dispatch(new ChartActions.ToggleLegend(!this.legendVisible));
    }
    onToggleSelectorClick() {
        this.store.dispatch(new ChartActions.ToggleSelector());
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
        this.store.dispatch(new ChartActions.SetAxisRange(axisRange));
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
    ViewChild(ChartComponent)
], ChartViewComponent.prototype, "appChartComponent", void 0);
__decorate([
    Input()
], ChartViewComponent.prototype, "displaySystemPlotSelector", void 0);
__decorate([
    Input()
], ChartViewComponent.prototype, "displayCustomTemplates", void 0);
__decorate([
    Output()
], ChartViewComponent.prototype, "close", void 0);
ChartViewComponent = __decorate([
    Component({
        selector: "app-chart-view",
        templateUrl: "./chart-view.component.html",
        styleUrls: ["./chart-view.component.css"]
    })
], ChartViewComponent);
export { ChartViewComponent };
//# sourceMappingURL=chart-view.component.js.map