import { Action } from "@ngrx/store";
import { WidgetInfo,DashboardInfo } from "../model/interfaces";

export const WIDGETINFO = "DASHBOARD: WIDGETINFO";
export const DASHBOARDID = "DASHBOARD: DASHBOARDID";
export const DASHBOARDMODE = "DASHBOARD: DASHBOARDMODE";
export const DASHBOARD = "DASHBOARD: DASHBOARD";

export class WidgetInfoAction implements Action {
    readonly type = WIDGETINFO;

    constructor(public widgetInfo: WidgetInfo) {
    }
}
export class DashBoardIdAction implements Action {
    readonly type = DASHBOARDID;

    constructor(public dashBoardId: number) {
    }
}
export class DashBoardMode implements Action {
    readonly type = DASHBOARDMODE;

    constructor(public dashBoardMode: string) {
    }
}
export class DashBoarAction implements Action {
    readonly type = DASHBOARD;

    constructor(public dashBoard: DashboardInfo) {
    }
}
export type DashboardAction
    = WidgetInfoAction |
    DashBoardIdAction |
    DashBoardMode | DashBoarAction


