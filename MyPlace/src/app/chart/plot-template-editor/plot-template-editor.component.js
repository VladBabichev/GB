var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { environment } from "../../../environments/environment";
let PlotTemplateEditorComponent = class PlotTemplateEditorComponent {
    constructor() {
        this.cancel = new EventEmitter();
        this.save = new EventEmitter();
    }
    ngOnInit() {
        this.checkXAxisInitialized();
    }
    checkTemplateInitialized() {
        if (this.plotTemplate == null) {
            this.plotTemplate = {
                id: "",
                name: "",
                userId: "",
                checkChargeDischarge: false,
                useAgregateData: true,
                useCycleData: false,
                useFirstCycle: false,
                useCRateCalculation: false,
                useDischargeCRateCalculation: false,
                canEdit: true,
                xAxis: this.createNewSeriesTemplate(),
                useSpecification: false,
                unit: null,
                yAxis: [],
                plotParameters: {
                    maxCycles: environment.maxCycles,
                    maxPointsPerSeries: environment.maxPointsPerSeries,
                    fromCycle: null,
                    toCycle: null,
                    everyNthCycle: null,
                    customCycleFilter: null,
                    disableCharge: null,
                    legendShowen: null,
                    simplification: 1,
                    disableDischarge: false,
                    threshold: null,
                    minY: null,
                    maxY: null,
                    xLineVisible: false,
                    yLineVisible: true,
                    isInitialized: true,
                    currentUoM: null,
                    capacityUoM: null,
                    timeUoM: null,
                    powerUoM: null,
                    energyUoM: null,
                    resistanceUoM: null,
                    normalizeBy: null,
                    fontFamilyName: "Verdana",
                    fontSize: 20,
                    pointSize: 1,
                    xAxisText: null,
                    yAxisText: [],
                    chartTitle: null,
                    axisRange: {
                        xAxis: null,
                        yAxis: null,
                        y2Axis: null
                    },
                    chartPalette: []
                }
            };
        }
    }
    checkXAxisInitialized() {
        this.checkTemplateInitialized();
        if (this.plotTemplate.xAxis == null) {
            this.plotTemplate.xAxis = this.createNewSeriesTemplate();
        }
    }
    checkXAxisDenominatorInitialized() {
        if (this.plotTemplate.xAxis.denominator == null) {
            this.plotTemplate.xAxis.denominator = {
                arg1: {
                    arg: "",
                    multiplierType: 0,
                    type: "",
                    isConstValue: false
                },
                arg2: null,
                action: 0
            };
        }
    }
    checkYAxisInitialized(index) {
        if (this.plotTemplate.yAxis == null || this.plotTemplate.yAxis.length < index + 1) {
            this.plotTemplate.yAxis = [];
            this.plotTemplate.yAxis.push(this.createNewSeriesTemplate());
        }
    }
    checkYAxisDenominatorInitialized(index) {
        if (this.plotTemplate.yAxis[0].denominator == null) {
            this.plotTemplate.yAxis[0].denominator = {
                arg1: {
                    arg: "",
                    multiplierType: 0,
                    type: "",
                    isConstValue: false
                },
                arg2: null,
                action: 0
            };
        }
    }
    createNewSeriesTemplate() {
        return {
            axis: "",
            valueField: "",
            title: "",
            color: "",
            name: "",
            numerator: {
                arg1: {
                    arg: "",
                    multiplierType: 0,
                    type: "",
                    isConstValue: false
                },
                arg2: null,
                action: 0
            },
            denominator: null
        };
    }
    onChangeTemplateName(e) {
        this.plotTemplate.name = e.target.value;
    }
    onChangeTemplateUseCycleData(e) {
        this.plotTemplate.useCycleData = e.target.checked;
        if (this.plotTemplate.useCycleData) {
            this.checkXAxisInitialized();
            this.plotTemplate.xAxis.axis = "x";
            this.plotTemplate.xAxis.valueField = "x";
            this.plotTemplate.xAxis.name = "Cycle";
            this.plotTemplate.xAxis.title = "Cycle";
            this.plotTemplate.xAxis.numerator.arg1.arg = "CycleNumber";
            this.plotTemplate.xAxis.numerator.arg1.isConstValue = false;
            this.plotTemplate.xAxis.numerator.arg1.type = "System.Double";
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 0;
        }
    }
    onChangeTemplateUseFirstCycle(e) {
        this.plotTemplate.useFirstCycle = e.target.checked;
    }
    onChangeTemplateChargeDischarge(e) {
        this.plotTemplate.useAgregateData = false;
        this.plotTemplate.checkChargeDischarge = e.target.checked;
    }
    onChangeTemplateUseAgregateData(e) {
        this.plotTemplate.useAgregateData = e.target.checked;
        this.plotTemplate.checkChargeDischarge = false;
    }
    onChangeArg1AllPointsNumeratorX(e) {
        this.checkXAxisInitialized();
        this.plotTemplate.xAxis.axis = "x";
        this.plotTemplate.xAxis.valueField = "x";
        this.plotTemplate.xAxis.name = e.target.value;
        this.plotTemplate.xAxis.title = e.target.value;
        this.plotTemplate.xAxis.numerator.arg1.arg = e.target.value;
        this.plotTemplate.xAxis.numerator.arg1.isConstValue = e.target.value === "1";
        this.plotTemplate.xAxis.numerator.arg1.type = "System.Double";
        if (e.target.value === "Capacity") {
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 2;
        }
        else if (e.target.value === "Current") {
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 1;
        }
        else {
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 0;
        }
    }
    onChangeArg1CycleNumeratorX(e) {
        this.checkXAxisInitialized();
        this.plotTemplate.xAxis.axis = "x";
        this.plotTemplate.xAxis.valueField = "x";
        this.plotTemplate.xAxis.name = "Cycle";
        this.plotTemplate.xAxis.title = "Cycle";
        this.plotTemplate.xAxis.numerator.arg1.arg = e.target.value;
        this.plotTemplate.xAxis.numerator.arg1.isConstValue = e.target.value === "1";
        this.plotTemplate.xAxis.numerator.arg1.type = "System.Double";
        if (e.target.value === "Capacity") {
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 2;
        }
        else if (e.target.value === "ChargeEndCurrent") {
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 1;
        }
        else {
            this.plotTemplate.xAxis.numerator.arg1.multiplierType = 0;
        }
    }
    onChangeActionNumeratorX(e) {
        this.checkXAxisInitialized();
        this.plotTemplate.xAxis.numerator.action = e.target.value;
    }
    onChangeArg2NumeratorX(e) {
        this.checkXAxisInitialized();
        if (e.target.value === "None") {
            this.plotTemplate.xAxis.numerator.arg2 = null;
        }
        else {
            this.plotTemplate.xAxis.numerator.arg2 = {
                arg: "",
                multiplierType: 0,
                type: "",
                isConstValue: false
            };
            this.plotTemplate.xAxis.numerator.arg2.arg = e.target.value;
            this.plotTemplate.xAxis.numerator.arg2.isConstValue = false;
            this.plotTemplate.xAxis.numerator.arg2.type = "System.Double";
        }
    }
    onChangeArg1DenominatorX(e) {
        this.checkXAxisInitialized();
        this.checkXAxisDenominatorInitialized();
        this.plotTemplate.xAxis.axis = "y";
        this.plotTemplate.xAxis.valueField = "y";
        this.plotTemplate.xAxis.name = e.target.value;
        this.plotTemplate.xAxis.title = e.target.value;
        if (e.target.value === "None") {
            this.plotTemplate.xAxis.denominator.arg1 = null;
        }
        else {
            this.plotTemplate.xAxis.denominator.arg1.arg = e.target.value;
            this.plotTemplate.xAxis.denominator.arg1.isConstValue = e.target.value === "100";
            this.plotTemplate.xAxis.denominator.arg1.type = "System.Double";
            if (e.target.value === "Capacity") {
                this.plotTemplate.xAxis.denominator.arg1.multiplierType = 2;
            }
            else if (e.target.value === "Current" || e.target.value === "ChargeEndCurrent") {
                this.plotTemplate.xAxis.denominator.arg1.multiplierType = 1;
            }
            else {
                this.plotTemplate.xAxis.denominator.arg1.multiplierType = 0;
            }
        }
    }
    onChangeActionDenominatorX(e) {
        this.checkXAxisInitialized();
        this.checkXAxisDenominatorInitialized();
        this.plotTemplate.xAxis.denominator.action = e.target.value;
    }
    onChangeArg2DenominatorX(e) {
        this.checkXAxisInitialized();
        this.checkXAxisDenominatorInitialized();
        if (e.target.value === "None") {
            this.plotTemplate.xAxis.denominator.arg2 = null;
        }
        else {
            this.plotTemplate.xAxis.denominator.arg2 = {
                arg: "",
                multiplierType: 0,
                type: "",
                isConstValue: false
            };
            this.plotTemplate.xAxis.denominator.arg2.arg = e.target.value;
            this.plotTemplate.xAxis.denominator.arg2.isConstValue = false;
            this.plotTemplate.xAxis.denominator.arg2.type = "System.Double";
        }
    }
    onChangeArg1NumeratorY(e) {
        this.checkYAxisInitialized(0);
        this.plotTemplate.yAxis[0].axis = "y";
        this.plotTemplate.yAxis[0].valueField = "y";
        this.plotTemplate.yAxis[0].name = e.target.value;
        this.plotTemplate.yAxis[0].title = e.target.value;
        if (e.target.value === "None") {
            this.plotTemplate.yAxis[0].numerator.arg1 = null;
        }
        else {
            this.plotTemplate.yAxis[0].numerator.arg1.arg = e.target.value;
            this.plotTemplate.yAxis[0].numerator.arg1.isConstValue = e.target.value === "1";
            this.plotTemplate.yAxis[0].numerator.arg1.type = "System.Double";
            if (e.target.value === "Capacity") {
                this.plotTemplate.yAxis[0].numerator.arg1.multiplierType = 2;
            }
            else if (e.target.value === "Current" || e.target.value === "ChargeEndCurrent") {
                this.plotTemplate.yAxis[0].numerator.arg1.multiplierType = 1;
            }
            else {
                this.plotTemplate.yAxis[0].numerator.arg1.multiplierType = 0;
            }
        }
    }
    onChangeActionNumeratorY(e) {
        this.checkYAxisInitialized(0);
        this.plotTemplate.yAxis[0].numerator.action = e.target.value;
    }
    onChangeArg2NumeratorY(e) {
        this.checkYAxisInitialized(0);
        if (e.target.value === "None") {
            this.plotTemplate.yAxis[0].numerator.arg2 = null;
        }
        else {
            this.plotTemplate.yAxis[0].numerator.arg2 = {
                arg: "",
                multiplierType: 0,
                type: "",
                isConstValue: false
            };
            this.plotTemplate.yAxis[0].numerator.arg2.arg = e.target.value;
            this.plotTemplate.yAxis[0].numerator.arg2.isConstValue = false;
            this.plotTemplate.yAxis[0].numerator.arg2.type = "System.Double";
        }
    }
    onChangeArg1DenominatorY(e) {
        this.checkYAxisInitialized(0);
        this.checkYAxisDenominatorInitialized(0);
        if (e.target.value === "None") {
            this.plotTemplate.yAxis[0].denominator.arg1 = null;
        }
        else {
            this.plotTemplate.yAxis[0].denominator.arg1.arg = e.target.value;
            this.plotTemplate.yAxis[0].denominator.arg1.isConstValue = e.target.value === "100";
            this.plotTemplate.yAxis[0].denominator.arg1.type = "System.Double";
            if (e.target.value === "Capacity") {
                this.plotTemplate.yAxis[0].denominator.arg1.multiplierType = 2;
            }
            else if (e.target.value === "Current" || e.target.value === "ChargeEndCurrent") {
                this.plotTemplate.yAxis[0].denominator.arg1.multiplierType = 1;
            }
            else {
                this.plotTemplate.yAxis[0].denominator.arg1.multiplierType = 0;
            }
        }
    }
    onChangeActionDenominatorY(e) {
        this.checkYAxisInitialized(0);
        this.checkYAxisDenominatorInitialized(0);
        this.plotTemplate.yAxis[0].denominator.action = e.target.value;
    }
    onChangeArg2DenominatorY(e) {
        this.checkYAxisInitialized(0);
        this.checkYAxisDenominatorInitialized(0);
        if (e.target.value === "None") {
            this.plotTemplate.yAxis[0].denominator.arg2 = null;
        }
        else {
            this.plotTemplate.yAxis[0].denominator.arg2 = {
                arg: "",
                multiplierType: 0,
                type: "",
                isConstValue: false
            };
            this.plotTemplate.yAxis[0].denominator.arg2.arg = e.target.value;
            this.plotTemplate.yAxis[0].denominator.arg2.isConstValue = false;
            this.plotTemplate.yAxis[0].denominator.arg2.type = "System.Double";
        }
    }
    onCancel() {
        this.cancel.emit();
    }
    onSave() {
        this.save.emit(this.plotTemplate);
    }
};
__decorate([
    Input()
], PlotTemplateEditorComponent.prototype, "plotTemplate", void 0);
__decorate([
    Input()
], PlotTemplateEditorComponent.prototype, "selectedTemplateName", void 0);
__decorate([
    Output()
], PlotTemplateEditorComponent.prototype, "cancel", void 0);
__decorate([
    Output()
], PlotTemplateEditorComponent.prototype, "save", void 0);
PlotTemplateEditorComponent = __decorate([
    Component({
        selector: "app-plot-template-editor",
        templateUrl: "plot-template-editor.component.html",
        styleUrls: ["plot-template-editor.component.css"]
    })
], PlotTemplateEditorComponent);
export { PlotTemplateEditorComponent };
//# sourceMappingURL=plot-template-editor.component.js.map