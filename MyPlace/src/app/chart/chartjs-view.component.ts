import { Component, EventEmitter, OnInit, OnDestroy, Output, Input, ViewChild } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable ,  Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { AppState } from "../state";
import * as ChartActions from "./state/chart.actions";
import { ChartState } from "./state/chart.state";
import { ChartJSComponent } from "./chart/chartjs.component";
import { AggregationSettings, AxisRange, StateOfCharge, ShareSettings, PlotTemplate, Chart, ChartFilter, ChartUoMSettings, ChartSettings, Series, PlotParameters} from "./model";
import * as FileSaver from "file-saver";
import * as jsPDF from 'jspdf';

import * as Utils from "../shared/utils";
import { LocalizationBaseComponent } from "../core/localization-base.component";

@Component({
    selector: "app-chartjs-view",
    templateUrl: "./chartjs-view.component.html",
    styleUrls: ["./chart-view.component.css"]
})
export class ChartJSViewComponent extends LocalizationBaseComponent implements OnInit, OnDestroy {
    @ViewChild(ChartJSComponent) appChartComponent: ChartJSComponent;   
    @Input() displaySystemPlotSelector: boolean = true;
    @Input() displayCustomTemplates: boolean = true;
    @Input() displayBackButton: boolean = false;
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
        super();

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
            Utils.errorMessage(errorAction.error.message);
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

    ngOnInit() {
       
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
        const chartInstance = this.appChartComponent;
        const markup = chartInstance.canvasChart.canvas.toDataURL("image/png");
        this.store.dispatch(new ChartActions.StartExport(Utils.dataURIToBlob(markup)));        
    }

    onExportAll(): void {
        const chartInstance = this.appChartComponent;
        const markup = chartInstance.canvasChart.canvas.toDataURL("image/png");
        this.store.dispatch(new ChartActions.StartExportAll(Utils.dataURIToBlob(markup)));       
    }
    
    onPrintChart(): void {
        this.appChartComponent.canvasChart.print();
    }

    onExportChart(format: string): void {
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

    onCreateTemplate(): void {
        this.store.dispatch(new ChartActions.CreateTemplateFromChartDialogOpen());
    }

    onApplyChartAppearance(settings: PlotParameters): void {
        this.store.dispatch(new ChartActions.SetPlotSettings(settings));       
    }

    onToggleLegendClick(): void {   
        this.appChartComponent.onShowHideLegend();
    }

    onToggleSelectorClick(): void {
        this.appChartComponent.selectorVisible = !this.appChartComponent.selectorVisible;
        this.store.dispatch(new ChartActions.ToggleSelector());
        if (!this.appChartComponent.selectorVisible)
            this.appChartComponent.onRefresh();
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
        let msg:string = "";
        if (axisRange.xAxis.from !=null && (axisRange.xAxis.from >= axisRange.xAxis.to)) {
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
