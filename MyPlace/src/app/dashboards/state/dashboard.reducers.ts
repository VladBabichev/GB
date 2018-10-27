import * as forRoot from "./dashboard.actions";
import { DashboardState} from "./dashboard.state";

const initialState: DashboardState = {
    widgetInfo: {  columnSpan: 2, componentName: "welcome", description: "", dashboardId: 0,  positionNumber: 0, rowSpan: 1, widgetProperties: "" ,id:0},
    dashboardId: 0,
    dashboardMode: "show",
    dashboard: {columnsCount:6,description:"",id:0,name:"",rowHeight:400,isFavorite:false}

};

export function dashboardReducer(state: DashboardState = initialState, action: forRoot.DashboardAction): DashboardState {
    switch (action.type) {
       
        case forRoot.WIDGETINFO:
            return {
                ...state,
                widgetInfo:state.widgetInfo
            };
        case forRoot.DASHBOARDID:
            return {
                ...state,
                dashboardId: state.dashboardId
            };
        case forRoot.DASHBOARDMODE:
            return {
                ...state,
                dashboardMode: state.dashboardMode
            };
        case forRoot.DASHBOARD:
            return {
                ...state,
                dashboard: state.dashboard
            };
        default:
            return state;
    }
}
