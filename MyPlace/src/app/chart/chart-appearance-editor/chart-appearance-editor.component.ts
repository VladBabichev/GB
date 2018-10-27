import { Component, EventEmitter, OnDestroy, Input, Output, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

import { PlotParameters } from "../model/chart-plot-settings";
import { LocalizationBaseComponent } from "../../core/localization-base.component";

@Component({
    selector: "app-chart-appearance-editor",
    templateUrl: "./chart-appearance-editor.component.html",
    styleUrls: ["./chart-appearance-editor.component.css"]
})
export class ChartAppearanceEditorComponent extends LocalizationBaseComponent implements OnInit, OnChanges  {

    @Input()
    plotParameters: PlotParameters;

    @Output()
    save = new EventEmitter<any>();

    @Output()
    cancel = new EventEmitter();

    legendPositions = [{ name: "Inside Chart", value: "inside" }, { name: "Outside Chart", value: "outside" }];
    legendHorizontalPositions= [{ name: "Alight Left", value: "left" }, { name: "Center", value: "center" }, { name: "Alight Right", value: "right" }];
    legendVerticalPositions = [{ name: "Top", value: "top" }, { name: "Bottom", value: "bottom" }];

    chartSettingForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        super();
        
        this.createLegendSettingForm();
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["plotParameters"]) {
            //this.chartAppearanceEditor.plotParameters = this.plotParameters;
            this.chartSettingForm.setValue({
                legend: {
                    position: this.plotParameters.legend && this.plotParameters.legend.position,
                    horizontalAlignment: this.plotParameters.legend && this.plotParameters.legend.horizontalAlignment,
                    verticalAlignment: this.plotParameters.legend && this.plotParameters.legend.verticalAlignment,
                    orientation: this.plotParameters.legend && this.plotParameters.legend.orientation
                },
                common: {
                    horizontalSize: this.plotParameters.horizontalSize || null,
                    verticalSize: this.plotParameters.verticalSize || null,
                    pointSize: this.plotParameters.pointSize,
                    seriesLineThickness: this.plotParameters.seriesLineThickness,
                    xMajorTickInterval: this.plotParameters.xMajorTickInterval,
                    xMinorTickCount: this.plotParameters.xMinorTickCount,
                    xMinorTickVisible: this.plotParameters.xMinorTickVisible,
                    yMajorTickInterval: this.plotParameters.yMajorTickInterval,
                    yMinorTickCount: this.plotParameters.yMinorTickCount,
                    yMinorTickVisible: this.plotParameters.yMinorTickVisible,
                    y2MajorTickInterval: this.plotParameters.y2MajorTickInterval,
                    y2MinorTickCount: this.plotParameters.y2MinorTickCount,
                    y2MinorTickVisible: this.plotParameters.y2MinorTickVisible,
                    xLineVisible: this.plotParameters.xLineVisible,
                    yLineVisible: this.plotParameters.yLineVisible,
                    fontFamilyName: this.plotParameters.fontFamilyName,
                    fontSize: this.plotParameters.fontSize                    
                }
            });
        }
    }

    onSave(): void {
        const commonSettings = this.chartSettingForm.value.common;

        this.plotParameters.pointSize = commonSettings.pointSize;
        this.plotParameters.seriesLineThickness = commonSettings.seriesLineThickness;
        this.plotParameters.xLineVisible = commonSettings.xLineVisible;
        this.plotParameters.yLineVisible = commonSettings.yLineVisible;
        this.plotParameters.horizontalSize = commonSettings.horizontalSize;
        this.plotParameters.verticalSize = commonSettings.verticalSize;
        this.plotParameters.fontFamilyName = commonSettings.fontFamilyName;
        this.plotParameters.fontSize = commonSettings.fontSize;

        this.plotParameters.xMajorTickInterval = commonSettings.xMajorTickInterval;
        this.plotParameters.xMinorTickCount = commonSettings.xMinorTickCount;
        this.plotParameters.xMinorTickVisible = commonSettings.xMinorTickVisible;

        this.plotParameters.yMajorTickInterval = commonSettings.yMajorTickInterval;
        this.plotParameters.yMinorTickCount = commonSettings.yMinorTickCount;
        this.plotParameters.yMinorTickVisible = commonSettings.yMinorTickVisible;

        this.plotParameters.y2MajorTickInterval = commonSettings.y2MajorTickInterval;
        this.plotParameters.y2MinorTickCount = commonSettings.y2MinorTickCount;
        this.plotParameters.y2MinorTickVisible = commonSettings.y2MinorTickVisible;
        
        this.plotParameters.legend = this.chartSettingForm.value.legend;
        this.save.emit(this.plotParameters);
    }

    onCancel(): void {
        this.cancel.emit();
    }

    private createLegendSettingForm(): void {
        this.chartSettingForm = this.formBuilder.group({
            legend: this.formBuilder.group({
                position: this.plotParameters && this.plotParameters.legend && this.plotParameters.legend.position,
                horizontalAlignment: this.plotParameters && this.plotParameters.legend && this.plotParameters.legend.horizontalAlignment,
                verticalAlignment: this.plotParameters && this.plotParameters.legend && this.plotParameters.legend.verticalAlignment,
                orientation: this.plotParameters && this.plotParameters.legend && this.plotParameters.legend.orientation
            }),
            common: this.formBuilder.group({
                horizontalSize: null,
                verticalSize: null,
                pointSize: null,
                seriesLineThickness: null,
                xMajorTickInterval: null,
                xMinorTickCount: null,
                xMinorTickVisible: null,
                yMajorTickInterval: null,
                yMinorTickCount: null,
                yMinorTickVisible: null,
                y2MajorTickInterval: null,
                y2MinorTickCount: null,
                y2MinorTickVisible: null,
                xLineVisible: null,
                yLineVisible: null,
                fontFamilyName: null,
                fontSize: null
            })
        });
    }
}