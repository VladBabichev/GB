import { WidgetInfo ,DashboardInfo} from "../model/interfaces";

export interface DashboardState {
    widgetInfo: WidgetInfo;
    dashboardId: number;
    dashboardMode: string;
    dashboard: DashboardInfo;
}
