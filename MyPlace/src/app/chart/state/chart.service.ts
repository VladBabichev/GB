import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { take } from 'rxjs/operators';

import { PlotSeries, PlotTypes } from "../model";
import { AppState } from "../../state";
import { environment } from "../../../environments/environment";
import { AggregationSettings, AxisRange, StateOfCharge, AggregationType, PlotTemplate, PlotParameters, PlotsData, Chart, ChartFilter, ChartUoMSettings, ChartSettings } from "../model";

@Injectable()
export class ChartService {
    constructor(private http: HttpClient, private store: Store<AppState>) {
    }

    get(projectIds: number[], plotType: number, plotTemplateId: string, viewId: number, stateOfCharge: StateOfCharge): Observable<Chart> {
        switch (plotType)
        {
            case PlotTypes.Template:
                {
                    const url = this.makeByTemplateUrl(projectIds, plotTemplateId);
                    return this.http.get<Chart>(url, { withCredentials: true });                    
                }
            case PlotTypes.View:
                {
                    if (this.getSharedToken())
                        return this.getSharedView(this.getSharedToken());

                    const url = this.makeByViewUrl(viewId);
                    return this.http.get<Chart>(url, { withCredentials: true });
                }
            case PlotTypes.StateOfCharge:
                {
                    const url = this.makeByViewUrl(viewId);
                    return this.setStateOfCharge(projectIds, stateOfCharge);
                }
            default:
                {
                    const url = this.makeUrl(projectIds, plotType);
                    return this.http.get<Chart>(url, { withCredentials: true });
                }
        }             
    }
    
    getSharedViewToken(id: number, expirationDuration: number): Observable<string> {
        return this.http.get<string>(`${environment.serverBaseUrl}api/views/share/${id}?expiration=${expirationDuration}`, { withCredentials: true });
    }

    getSharedView(sharedToken: string): Observable<Chart> {
        return this.http.get<Chart>(`${environment.serverBaseUrl}api/views/shared/${sharedToken}`, { withCredentials: true });
    }

    getbytemplate(projectIds: number[], plotTemplateId: string): Observable<Chart> {
        const url = this.makeByTemplateUrl(projectIds, plotTemplateId);
        return this.http.get<Chart>(url, { withCredentials: true });
    }


    getbyview(viewId: number): Observable<Chart> {
        const url = this.makeByViewUrl(viewId);
        return this.http.get<Chart>(url, { withCredentials: true });
    }

    export(projectIds: number[], plotType: number, cycleFilter: ChartFilter,
        aggregationSettings: AggregationSettings, uomSettings: ChartUoMSettings, pointSize: number, templateIdValue?: string, stateOfCharge?: StateOfCharge, data?: any): Observable<Blob> {
        const url = this.makeExportUrl(projectIds, plotType, cycleFilter, aggregationSettings, uomSettings, pointSize, templateIdValue, stateOfCharge, "xlsx");
        const formData: FormData = new FormData();
        formData.append("file", data);

        return this.http.post(url, formData, { responseType: "blob", withCredentials: true, headers: this.getSharedTokenHeader() });
    }

    exportAll(projectIds: number[], plotType: number, uomSettings: ChartUoMSettings, pointSize: number, templateIdValue?: string, stateOfCharge?: StateOfCharge, data?: any): Observable<Blob> {
        const url = this.makeExportUrl(projectIds, plotType, null, null, uomSettings, pointSize, templateIdValue, stateOfCharge, "xlsx", false);
        const formData: FormData = new FormData();
        formData.append("file", data);

        return this.http.post(url, formData, { responseType: "blob", withCredentials: true, headers: this.getSharedTokenHeader() });
    }

    savetemplate(projectIds: number[], plotTemplate: PlotTemplate): Observable<PlotsData> {
        const url = environment.serverBaseUrl + "api/plots";
        const templateModel = {
            newTemplate: plotTemplate,
            projectIds: projectIds
        };

        return this.http.post<PlotsData>(url, { templateModel: templateModel }, { withCredentials: true });
    }

    deletetemplate(projectIds: number[], plotTemplate: PlotTemplate): Observable<any> {
        const url = environment.serverBaseUrl + "api/plots/" + plotTemplate.id;
        return this.http.delete(url, { withCredentials: true });
    }

    getPlots(): Observable<PlotTemplate[]> {
        const url = environment.serverBaseUrl + "api/plots";

        return this.http.get<PlotTemplate[]>(url, { withCredentials: true });
    }

    saveParameters(cycleFilter: ChartFilter,
        aggregationSettings: AggregationSettings, uomSettings: ChartUoMSettings, legendVisible: boolean | null
        , plotParameters: PlotParameters): Observable<any> {
        const url = environment.serverBaseUrl + "api/setParameters";

        const parametersModel = {
            maxCycles: environment.maxCycles,
            simplification: 1,
            maxPointsPerSeries: environment.maxPointsPerSeries,
            fromCycle: null,
            toCycle: null,
            everyNthCycle: null,
            customCycleFilter: null,
            disableCharge: null,
            disableDischarge: null,
            threshold: null,
            minY: null,
            maxY: null,
            currentUoM: null,
            capacityUoM: null,
            timeUoM: null,
            powerUoM: null,
            energyUoM: null,
            resistanceUoM: null,
            isInitialized: false,
            normalizeBy: null,
            fontSize: 0,
            fontFamilyName: null,
            pointSize: null,
            xLineVisible: null,
            yLineVisible: null,
            legendShowen: legendVisible,
            xAxisText: null,
            yAxisText: [],
            chartTitle: null,
            axisRange: null,
            seriesLineThickness: null,
            legend: null,
            xMajorTickInterval: null,
            xMinorTickCount: null,
            xMinorTickVisible: false,
            yMajorTickInterval: null,
            yMinorTickCount: null,
            yMinorTickVisible: false,
            y2MajorTickInterval: null,
            y2MinorTickCount: null,
            y2MinorTickVisible: false,
        }

        if (plotParameters) {
            parametersModel.legend = plotParameters.legend;
            parametersModel.fontSize = plotParameters.fontSize;
            parametersModel.fontFamilyName = plotParameters.fontFamilyName;
            parametersModel.xMajorTickInterval = plotParameters.xMajorTickInterval;
            parametersModel.xMinorTickCount = plotParameters.xMinorTickCount;
            parametersModel.xMinorTickVisible = plotParameters.xMinorTickVisible;
            parametersModel.yMajorTickInterval = plotParameters.yMajorTickInterval;
            parametersModel.yMinorTickCount = plotParameters.yMinorTickCount;
            parametersModel.yMinorTickVisible = plotParameters.yMinorTickVisible;

            parametersModel.y2MinorTickVisible = plotParameters.y2MinorTickVisible;
            parametersModel.y2MinorTickCount = plotParameters.y2MinorTickCount;
            parametersModel.y2MinorTickVisible = plotParameters.y2MinorTickVisible;

            parametersModel.seriesLineThickness = plotParameters.seriesLineThickness;
            parametersModel.pointSize = plotParameters.pointSize;
            parametersModel.isInitialized = plotParameters.isInitialized;
            parametersModel.xLineVisible = plotParameters.xLineVisible;
            parametersModel.yLineVisible = plotParameters.yLineVisible;
            if (plotParameters.xAxisText != "") {
                parametersModel.xAxisText = plotParameters.xAxisText;
            }
            if (plotParameters.chartTitle != "") {
                parametersModel.chartTitle = plotParameters.chartTitle;
            }

            if (plotParameters.yAxisText.length > 0) {
                parametersModel.yAxisText = plotParameters.yAxisText;
            }
            if (plotParameters.axisRange) {
                parametersModel.axisRange = plotParameters.axisRange;
            }
        }

        
        if (aggregationSettings) {
            parametersModel.simplification = aggregationSettings.algorithm;
            if (aggregationSettings.algorithm === AggregationType.None) {
                parametersModel.maxPointsPerSeries = null;
            }
        }

        if (cycleFilter) {
            parametersModel.fromCycle = cycleFilter.from;
            parametersModel.toCycle = cycleFilter.to;
            parametersModel.everyNthCycle = cycleFilter.everyNth;
            if (cycleFilter.custom) {
                parametersModel.customCycleFilter = encodeURIComponent(cycleFilter.custom);
            }
            parametersModel.disableCharge = cycleFilter.disableCharge;
            parametersModel.disableDischarge = cycleFilter.disableDischarge;
            parametersModel.threshold = cycleFilter.threshold;
            parametersModel.minY = cycleFilter.minY;
            parametersModel.maxY = cycleFilter.maxY;
        }

        if (uomSettings) {
            if (uomSettings.currentUoM) {
                parametersModel.currentUoM = uomSettings.currentUoM;
            }

            if (uomSettings.capacityUoM) {
                parametersModel.capacityUoM = uomSettings.capacityUoM;
            }

            if (uomSettings.timeUoM) {
                parametersModel.timeUoM = uomSettings.timeUoM;
            }

            if (uomSettings.powerUoM) {
                parametersModel.powerUoM = uomSettings.powerUoM;
            }

            if (uomSettings.energyUoM) {
                parametersModel.energyUoM = uomSettings.energyUoM;
            }

            if (uomSettings.resistanceUoM) {
                parametersModel.resistanceUoM = uomSettings.resistanceUoM;
            }

            if (uomSettings.normalizeBy) {
                parametersModel.normalizeBy = uomSettings.normalizeBy;
            }
        }

        return this.http.post<any>(url, { parametersModel: parametersModel }, { headers: this.getSharedTokenHeader(), withCredentials: true });
    }

    shareTemplate(objectIds: number[], email: string, plotType: number): Observable<any> {

        switch (plotType) {
            case -1:
                {
                    const url = environment.serverBaseUrl + "api/plots/share";

                    const shareModel = {
                        objectIds: objectIds,
                        email: email
                    };

                    return this.http.post<any>(url, shareModel, { withCredentials: true });
                }
            case -2:
                {
                    const url = environment.serverBaseUrl + "api/shareView";

                    const parametersModel = {
                        objectIds: objectIds,
                        email: email
                    };

                    return this.http.post<any>(url, { parametersModel: parametersModel }, { withCredentials: true });
                }
            default: {              
                return null;
            }
        }           
    }

    shareProject(objectIds: number[], email: string): Observable<any> {
        const url = environment.serverBaseUrl + "api/shareProject";

        const parametersModel = {
            objectIds: objectIds,
            email: email
        };

        return this.http.post<any>(url, { parametersModel: parametersModel }, { withCredentials: true });
    }

    setDefaultParameters(): Observable<any> {
        const url = environment.serverBaseUrl + "api/setDefaultParameters";

        const parametersModel = {
            maxCycles: environment.maxCycles,
            maxPointsPerSeries: environment.maxPointsPerSeries,
            fromCycle: null,
            toCycle: null,
            everyNthCycle: null,
            customCycleFilter: null,
            disableCharge: null,
            disableDischarge: null,
            threshold: null,
            minY: null,
            maxY: null,
            currentUoM: null,
            capacityUoM: null,
            timeUoM: null,
            powerUoM: null,
            energyUoM: null,
            resistanceUoM: null,
            isInitialized: true,
            simplification: 1,
            normalizeBy: null,
            pointSize: null,
            xLineVisible: null,
            yLineVisible: null,
            xAxisText: null,
            yAxisText: [],
            chartTitle: null
        };

        return this.http.post<any>(url, { parametersModel: parametersModel }, { headers: this.getSharedTokenHeader(), withCredentials: true });
    }

    setStateOfCharge(projectIds: number[],
        stateOfCharge: StateOfCharge): Observable<Chart> {
        const url = this.makeSOCUrl(projectIds, stateOfCharge);
        return this.http.get<Chart>(url, { withCredentials: true });
    }

    createTemplate(templateName: string, plotType: number, plotTemplate: PlotTemplate, plotParameters: PlotParameters): PlotTemplate {

        let useCycleData = false;
        let useFirstCycle = false;
        let useAgregateData = true;
        let yAxis = [];
        let xAxis;
        const setupXAxis = function (name: string, title: string, argumentName: string, multiplierType: number) {
            return {
                axis: "x",
                color: "",
                denominator: null,
                name: name,
                numerator: {
                    action: 0,
                    arg1: {
                        arg: argumentName,
                        isConstValue: false,
                        multiplierType: multiplierType,
                        type: ""
                    },
                    arg2: null
                },
                title: title,
                valueField: "x"
            }
        }

        const setupYAxis = function (name: string, title: string, argumentName: string, multiplierType: number) {
            return {
                axis: "y",
                color: "",
                denominator: null,
                name: name,
                numerator: {
                    action: 0,
                    arg1: {
                        arg: name,
                        isConstValue: false,
                        multiplierType: multiplierType,
                        type: ""
                    },
                    arg2: null
                },
                title: title,
                valueField: "y"
            }
        }
        
        switch (plotType) {
            case 0: // EndCapacity
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("ChargeCapacity:DischargeCapacity", "Capacity", "ChargeCapacity:DischargeCapacity", 2));
                useCycleData = true;
                break;
            case 3: // MidVoltage
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("MidVoltage", "Medium Voltage", "MidVoltage", 4));
                useCycleData = true;
                break;
            case 4: // VoltageCapacity
                xAxis = setupXAxis("Capacity", "Capacity", "Capacity", 2);
                yAxis.push(setupYAxis("Voltage", "Voltage", "Voltage", 4));
                useCycleData = false;
                useAgregateData = false;
                break;
            case 8: // CoulombicEfficiency
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("CoulombicEfficiency", "Coulombic Efficiency", "CoulombicEfficiency", 0));
                useCycleData = true;
                break;
            case 11: // DifferentialVoltage
                xAxis = setupXAxis("Capacity", "Capacity", "Capacity", 2);
                yAxis.push(setupYAxis("Voltage", "DQDV", "Voltage", 4));
                useFirstCycle = true;
                useCycleData = false;
                break;
            case 12: // DifferentialCapacity
                xAxis = setupXAxis("Voltage", "Voltage", "Voltage", 4);
                yAxis.push(setupYAxis("Capacity", "DQDV", "Capacity", 2));
                useFirstCycle = true;
                useCycleData = false;
                break;
            case 13: // EndTimeEndCurrent
                xAxis = setupXAxis("Time", "Time", "Time", 5);
                yAxis.push(setupYAxis("Current", "Current", "Current", 1));
                useCycleData = false;
                break;
            case 14: // EndTimeEndVoltage
                xAxis = setupXAxis("Time", "Time", "Time", 5);
                yAxis.push(setupYAxis("Voltage", "Voltage", "Voltage", 4));
                useCycleData = false;
                break;
            case 15: // ResistanceOhms
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("ResistanceOhms:DischargeResistance", "Resistance", "ResistanceOhms:DischargeResistance", 3));
                useCycleData = true;
                break;
            case 16: // CapacityRetention
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("ChargeCapacityRetention:DischargeCapacityRetention", "Capacity Retention", "ChargeCapacityRetention:DischargeCapacityRetention", 0));
                useCycleData = true;
                break;
            case 17: // Energy
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("ChargeEnergy:DischargeEnergy", "Energy", "ChargeEnergy:DischargeEnergy", 6));
                useCycleData = true;
                break;
            case 18: // Power
                xAxis = setupXAxis("CycleNumber", "CycleNumber", "CycleNumber", 0);
                yAxis.push(setupYAxis("Power:DischargePower", "Power", "Power:DischargePower", 7));
                useCycleData = true;
                break;
        }

        return {
            plotParameters: plotParameters,
            checkChargeDischarge: false,
            name: templateName,
            useCRateCalculation: plotTemplate && plotTemplate.useCRateCalculation || false,
            useDischargeCRateCalculation: plotTemplate && plotTemplate.useDischargeCRateCalculation || false,
            useAgregateData: plotTemplate && plotTemplate.useAgregateData || useAgregateData,
            useCycleData: plotTemplate && plotTemplate.useCycleData || useCycleData,
            useFirstCycle: plotTemplate && plotTemplate.useFirstCycle || useFirstCycle,
            canEdit: true,
            xAxis: plotTemplate && plotTemplate.xAxis || xAxis,
            yAxis: plotTemplate && plotTemplate.yAxis || yAxis,
            id: "",
            userId: "",
            useSpecification: false,
            unit:null
        };
    }

    deleteProjects(objectIds: number[]): Observable<any> {
        const url = environment.serverBaseUrl + "api/deleteProjects";
       
        const parametersModel = {
            objectIds: objectIds
        };
        return this.http.post<any>(url, { parametersModel: parametersModel }, { withCredentials: true });
    }

    private makeSOCUrl(projectIds: number[], stateOfCharge: StateOfCharge): string {
        let url = environment.serverBaseUrl + "api/setStateOfCharge?";

        for (const projectId of projectIds) {
            url += `&projectId=${projectId}`;
        }

        if (stateOfCharge) {
            if (stateOfCharge.chargeFrom) {
                url += `&chargeFrom=${stateOfCharge.chargeFrom}`;
            }

            if (stateOfCharge.chargeTo) {
                url += `&chargeTo=${stateOfCharge.chargeTo}`;
            }
        }
        return url;
    }

    private getSharedTokenHeader() {
        const token = this.getSharedToken();
        return token ? { "X-DQDV-TOKEN": token } : {};
    }

    private getSharedToken(): string {
        let state: AppState;
        this.store.pipe(take(1)).subscribe(s => state = s);

        return state.chart.sharedToken;
    }

    private makeUrl(projectIds: number[], plotType: number): string {
        let url = environment.serverBaseUrl + "api/chart?plotType=" + plotType;       

        for (const projectId of projectIds) {
            url += `&projectId=${projectId}`;
        }             
        return url;
    }

    private makeExportUrl(projectIds: number[], plotType: number,
        cycleFilter: ChartFilter, aggregationSettings: AggregationSettings,
        uomSettings: ChartUoMSettings, pointSize: number = 1, templateIdValue?: string, stateOfCharge?: StateOfCharge,
        format?: string, useMaxCycles: boolean = true): string {
        let url = environment.serverBaseUrl + "api/exportchart?plotType=" + plotType;

        
        if (templateIdValue) {
            url += `&templateIdValue=${templateIdValue}`;
        }

        if (format) {
            url += `&format=${encodeURIComponent(format)}`;
        }

        for (const projectId of projectIds) {
            url += `&projectId=${projectId}`;
        }

        if (useMaxCycles && environment.maxCycles) {
            url += `&maxCycles=${environment.maxCycles}`;
        }

        if (aggregationSettings) {
            if (aggregationSettings.algorithm != AggregationType.None) {
                url += `&maxPointsPerSeries=${environment.maxPointsPerSeries}`;
            }
        }

        if (cycleFilter) {
            if (cycleFilter.from) {
                url += `&fromCycle=${cycleFilter.from}`;
            }

            if (cycleFilter.to) {
                url += `&toCycle=${cycleFilter.to}`;
            }

            if (cycleFilter.everyNth) {
                url += `&everyNthCycle=${cycleFilter.everyNth}`;
            }

            if (cycleFilter.custom) {
                url += `&customCycleFilter=${encodeURIComponent(cycleFilter.custom)}`;
            }

            if (cycleFilter.disableCharge) {
                url += `&disableCharge=${cycleFilter.disableCharge}`;
            }

            if (cycleFilter.disableDischarge) {
                url += `&disableDischarge=${cycleFilter.disableDischarge}`;
            }

            if (cycleFilter.threshold) {
                url += `&threshold=${cycleFilter.threshold}`;
            }

            if (cycleFilter.minY) {
                url += `&minY=${cycleFilter.minY}`;
            }

            if (cycleFilter.maxY) {
                url += `&maxY=${cycleFilter.maxY}`;
            }
        }
        if (uomSettings) {
            if (uomSettings.currentUoM) {
                url += `&currentUoM=${uomSettings.currentUoM}`;
            }

            if (uomSettings.capacityUoM) {
                url += `&capacityUoM=${uomSettings.capacityUoM}`;
            }

            if (uomSettings.timeUoM) {
                url += `&timeUoM=${uomSettings.timeUoM}`;
            }

            if (uomSettings.powerUoM) {
                url += `&powerUoM=${uomSettings.powerUoM}`;
            }

            if (uomSettings.energyUoM) {
                url += `&energyUoM=${uomSettings.energyUoM}`;
            }

            if (uomSettings.resistanceUoM) {
                url += `&resistanceUoM=${uomSettings.resistanceUoM}`;
            }

            if (uomSettings.normalizeBy) {
                url += `&normalizeBy=${uomSettings.normalizeBy}`;
            }
        }
        if (stateOfCharge) {
            if (stateOfCharge.chargeFrom) {
                url += `&chargeFrom=${stateOfCharge.chargeFrom}`;
            }

            if (stateOfCharge.chargeTo) {
                url += `&chargeTo=${stateOfCharge.chargeTo}`;
            }
        }
        url += `&pointSize=${pointSize}`;
        return url;
    }

    private makeByTemplateUrl(projectIds: number[], templateIdValue: string, format?: string): string {
        let url = environment.serverBaseUrl + "api/plots/" + templateIdValue + "?";

        if (format) {
            url += `format=${encodeURIComponent(format)}&`;
        }

        for (const projectId of projectIds) {
            url += `projectId=${projectId}&`;
        }
        return url;
    }

    private makeByViewUrl(viewIdValue: number, format?: string): string {
        let url = `${environment.serverBaseUrl}api/views/${viewIdValue}`;

        if (format) {
            url += `&format=${encodeURIComponent(format)}`;
        }
        return url;
    }
}
