import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../../state";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { DxChartModule, DxChartComponent, DxRangeSelectorModule } from "devextreme-angular";
import DxChart from "devextreme/viz/chart";
import { PagerService } from "../service/pager-service";
import { registerPalette, currentPalette, getPalette } from "devextreme/viz/palette";

import { Chart, Label, AxisRange, AxisRangeItem, PlotParameters } from "../model";

@Component({
    selector: "app-chart",
    templateUrl: "./chart.component.html",
    styleUrls: ["./chart.component.css"]
})
export class ChartComponent implements AfterViewInit {
    @ViewChild(DxChartComponent) chartComponent: DxChartComponent;
    
    @Input()
    label: Label;

    @Input()
    axisRange: AxisRange;

    @Input()
    legendVisible: boolean;

    @Input()
    selectorVisible: boolean;

    @Input()
    title: string;

    @Input()
    useAggregation: boolean;

    @Input()
    refreshing: boolean;

    @Input()
    chart: Chart;

    @Input()
    chartIsSpec: false;

    constructor(private pagerService: PagerService) {
        this.discreteItems = {};
        this.customizeText = this.customizeText.bind(this);
        this.formatLegendText = this.formatLegendText.bind(this);
    }

    pager: any = {};
    pagedItems: any[];  
    private discreteItems: any = {};
      
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.chartComponent.instance.getAllSeries().length, page);
        this.pagedItems = this.chartComponent.instance.getAllSeries().slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.setSeriesType(this.chartComponent.instance,this.chart);
    }

    get totalSeries(): number {
        return this.chartComponent && this.chartComponent.instance && this.chartComponent.instance.getAllSeries().length || 0;
    }
    
    onShowHideSeries(e): void {
        for (const series of this.chartComponent.instance.getAllSeries()) {           
            if (e.target.checked === false) {
                series.hide();
            } else {
                series.show();
            }
        }
    }

    onSeriesClick(series): void {
       const i_series =  this.chartComponent.instance.getAllSeries().find(item => item.tag.uniqueId == series.tag.uniqueId);
       if (i_series.isVisible() === true) {
           i_series.hide();
        } else {
           i_series.show();
        }      
    }

    setSeriesType(control: DxChart,chart: Chart): void {
        let series = this.chartComponent.instance.getAllSeries();
        for (let i = 0; i < chart.series.length; i++) {
            var serie = chart.series[i].serieType;
            if (serie != null || serie != undefined) {
                series[i].type = serie;
                control.option("series[" + i + "].type", serie);
            }            
        }
    }

    ngAfterViewInit(): void {
        if (this.chart) {
            this.onChartChanged(this.chartComponent.instance, this.chart);  
            this.setSeriesType(this.chartComponent.instance,this.chart);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["chart"]) {
            const control = this.chartComponent.instance;
            if (control && this.chart) {
                this.onChartChanged(control, this.chart);       
                this.onChartAxisChanged(control, this.chart);   
            }
        }
    }

    valueChanged(arg: any) {
        this.chartComponent.instance.zoomArgument(arg.value[0], arg.value[1]);
    }

    formatCrosshairLabel(value: number): string {
        return +value.toFixed(3) + "";
    }

    formatTooltip(point: { seriesName: string }): any {
        return {
            text: point.seriesName
        };
    }

    private onChartChanged(control: DxChart, chart: Chart): void {
        this.discreteItems = {};
        control.beginUpdate();
        control.option("series", chart.series);
        if (chart.series) {
            for (let i = 0; i < chart.series.length; i++) {
                var projectId = chart.series[i].projectId;
                const project = chart.projects.find(p => p.id === projectId);
                if (project && project.isAveragePlot) {
                    control.option("series[" + i + "].valueErrorBar", { highValueField: "highError", lowValueField: "lowError", opacity: 0.8, lineWidth: 1 });

                    control.option("series[" + i + "].type", "scatter");
                }

                if (chart.series[i].tag && chart.series[i].tag.type == "validationSpecification") {
                    control.option("series[" + i + "].type", "stepline");
                }
            }
        }

        control.option("dataSource", chart.points);
        control.option("title", chart.title);
        control.option("argumentAxis.type", "continuous");
        control.option("argumentAxis.label.customizeText", undefined);

        control.option("argumentAxis.minorTick", {
            visible: chart.plotParameters.xMinorTickVisible,
            opacity: 1
        });
        control.option("argumentAxis.minorTickCount", chart.plotParameters.xMinorTickCount);
        control.option("argumentAxis.tick", {
            visible: true,
            opacity: 1,
        });

        // Specifies whether to allow decimal values on the axis. When false, the axis contains integer values only.
        control.option("argumentAxis.allowDecimals", chart.xAxisIsInteger ? false : undefined);
        control.option("argumentAxis.tickInterval", chart.plotParameters.xMajorTickInterval);
        //control.option("argumentAxis.tickInterval", chart.xAxisIsInteger ? 1 : undefined);
        control.option("argumentAxis.grid.visible", chart.plotParameters.xLineVisible);
        control.option("argumentAxis.title.text", chart.xAxisText);
        control.option("commonSeriesSettings.line.point.size", chart.plotParameters.pointSize);
        control.option("commonSeriesSettings.line.width", chart.plotParameters.seriesLineThickness || 2);
        control.option("valueAxis[0].grid.visible", chart.plotParameters.yLineVisible);
        control.option("valueAxis[0].title.text", chart.yAxisText[0]);
        control.option("valueAxis[1].visible", chart.yAxisText.length > 1);
        control.option("valueAxis[1].grid.visible", chart.yAxisText.length > 1 && chart.plotParameters.yLineVisible);
        control.option("valueAxis[1].title.text", chart.yAxisText.length > 1 && chart.yAxisText[1]);


        control.option("size.height", chart.plotParameters.verticalSize || 640);
        control.option("size.width", chart.plotParameters.horizontalSize || undefined);
        
        control.option("valueAxis[0].minorTick", {
            visible: chart.plotParameters.yMinorTickVisible,
            opacity: 1
        });
        control.option("valueAxis[0].minorTickCount", chart.plotParameters.yMinorTickCount);
        control.option("valueAxis[1].minorTick", {
            visible: chart.plotParameters.y2MinorTickVisible,
            opacity: 1
        });
        control.option("valueAxis[1].minorTickCount", chart.plotParameters.y2MinorTickCount);

        const isCRate = chart.points && (chart.xAxisText === "CRate" || chart.xAxisText === "DischargeCRate");
        if (isCRate) {
            chart.points.map((i, index) => {
                this.discreteItems[`${i.x}`] = i.discrete;
            });

            control.option("argumentAxis.type", "discrete");
            control.option("argumentAxis.label.customizeText", this.customizeText);
        }

        if (chart.plotParameters)
            control.option("legend", chart.plotParameters.legend || control.option("legend"));
        control.option("legend.visible", chart.plotParameters.legendShowen);

        if (chart.plotParameters.chartPalette.length > 0) {
            registerPalette("userDefinedPalette", {
                simpleSet: chart.plotParameters.chartPalette
            });
            currentPalette("userDefinedPalette");
            control.option("palette", "userDefinedPalette");
        }
        
        control.endUpdate();
        if (this.chartComponent.instance.getAllSeries().length > 0) {
            this.setPage(1);
        }
    }

    private onChartAxisChanged(control: DxChart, chart: Chart): void {
        control.beginUpdate();
        const axisRange = chart.plotParameters.axisRange;
        if (axisRange) {
            let adjustOnZoom = false;

            //Change X first, because it does not affect zoom and value margins configurations
            if (axisRange.xAxis && (axisRange.xAxis.to ||axisRange.xAxis.from)) {
                adjustOnZoom = true;
                control.option("argumentAxis.valueMarginsEnabled", false);
                control.option("argumentAxis.max",  axisRange.xAxis.to);
                control.option("argumentAxis.min", axisRange.xAxis.from);
            } else {
                control.option("argumentAxis.valueMarginsEnabled", true);
                control.option("argumentAxis.min", undefined);
                control.option("argumentAxis.max", undefined);
            }

            adjustOnZoom = !(axisRange.yAxis && (axisRange.yAxis.to || axisRange.yAxis.from) || axisRange.y2Axis && (axisRange.y2Axis.to || axisRange.y2Axis.from));
            this.applyRangeToValueAxis(control, 0, axisRange.yAxis, chart.plotParameters.yMajorTickInterval);
            this.applyRangeToValueAxis(control, 1, axisRange.y2Axis, chart.plotParameters.y2MajorTickInterval);

            control.option("adjustOnZoom", adjustOnZoom);
        }
        control.endUpdate();       
    }

    private applyRangeToValueAxis(control: DxChart, axisIndex: number, range: AxisRangeItem, tickInterval?: number) {
        const hasRangeValue = range != null && (range.to != null || range.from != null);

        control.option(`valueAxis[${axisIndex}].valueMarginsEnabled`, !hasRangeValue);
        control.option(`valueAxis[${axisIndex}].tickInterval`, tickInterval || undefined);
        
        control.option(`valueAxis[${axisIndex}].min`, hasRangeValue ? range.from != null ? range.from : undefined : undefined);
        control.option(`valueAxis[${axisIndex}].max`, hasRangeValue ? range.to != null ? range.to : undefined : undefined);
    }

    onZoomEnd(e): void {
        e.component.render({ force: true });
    }

    onLegendClick(e): void {
        var series = e.target;
        if(series.isVisible()) { 
            series.hide();
        } else {
            series.show();
        }
    }

    formatLegendText(arg: any): any {
        const control = this.chartComponent.instance;
        const series = control.getSeriesByPos(arg.seriesIndex);

        return this.getLegendText(series);
    }

    getLegendText(series: any) {
        if (series.tag.project.projectIndex == -1)
            return series.name;

        return `${series.tag.project.projectIndex}. ` + series.name;
    }

    private customizeText(arg: any): any {
        return this.discreteItems[`${arg.value}`];
    }
}
