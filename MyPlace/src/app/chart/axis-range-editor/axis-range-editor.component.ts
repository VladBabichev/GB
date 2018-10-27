import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DxNumberBoxComponent } from "devextreme-angular";

import { AxisRange, AxisRangeItem, Chart } from "../model";

@Component({
    selector: "app-axis-range-editor",
    templateUrl: "./axis-range-editor.component.html",
    styleUrls: ["./axis-range-editor.component.css"]
})
export class AxisRangeEditorComponent {
    @Input()
    value: AxisRange;

    @Output()
    cancel = new EventEmitter();

    @Output()
    save = new EventEmitter<AxisRange>();

    @ViewChild('xAxisFrom') xAxisFrom: DxNumberBoxComponent;
    @ViewChild('xAxisTo') xAxisTo: DxNumberBoxComponent;
    @ViewChild('yAxisFrom') yAxisFrom: DxNumberBoxComponent;
    @ViewChild('yAxisTo') yAxisTo: DxNumberBoxComponent;
    @ViewChild('y2AxisFrom') y2AxisFrom: DxNumberBoxComponent;
    @ViewChild('y2AxisTo') y2AxisTo: DxNumberBoxComponent;

    onCancel(): void {
        this.cancel.emit();
    }

    onSave(): void {
        this.save.emit(
        {
            xAxis: {
                from: <any>this.xAxisFrom.value === "" ? null : this.xAxisFrom.value,
                to: <any>this.xAxisTo.value === "" ?  null : this.xAxisTo.value
            },
            yAxis: {
                from: <any>this.yAxisFrom.value === "" ? null : this.yAxisFrom.value,
                to: <any>this.yAxisTo.value === "" ?  null : this.yAxisTo.value
            },
            y2Axis: !(this.value && this.value.y2Axis)
                ? null
                : {
                    from: <any>this.y2AxisFrom.value === "" ?  null : this.y2AxisFrom.value,
                    to: <any>this.y2AxisTo.value === "" ?  null : this.y2AxisTo.value
                } 
        });
    }
}
