import { Component, EventEmitter, OnInit, OnDestroy, Output, Input, ViewChild } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from "@angular/common/http";

import { AppState } from "../state";
import * as ChartActions from "./state/chart.actions";
import { ChartState } from "./state/chart.state";
import { ChartComponent } from "./chart/chart.component";
import { AggregationSettings, AxisRange, StateOfCharge, ShareSettings, PlotTemplate, Chart, ChartFilter, ChartUoMSettings, ChartSettings, Series, PlotParameters} from "./model";
import * as exportMethods from "devextreme/viz/export";


@Component({
    selector: "app-chart-view",
    templateUrl: "./chart-view.component.html",
    styleUrls: ["./chart-view.component.css"]
})
export class ChartViewComponent implements OnInit, OnDestroy {
    @ViewChild(ChartComponent) appChartComponent: ChartComponent;
    @Input() displaySystemPlotSelector: boolean = true;
    @Input() displayCustomTemplates: boolean = true;
    @Output() close = new EventEmitter<any>();

    state$: Observable<ChartState>;
    cycleFilterVisible = false;
    legendVisible = false;
    shareVisible = false;
    refreshErrorVisible = false;
    refreshErrorReason;
    exportErrorVisible = false;
    projectIds: number[]; 
    hasAverageProjects: boolean = false;
    private dead$ = new Subject();

    constructor(actions$: Actions, private store: Store<AppState>) {
        this.state$ = this.store.select(s => s.chart);
    
        actions$.pipe(
            ofType(ChartActions.START_REFRESH),
            takeUntil(this.dead$)
        ).subscribe(() => this.refreshErrorVisible = false);

        actions$.pipe(
            ofType(ChartActions.REFRESH_PLOT_TEMPLATE_COMPLEATED),
            takeUntil(this.dead$)
        ).subscribe((action: any) => {
            if (action.chart != null) {
                this.shareVisible = true;
                this.legendVisible = action.chart.plotParameters.legendShowen;
            }
        });

        actions$.pipe(
            ofType(ChartActions.SELECT_VIEW_COMPLEATED),
            takeUntil(this.dead$)
        ).subscribe((action: any) => {
            if (action.chart != null) {
                this.shareVisible = true;
                this.legendVisible = action.chart.plotParameters.legendShowen;
            }
        });

        actions$.pipe(
            ofType(ChartActions.END_REFRESH),
            takeUntil(this.dead$)
        ).subscribe((action: any) => {
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

        actions$.pipe(
            ofType(ChartActions.END_DATAPOINTS_REFRESH),
            takeUntil(this.dead$)
        ).subscribe((action: any) => {
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

        actions$.pipe(
            ofType(ChartActions.REFRESH_FAILED),
            takeUntil(this.dead$)
        ).subscribe((action: any) => {
            const errorAction = action as ChartActions.RefreshFailed;
        
            this.refreshErrorReason = errorAction.error;
            this.refreshErrorVisible = true;
        });
                
        actions$.pipe(
            ofType(ChartActions.START_EXPORT, ChartActions.START_EXPORT_ALL),
            takeUntil(this.dead$)
        ).subscribe(() => this.exportErrorVisible = false);

        actions$.pipe(
            ofType(ChartActions.EXPORT_FAILED),
            takeUntil(this.dead$)
        ).subscribe(() => this.exportErrorVisible = true);

        actions$.pipe(
            ofType(ChartActions.PLOTS_SETTINGS),
            takeUntil(this.dead$)
        ).subscribe(() => this.refreshErrorVisible = false);

        actions$.pipe(
            ofType(ChartActions.START_PLOT_TEMPLATE_REFRESH),
            takeUntil(this.dead$)
        ).subscribe(() => this.refreshErrorVisible = false);
    }

    ngOnInit(): void {
 
    }

    ngOnDestroy(): void {
        this.dead$.next();
        this.dead$.complete();
    }

    onCloseClick(): void {
        this.close.emit();
    }

    onToggleEraseSettingsClick(): void {
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

    onRefresh(): void {
        this.store.dispatch(new ChartActions.StartRefresh());
        this.store.dispatch(new ChartActions.PlotsSettings());
    }

    onExport(): void {
        const chartInstance = this.appChartComponent.chartComponent.instance;

        chartInstance.option("scrollBar.visible", false);
        const markup = exportMethods.getMarkup([chartInstance]);
        chartInstance.option("scrollBar.visible", true);

        const chartSize = chartInstance.getSize();
        const $this = this;
        exportMethods.exportFromMarkup(markup,
            {
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

    onExportAll(): void {
        const chartInstance = this.appChartComponent.chartComponent.instance;

        chartInstance.option("scrollBar.visible", false);
        const markup = exportMethods.getMarkup([chartInstance]);
        chartInstance.option("scrollBar.visible", true);

        const chartSize = chartInstance.getSize();
        const $this = this;
        exportMethods.exportFromMarkup(markup,
            {
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
    
    onPrintChart(): void {
        this.appChartComponent.chartComponent.instance.print();
    }

    onExportChart(format: string): void {
        const chartInstance = this.appChartComponent.chartComponent.instance;

        chartInstance.option("scrollBar.visible", false);
        const markup = exportMethods.getMarkup([chartInstance]);
        chartInstance.option("scrollBar.visible", true);

        const chartSize = chartInstance.getSize();
        exportMethods.exportFromMarkup(markup,
            {
                height: chartSize.height,
                width: chartSize.width,
                fileName: "Export",
                format: format
            });
    }

    onCreateTemplate(): void {
        this.store.dispatch(new ChartActions.CreateTemplateFromChartDialogOpen());
    }

    onApplyChartAppearance(settings: PlotParameters): void {
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

    onToggleLegendClick(): void {
        this.store.dispatch(new ChartActions.ToggleLegend(!this.legendVisible));
    }

    onToggleSelectorClick(): void {
        this.store.dispatch(new ChartActions.ToggleSelector());
    }

    onShareSave(shareSettings: ShareSettings): void {
        this.store.dispatch(new ChartActions.ShareTemplate(shareSettings.objectIds, shareSettings.email));
    }

    onStateOfCharge(stateOfCharge: StateOfCharge): void {
        this.store.select(s => s.chart.projects).subscribe(s => this.projectIds = s);
      
        this.store.dispatch(new ChartActions.SetStateOfCharge(stateOfCharge, this.projectIds));
    }

    onCycleFilterSave(cycleFilter: ChartFilter): void {
        this.store.dispatch(new ChartActions.SetCycleFilter(cycleFilter));
    }

    onAggregationSettingsSave(aggregationSettings: AggregationSettings): void {
        this.store.dispatch(new ChartActions.SetAggregationSettings(aggregationSettings));
    }

    onUomSettingsSave(uomSettings: ChartUoMSettings): void {
        this.store.dispatch(new ChartActions.SetUoMSettings(uomSettings));
    }

    onAxisRangeSave(axisRange: AxisRange): void {
        this.store.dispatch(new ChartActions.SetAxisRange(axisRange));
    }

    onChartSettingsSave(chartSettings: ChartSettings): void {
        this.store.dispatch(new ChartActions.SetChartSettings(chartSettings));
    }

    setPlotType(plotType: number): void {
        this.store.dispatch(new ChartActions.SetPlotType(plotType));
    }

    onSeriesSave(series: Series[]): void {
        this.store.dispatch(new ChartActions.SetSeriesSettings(series));
    }

    onGetPlots(): void {
        this.store.dispatch(new ChartActions.PlotsSettings());
    }

    onPlotTemplateDeleted(template: PlotTemplate): void {
        this.store.dispatch(new ChartActions.DeletePlotsTemplate(template));
    }

    onPlotTemplateSelected(template: PlotTemplate): void {
        this.store.dispatch(new ChartActions.SelectPlotsTemplate(template));
    }

    onPlotTemplateSave(template: PlotTemplate): void {
        this.store.dispatch(new ChartActions.SavePlotsTemplate(template));
    }
}
