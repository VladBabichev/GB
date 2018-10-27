import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { PagerService } from "../service/pager-service";
import { Chart, Label, AxisRange, AxisRangeItem, PlotParameters } from "../model";
import * as CanvasJS from "../../../vendor/CanvasJS";

@Component({
    selector: "app-chartjs",
    templateUrl: "./chartjs.component.html",
    styleUrls: ["./chart.component.css"]
})
//export class ChartJSComponent implements OnInit, AfterViewInit {
export class ChartJSComponent implements OnInit {

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

    canvasChart: any;
    dataSeries: any[];
    chartOrigin: Chart;

    constructor(private pagerService: PagerService) {
        this.discreteItems = {};
        this.customizeText = this.customizeText.bind(this);
        this.dataSeries = [];
    }

    ngOnInit(): void {

        this.dngAfterViewInit();

        this.canvasChart = new CanvasJS.Chart("chartContainer", {
            theme: "light2",
            zoomEnabled: true,
            exportEnabled: false,
            animationEnabled: true,
            animationDuration: 1500,
            title: {
                text: ""
            },
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    labelFormatter: this.crosshairLabelFormatter
                }
            },
            axisY: {
                includeZero: false,
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY2: {
                includeZero: false
            },
            legend: {
                cursor: "pointer",
                itemclick: this.onToggleDataSeries,
                itemmouseover: this.onLegendItemMouseOver,
                itemmouseout: this.onLegendItemMouseOut
            },
            data: this.dataSeries
        });

        this.canvasChart.render();
        this.chartOrigin = this.chart;
    }

    pager: any = {};
    pagedItems: any[];
    private discreteItems: any = {};

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.canvasChart.options.data.length, page);
        this.pagedItems = this.canvasChart.options.data.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    get totalSeries(): number {
        return this.canvasChart && this.canvasChart.options.data.length || 0;
    }

    dngAfterViewInit(): void {
        if (this.chart) {
            this.onChartChanged(this.chart);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["chart"] && changes["chart"].currentValue != changes["chart"].previousValue) {
            if (this.chart) {
                this.onChartChanged(this.chart);
            }
        }
    }

    valueChanged(arg: any) {
        if (this.canvasChart && this.canvasChart.options && this.canvasChart.options.axisX) {
            this.canvasChart.options.axisX.viewportMinimum = arg.value[0];
            this.canvasChart.options.axisX.viewportMaximum = arg.value[1];

            this.canvasChart.render();
        }
    }

    formatCrosshairLabel(value: number): string {
        return +value.toFixed(3) + "";
    }

    formatTooltip(point: { seriesName: string }): any {
        return {
            text: point.seriesName
        };
    }

    private onChartChanged(chart: Chart): void {
        const chartChangedStartDate = Date.now();

        let currentKey: string = "";
        let serieIndex: number;
        let minimum: number = Number.MAX_VALUE;
        let maximum: number = Number.MIN_VALUE;

        this.dataSeries.length = 0;

        if (chart.plotParameters.chartPalette.length > 0) {
            CanvasJS.addColorSet("userDefinedPalette", chart.plotParameters.chartPalette);

            this.canvasChart.options.colorSet = "userDefinedPalette";
        }

        let isAveragePlot = false;
        for (let i = 0; i < chart.points.length; i++) {
            const keys = Object.keys(chart.points[i]);

            if (currentKey != "" + chart.points[i].uniqueId) {
                currentKey = "" + chart.points[i].uniqueId;

                debugger

                var series = chart.series.find(item => item.id == currentKey);

                this.dataSeries.push({
                    type: series.serieType,
                    lineDashType: series.serieType == "stepLine" ? "dash" : "",
                    axisYType: keys[2] === "z1" ? "secondary" : "primary",
                    id: series.id,
                    name: `${series.tag.project.projectIndex}. ` + series.name,
                    color: (!series.color || series.color == "") ? null : series.color,
                    lineThickness: chart.plotParameters.seriesLineThickness || 2,
                    markerSize: (series.serieType == "scatter") ? 10 : chart.plotParameters.pointSize,
                    markerColor: (!series.color || series.color == "") ? null : series.color,
                    showInLegend: chart.plotParameters.legendShowen,
                    visible: true,
                    dataPoints: []
                });

                //this.dataSeries.push({
                //	type: "line",
                //	axisYType: keys[1] === "z1" ? "secondary" : "primary",
                //	id: series.id,
                //	name: `${series.tag.project.projectIndex}. ` + series.name,
                //	color: (!series.color || series.color == "") ? null : series.color,
                //	lineThickness: chart.plotParameters.seriesLineThickness || 2,
                //	markerSize: chart.plotParameters.pointSize || 5,
                //	showInLegend: chart.plotParameters.legendShowen,
                //	visible: true,
                //	dataPoints: []
                //});

                isAveragePlot = false;
                const project = chart.projects.find(p => p.id === series.projectId);
                if (project && project.isAveragePlot == true) {
                    isAveragePlot = project.isAveragePlot;

                    this.dataSeries.push({
                        type: "error",
                        axisYType: keys[2] === "z1" ? "secondary" : "primary",
                        id: `${series.id}ErrorBar`,
                        name: `${series.tag.project.projectIndex}. ` + series.name + "Error Bar",
                        //color: (!series.color || series.color == "") ? null : series.color,
                        //lineThickness:  chart.plotParameters.seriesLineThickness || 2,
                        //markerSize: chart.plotParameters.pointSize,
                        toolTipContent: "Error Range: {y[0]} - {y[1]}",
                        showInLegend: false,
                        visible: true,
                        dataPoints: []
                    });
                }
            }

            const isCRate = chart.points && (chart.xAxisText === "CRate" || chart.xAxisText === "DischargeCRate");

            minimum = minimum > chart.points[i].x ? chart.points[i].x : minimum;
            maximum = maximum < chart.points[i].x ? chart.points[i].x : maximum;

            let errorDataPoint: any = {};
            let dataPoint: any = {
                y: chart.points[i][keys[2]],
                x: chart.points[i].x
            };

            if (chart.xAxisIsInteger) {
                dataPoint.label = `${chart.points[i].x}`;
                dataPoint.useLabel = true;
            }
            else if (isCRate) {
                dataPoint.label = `${chart.points[i].discrete}`;
                dataPoint.useLabel = true;
            }
            // else {
            //     dataPoint.x = chart.points[i].x;
            // }

            if (isAveragePlot) {
                errorDataPoint.y = [chart.points[i].lowError, chart.points[i].highError];
                errorDataPoint.x = chart.points[i].x;
            }


            if (!isAveragePlot) {
                this.dataSeries[this.dataSeries.length - 1].dataPoints.push(dataPoint);
            }
            else {
                this.dataSeries[this.dataSeries.length - 2].dataPoints.push(dataPoint);
                this.dataSeries[this.dataSeries.length - 1].dataPoints.push(errorDataPoint);
            }
        }

        if (!this.canvasChart.options.axisX) {
            this.canvasChart.options.axisX = {}
        }

        if (!this.canvasChart.options.axisY) {
            this.canvasChart.options.axisY = {}
        }

        if (this.canvasChart.options.data.length == 0) {
            this.canvasChart.options.data.push({ type: "line" });
        }

        const axisRange = chart.plotParameters.axisRange;
        axisRange.xAxis = axisRange.xAxis || { from: null, to: null };
        axisRange.yAxis = axisRange.yAxis || { from: null, to: null };
        axisRange.y2Axis = axisRange.y2Axis || { from: null, to: null };

        this.canvasChart.options.title.text = chart.title;
        this.canvasChart.options.title.fontFamily = chart.plotParameters.fontFamilyName;
        
        delete this.canvasChart.options.title.fontSize
        if (chart.plotParameters.fontSize > 0)
            this.canvasChart.options.title.fontSize = this.canvasChart.getAutoFontSize(chart.plotParameters.fontSize * 1.6);

        this.canvasChart.options.width = chart.plotParameters.horizontalSize;
        this.canvasChart.options.height = chart.plotParameters.verticalSize || 640;
        this.canvasChart.options.axisX.gridThickness = chart.plotParameters.xLineVisible === true ? 1 : 0;
        this.canvasChart.options.axisX.title = chart.xAxisText;
        this.canvasChart.options.axisX.minimum = axisRange.xAxis.from;
        this.canvasChart.options.axisX.maximum = axisRange.xAxis.to;
        this.canvasChart.options.axisX.interval = chart.plotParameters.xMajorTickInterval;

        if (chart.xAxisIsInteger && (axisRange.xAxis.from == null || axisRange.xAxis.from == undefined)) {
            this.canvasChart.options.axisX.minimum = minimum;
        }
        if (chart.xAxisIsInteger && (axisRange.xAxis.to == null || axisRange.xAxis.to == undefined)) {
            this.canvasChart.options.axisX.maximum = maximum + 0.1;
        }

        if (chart.xAxisIsInteger && (chart.plotParameters.xMajorTickInterval == null || chart.plotParameters.xMajorTickInterval == undefined)) {
            this.canvasChart.options.axisX.interval = 1;
            if (Math.abs(maximum - minimum) > 20) {
                this.canvasChart.options.axisX.interval = null;
            }
        }

        this.canvasChart.options.axisY.title = chart.yAxisText[0];
        this.canvasChart.options.axisY.gridThickness = chart.plotParameters.yLineVisible === true ? 1 : 0;
        this.canvasChart.options.axisY.minimum = axisRange.yAxis.from;
        this.canvasChart.options.axisY.maximum = axisRange.yAxis.to;
        this.canvasChart.options.axisY.interval = chart.plotParameters.yMajorTickInterval;

        if (this.canvasChart.axisY2.length > 0) {
            this.canvasChart.options.axisY2.title = chart.yAxisText.length > 1 && chart.yAxisText[1];
            this.canvasChart.options.axisY2.minimum = axisRange.y2Axis.from;
            this.canvasChart.options.axisY2.maximum = axisRange.y2Axis.to;
            this.canvasChart.options.axisY2.interval = chart.plotParameters.y2MajorTickInterval;
        }

        this.setAxisTextOptions(chart.plotParameters, "axisX");
        this.setAxisTextOptions(chart.plotParameters, "axisY");
        this.setAxisTextOptions(chart.plotParameters, "axisY2");
        this.setLegendOptions(chart.plotParameters);

        this.canvasChart.options.axisX.viewportMinimum = this.canvasChart.options.axisX.viewportMaximum = null;          

        const startDate = Date.now();
        this.canvasChart.render();

        console.log("Chart rendered " + (Date.now() - startDate) / 1000 + " seconds.");

        if (this.canvasChart.options.data.length > 0) {
            this.setPage(1);
        }

        console.log("Chart updated " + (Date.now() - chartChangedStartDate) / 1000 + " seconds.");
    }

    private setAxisTextOptions(settings: PlotParameters, axisName: string) : void {
        const options = this.canvasChart.options[axisName];

        options.labelFontFamily = settings.fontFamilyName;
        options.titleFontFamily = settings.fontFamilyName; 
        delete options.titleFontSize;
        delete options.labelFontSize

        if (settings.fontSize > 0) {
            options.titleFontSize = this.canvasChart.getAutoFontSize(settings.fontSize);
            options.labelFontSize = settings.fontSize;
        }
    }

    private setLegendOptions(settings: PlotParameters) : void {
        const legend = this.canvasChart.options.legend;

        legend.dockInsidePlotArea = (settings.legend && settings.legend.position === "inside") || false;
        legend.horizontalAlign = settings.legend && settings.legend.horizontalAlignment || "right";
        legend.verticalAlign = settings.legend && settings.legend.verticalAlignment || "top";
        legend.fontFamily = settings.fontFamilyName || "verdana";
        legend.fontSize = 12;
        legend.fontWeight = "normal";
    }

    onZoomEnd(e): void {
        e.component.render({ force: true });
    }

    private customizeText(arg: any): any {
        return this.discreteItems[`${arg.value}`];
    }

    private crosshairLabelFormatter(e: any): void {
        // TODO: There is incomprehensible and obviously incorrectly implemented label formatting logic along the X axis. 
        // An attempt is made to use the value on the X axis as an index in the collection of points.
        // I restored the default behavior.
        //      var max = e.chart.data[0].dataPoints.length;
        //      var maxIndex = 0
        //      for(let i = 1; i < e.chart.data.length; i++) {
        //          if (e.chart.data[i].dataPoints.length > max)
        //          {
        //              max = e.chart.data[i].dataPoints.length;
        //              maxIndex = i;
        //          }
        //}

        //if (e.chart.data[maxIndex].dataPoints[0].useLabel) {
        //	alert(e.chart.data[maxIndex].dataPoints[e.value - 1].label);
        //	//if (!!e.chart.data[maxIndex].dataPoints[e.value - 1])
        //	//	return e.chart.data[maxIndex].dataPoints[e.value - 1].label;
        //	//else {
        //	//	alert("maxIndex = " + maxIndex);
        //	//	alert("max = " + max);
        //	//	alert("e.value = " + e.value);
        //	//	return null;
        //	//}
        //      }
        //      return e.value;
        return e.value;
    }

    private onToggleDataSeries(e: any): void {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    private onLegendItemMouseOver(e: any): void {
        e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize + 2;
        //e.dataSeries.markerColor = "#FFFFFF";
        //e.dataSeries.markerBorderThickness = e.chart.data[e.dataSeriesIndex].markerBorderThickness + 2;
        //e.dataSeries.markerBorderColor = "#FFFFFF";//e.chart.data[e.dataSeriesIndex].color;

        e.chart.render();
    }

    private onLegendItemMouseOut(e: any): void {
        e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize - 2;
        //e.dataSeries.markerColor = e.chart.data[e.dataSeriesIndex].color;
        //e.dataSeries.markerBorderThickness = e.chart.data[e.dataSeriesIndex].markerBorderThickness - 2;
        //e.dataSeries.markerBorderColor = null;

        e.chart.render();
    }

    onShowHideSeries(e): void {
        for (const serie of this.canvasChart.options.data) {
            if (e.target.checked === false) {
                serie.visible = false;
            } else {
                serie.visible = true;
            }
        }

        this.canvasChart.render();
    }

    onSeriesClick(series): void {
        const item = this.canvasChart.options.data.find(item => item.id === series.id);
        if (item) {
            item.visible = item.visible == undefined ? false : !item.visible;
            this.canvasChart.render();
        }
    }

    onShowHideLegend(): void {      
        for (const serie of this.canvasChart.options.data) {
            serie.showInLegend = !serie.showInLegend;
        }
        this.canvasChart.render();
    }

    onRefresh(): void {     
        this.chart = this.chartOrigin;
        this.ngOnInit();
    }
}
