import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges} from "@angular/core";

import { PlotTemplate, PlotParameters } from "../../model/chart-plot-settings";
import { ChartAppearanceEditorComponent } from "../../chart-appearance-editor/chart-appearance-editor.component";


@Component({
    selector: "app-custom-template-edit",
    templateUrl: "custom-template-edit.component.html",
    styleUrls: ["custom-template-edit.component.css"]
})
export class CustomTemplateEditComponent implements OnInit, OnChanges  {
    @Input() plotTemplate: PlotTemplate;
    @Input() plotParameters: PlotParameters;
    @ViewChild(ChartAppearanceEditorComponent) chartAppearanceEditor;

    argumentAxisItems = [];
    valueAxisItems = [];
    filteredValueAxisItems = [];
    filteredValueAxisControlSettings = {};

    showValueAxisSelector: boolean;
    selectedArgumentAxisItem: any;
    selectedValueAxisItems = [];

    ngOnInit(): void {
        this.selectedArgumentAxisItem = "None";
        this.filteredValueAxisControlSettings = {
            singleSelection: false,
            text: "Select Y-Axis Dimensions",
            enableSearchFilter: true,
            classes: "myclass custom-class",
            limitSelection: 2
        };

        this.argumentAxisItems = [
            { id: "CycleNumber", itemName: "Cycle Number", valueAxisType: "cycle" },
            { id: "CRate", itemName: "Charge C-Rate", valueAxisType: "c-rate" },
            { id: "DischargeCRate", itemName: "Discharge C-Rate", valueAxisType: "discharge-c-rate" },
            { id: "ChargeEndCurrent", itemName: "Charge Final Current", valueAxisType: "cycle" },
            { id: "DischargeEndCurrent", itemName: "Discharge Final Current", valueAxisType: "cycle" },
            { id: "MidVoltage", itemName: "Medium Voltage", valueAxisType: "cycle" },
            { id: "ChargeEndVoltage", itemName: "Charge Final Voltage", valueAxisType: "cycle" },
            { id: "DischargeEndVoltage", itemName: "Discharge Final Voltage", valueAxisType: "cycle" },
            { id: "Time", itemName: "Time", valueAxisType: "data" },
            { id: "Current", itemName: "Current", valueAxisType: "data" },
            { id: "Voltage", itemName: "Voltage", valueAxisType: "data" },
            { id: "Energy", itemName: "Energy", valueAxisType: "data" },
            { id: "Power", itemName: "Power", valueAxisType: "data" },
            { id: "Temperature", itemName: "Temperature", valueAxisType: "cycle" },
            { id: "Capacity", itemName: "Capacity", valueAxisType: "data" }
        ];
        this.valueAxisItems = [
            { id: "CycleNumber", itemName: "Cycle Number", type: "cycle", useCycleData: true },
            { id: "CoulombicEfficiency", itemName: "Coulombic Efficiency", type: "cycle" },
            { id: "EnergyEfficiency", itemName: "Energy Efficiency", type: "cycle" },
            { id: "AreaSpecificImpedance", itemName: "Charge Area-Specific Impedance (ASI)", type: "cycle", useCycleData: true, combinedId: "AreaSpecificImpedance:DischargeAreaSpecificImpedance" },
            { id: "DischargeAreaSpecificImpedance", itemName: "Discharge Area-Specific Impedance (ASI)", type: "cycle", useCycleData: true, combinedId: "AreaSpecificImpedance:DischargeAreaSpecificImpedance" },
            { id: "AreaSpecificImpedance:DischargeAreaSpecificImpedance", itemName: "Area-Specific Impedance (ASI)", type: "cycle", useCycleData: true },

            { id: "ChargeEndCurrent", itemName: "Charge Final Current", type: "cycle", useCycleData: true, combinedId: "ChargeEndCurrent:DischargeEndCurrent", multiplierType: 1 },
            { id: "DischargeEndCurrent", itemName: "Discharge Final Current", type: "cycle", useCycleData: true, combinedId: "ChargeEndCurrent:DischargeEndCurrent", multiplierType: 1 },
            { id: "ChargeEndCurrent:DischargeEndCurrent", itemName: "Final Current", type: "cycle", useCycleData: true, multiplierType: 1 },

            { id: "MidVoltage", itemName: "Medium Voltage", type: "cycle", useCycleData: true, multiplierType: 4 },

            { id: "ChargeEndVoltage", itemName: "Charge Final Voltage", type: "cycle", useCycleData: true, combinedId: "ChargeEndVoltage:DischargeEndVoltage", multiplierType: 4 },
            { id: "DischargeEndVoltage", itemName: "Discharge Final Voltage", type: "cycle", useCycleData: true, combinedId: "ChargeEndVoltage:DischargeEndVoltage", multiplierType: 4 },
            { id: "ChargeEndVoltage:DischargeEndVoltage", itemName: "Final Voltage", type: "cycle", useCycleData: true, multiplierType: 4 },
            { id: "ChargeCapacity:DischargeCapacity", itemName: "Capacity", type: "cycle", useCycleData: true, multiplierType: 2 },
            { id: "ChargeCapacityRetention:DischargeCapacityRetention", itemName: "Capacity Retention", type: "cycle", useCycleData: true },
            { id: "Power:DischargePower", itemName: "Power", type: "cycle", useCycleData: true },
            { id: "Temperature", itemName: "Temperature", type: "cycle", useCycleData: true },
            { id: "ChargeEnergy:DischargeEnergy", itemName: "Energy", type: "cycle", useCycleData: true },
            { id: "ResistanceOhms:DischargeResistance", itemName: "Resistance", type: "cycle", useCycleData: true },

            { id: "Time", itemName: "Time", type: "data", useCycleData: false },
            { id: "Current", itemName: "Current", type: "data", useCycleData: false, multiplierType: 1 },
            { id: "Voltage", itemName: "Voltage", type: "data", useCycleData: false, multiplierType: 4 },
            { id: "Capacity", itemName: "Capacity", type: "data", useCycleData: false, multiplierType: 2 },
            { id: "Energy", itemName: "Energy", type: "data", useCycleData: false },
            { id: "Power", itemName: "Power", type: "data", useCycleData: false },
            { id: "Temperature", itemName: "Temperature", type: "data", useCycleData: false },

            { id: "CRate", itemName: "C-Rate", type: "c-rate" },
            { id: "DischargeCapacity", itemName: "Discharge Capacity", type: "c-rate", useCycleData: true, checkChargeDischarge: true },
            { id: "ChargeCapacity", itemName: "Charge Capacity", type: "c-rate", useCycleData: true, checkChargeDischarge: true },
            { id: "DischargeCRate", itemName: "Discharge C-Rate", type: "discharge-c-rate" },
            { id: "DischargeCapacity", itemName: "Discharge Capacity", type: "discharge-c-rate", useCycleData: true, checkChargeDischarge: true },
            { id: "ChargeCapacity", itemName: "Charge Capacity", type: "discharge-c-rate", useCycleData: true, checkChargeDischarge: true }
        ];        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["plotParameters"]) {
            this.chartAppearanceEditor.plotParameters = this.plotParameters;
        }
    }

    onChangeArgumentAxisItem(): void {
        this.selectedValueAxisItems = [];
        if (this.selectedArgumentAxisItem === "None") {
            this.showValueAxisSelector = false;
        } else {
            this.showValueAxisSelector = true;
            this.filterValueAxisItems();
        }
    }

    private filterValueAxisItems(): void {
        this.filteredValueAxisItems = [];
        const temptype = this.argumentAxisItems.find(t => t.id === this.selectedArgumentAxisItem).valueAxisType;
        const valueAxisPair = this.valueAxisItems.find(item => item.id === this.selectedArgumentAxisItem);
        const combinedId = valueAxisPair && valueAxisPair.combinedId;

        // select all all possible values for value-axis based on argument-asxis type
        for (const template of this.valueAxisItems.filter(item => item.type === temptype)) {
            // do not allow display the same data on value & argument axis 
            // do not display combined properties if one of selected as argument (display splitted Charge/Discharge)
            if (template.id === this.selectedArgumentAxisItem || template.id === combinedId)
                continue;
            // do not display splitted Charge/Discharge properties if combined may used instead
            if (template.combinedId && (!combinedId || template.combinedId !== combinedId))
                continue;

            this.filteredValueAxisItems.push({
                id: template.id,
                itemName: template.itemName
            });
        }
    }
}