var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Output, EventEmitter } from "@angular/core";
export class WidgetBase {
    constructor(_componentName, _columnSpan, _rowSpan, _widgetProperties, _dashboardId, _positionNumber, _description, _id) {
        this._componentName = _componentName;
        this._columnSpan = _columnSpan;
        this._rowSpan = _rowSpan;
        this._widgetProperties = _widgetProperties;
        this._dashboardId = _dashboardId;
        this._positionNumber = _positionNumber;
        this._description = _description;
        this._id = _id;
        this.onBubble = new EventEmitter();
    }
    get componentName() {
        return this._componentName;
    }
    get columnSpan() {
        return this._columnSpan;
    }
    get rowSpan() {
        return this._rowSpan;
    }
    get widgetProperties() {
        return this._widgetProperties;
    }
    get dashboardId() {
        return this._dashboardId;
    }
    get positionNumber() {
        return this._positionNumber;
    }
    get description() {
        return this._description;
    }
    get id() {
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
__decorate([
    Output()
], WidgetBase.prototype, "onBubble", void 0);
//# sourceMappingURL=widget-base.js.map