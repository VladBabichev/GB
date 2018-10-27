import * as forRoot from "./dashboard.actions";
const initialState = {
    widgetInfo: { columnSpan: 2, componentName: "welcome", description: "", dashboardId: 0, positionNumber: 0, rowSpan: 1, widgetProperties: "", id: 0 },
    dashboardId: 0,
    dashboardMode: "show",
    dashboard: { columnsCount: 6, description: "", id: 0, name: "", rowHeight: 400, isFavorite: false }
};
export function dashboardReducer(state = initialState, action) {
    switch (action.type) {
        case forRoot.WIDGETINFO:
            return Object.assign({}, state, { widgetInfo: state.widgetInfo });
        case forRoot.DASHBOARDID:
            return Object.assign({}, state, { dashboardId: state.dashboardId });
        case forRoot.DASHBOARDMODE:
            return Object.assign({}, state, { dashboardMode: state.dashboardMode });
        case forRoot.DASHBOARD:
            return Object.assign({}, state, { dashboard: state.dashboard });
        default:
            return state;
    }
}
//# sourceMappingURL=dashboard.reducers.js.map