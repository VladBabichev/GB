import { InjectionToken } from '@angular/core';
export class WidgetInjection {
    constructor(_input, _component) {
        this._input = _input;
        this._component = _component;
    }
    get input() {
        return this._input;
    }
    get component() {
        return this._component;
    }
}
WidgetInjection.metadata = {
    COMPONENTNAME: new InjectionToken('componentName'),
    COLUMNSPAN: new InjectionToken('columnSpan'),
    ROWSPAN: new InjectionToken('rowSpan'),
    WIDGETPROPERTIES: new InjectionToken('widgetProperties'),
    DASHBOARDID: new InjectionToken('dashboardId'),
    POSITIONNUMBER: new InjectionToken('positionNumber'),
    DESCRIPTION: new InjectionToken('description'),
    ID: new InjectionToken('id')
};
//# sourceMappingURL=widgetInjection.js.map