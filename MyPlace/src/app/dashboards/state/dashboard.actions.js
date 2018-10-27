export const WIDGETINFO = "DASHBOARD: WIDGETINFO";
export const DASHBOARDID = "DASHBOARD: DASHBOARDID";
export const DASHBOARDMODE = "DASHBOARD: DASHBOARDMODE";
export const DASHBOARD = "DASHBOARD: DASHBOARD";
export class WidgetInfoAction {
    constructor(widgetInfo) {
        this.widgetInfo = widgetInfo;
        this.type = WIDGETINFO;
    }
}
export class DashBoardIdAction {
    constructor(dashBoardId) {
        this.dashBoardId = dashBoardId;
        this.type = DASHBOARDID;
    }
}
export class DashBoardMode {
    constructor(dashBoardMode) {
        this.dashBoardMode = dashBoardMode;
        this.type = DASHBOARDMODE;
    }
}
export class DashBoar {
    constructor(dashBoard) {
        this.dashBoard = dashBoard;
        this.type = DASHBOARD;
    }
}
//# sourceMappingURL=dashboard.actions.js.map