var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input, ViewChild } from "@angular/core";
import { DxChartComponent } from "devextreme-angular";
import { registerPalette, currentPalette } from "devextreme/viz/palette";
let ChartComponent = class ChartComponent {
    constructor(pagerService) {
        this.pagerService = pagerService;
        this.pager = {};
        this.discreteItems = {};
        this.discreteItems = {};
        this.customizeText = this.customizeText.bind(this);
        this.formatLegendText = this.formatLegendText.bind(this);
    }
    setPage(page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.chartComponent.instance.getAllSeries().length, page);
        this.pagedItems = this.chartComponent.instance.getAllSeries().slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.setSeriesType(this.chartComponent.instance, this.chart);
    }
    get totalSeries() {
        return this.chartComponent && this.chartComponent.instance && this.chartComponent.instance.getAllSeries().length || 0;
    }
    onShowHideSeries(e) {
        for (const series of this.chartComponent.instance.getAllSeries()) {
            if (e.target.checked === false) {
                series.hide();
            }
            else {
                series.show();
            }
        }
    }
    onSeriesClick(series) {
        const i_series = this.chartComponent.instance.getAllSeries().find(item => item.tag.uniqueId == series.tag.uniqueId);
        if (i_series.isVisible() === true) {
            i_series.hide();
        }
        else {
            i_series.show();
        }
    }
    setSeriesType(control, chart) {
        let series = this.chartComponent.instance.getAllSeries();
        for (let i = 0; i < chart.series.length; i++) {
            var serie = chart.series[i].serieType;
            if (serie != null || serie != undefined) {
                series[i].type = serie;
                control.option("series[" + i + "].type", serie);
            }
        }
    }
    ngAfterViewInit() {
        if (this.chart) {
            this.onChartChanged(this.chartComponent.instance, this.chart);
            this.setSeriesType(this.chartComponent.instance, this.chart);
        }
    }
    ngOnChanges(changes) {
        if (changes["chart"]) {
            const control = this.chartComponent.instance;
            if (control && this.chart) {
                this.onChartChanged(control, this.chart);
                this.onChartAxisChanged(control, this.chart);
            }
        }
    }
    valueChanged(arg) {
        this.chartComponent.instance.zoomArgument(arg.value[0], arg.value[1]);
    }
    formatCrosshairLabel(value) {
        return +value.toFixed(3) + "";
    }
    formatTooltip(point) {
        return {
            text: point.seriesName
        };
    }
    onChartChanged(control, chart) {
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
    onChartAxisChanged(control, chart) {
        control.beginUpdate();
        const axisRange = chart.plotParameters.axisRange;
        if (axisRange) {
            let adjustOnZoom = false;
            //Change X first, because it does not affect zoom and value margins configurations
            if (axisRange.xAxis && (axisRange.xAxis.to || axisRange.xAxis.from)) {
                adjustOnZoom = true;
                control.option("argumentAxis.valueMarginsEnabled", false);
                control.option("argumentAxis.max", axisRange.xAxis.to);
                control.option("argumentAxis.min", axisRange.xAxis.from);
            }
            else {
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
    applyRangeToValueAxis(control, axisIndex, range, tickInterval) {
        const hasRangeValue = range != null && (range.to != null || range.from != null);
        control.option(`valueAxis[${axisIndex}].valueMarginsEnabled`, !hasRangeValue);
        control.option(`valueAxis[${axisIndex}].tickInterval`, tickInterval || undefined);
        control.option(`valueAxis[${axisIndex}].min`, hasRangeValue ? range.from != null ? range.from : undefined : undefined);
        control.option(`valueAxis[${axisIndex}].max`, hasRangeValue ? range.to != null ? range.to : undefined : undefined);
    }
    onZoomEnd(e) {
        e.component.render({ force: true });
    }
    onLegendClick(e) {
        var series = e.target;
        if (series.isVisible()) {
            series.hide();
        }
        else {
            series.show();
        }
    }
    formatLegendText(arg) {
        const control = this.chartComponent.instance;
        const series = control.getSeriesByPos(arg.seriesIndex);
        return this.getLegendText(series);
    }
    getLegendText(series) {
        if (series.tag.project.projectIndex == -1)
            return series.name;
        return `${series.tag.project.projectIndex}. ` + series.name;
    }
    customizeText(arg) {
        return this.discreteItems[`${arg.value}`];
    }
};
__decorate([
    ViewChild(DxChartComponent)
], ChartComponent.prototype, "chartComponent", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "label", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "axisRange", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "legendVisible", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "selectorVisible", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "title", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "useAggregation", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "refreshing", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "chart", void 0);
__decorate([
    Input()
], ChartComponent.prototype, "chartIsSpec", void 0);
ChartComponent = __decorate([
    Component({
        selector: "app-chart",
        templateUrl: "./chart.component.html",
        styleUrls: ["./chart.component.css"]
    })
], ChartComponent);
export { ChartComponent };
//# sourceMappingURL=chart.component.js.map