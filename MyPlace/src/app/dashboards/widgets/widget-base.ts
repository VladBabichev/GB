import { Output, EventEmitter} from "@angular/core";
//import { EventEmitter } from "events";
import { WidgetInfo, IWidgetCommand } from "../model/interfaces";

export abstract class WidgetBase {
    @Output() onBubble = new EventEmitter<IWidgetCommand>();
    widget: WidgetInfo;
    constructor(private _componentName: string,
        private _columnSpan: number,
        private _rowSpan: number,
        private _widgetProperties: any,
        private _dashboardId: number,
        private _positionNumber: number,
        private _description: string,
        private _id: number
    ) {
    }

    get componentName(): string {
        return this._componentName;
    }

    get columnSpan(): number {
        return this._columnSpan;
    }

    get rowSpan(): number {
        return this._rowSpan;
    }

    get widgetProperties(): any {
        return this._widgetProperties;
    }

    get dashboardId(): number {
        return this._dashboardId;
    }

    get positionNumber(): number {
        return this._positionNumber;
    }

    get description(): string {
        return this._description;
    }

    get id(): number {
        return this._id;
    }

    onRefresh() {

    }

    bubble(e) {
        this.onBubble.emit(e);
    }

    SaveWidget(e) {
        console.log(e);
        //alert(e);
    }
}
