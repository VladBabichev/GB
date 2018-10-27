var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { WidgetInjection } from "../model/widgetInjection";
let DashboardService = class DashboardService {
    constructor(http, srv) {
        this.http = http;
        this.srv = srv;
    }
    getDashboards() {
        const url = `${environment.serverBaseUrl}api/dashboards`;
        return this.http.get(url, { withCredentials: true });
    }
    deleteDashboard(dashboardId) {
        const url = `${environment.serverBaseUrl}api/dashboards/delete/${dashboardId}`;
        return this.http.get(url, { withCredentials: true });
    }
    getWidgets(dashboardId) {
        const url = `${environment.serverBaseUrl}api/widgets/${dashboardId}`;
        return this.http.get(url, { withCredentials: true });
    }
    saveWidget(widget) {
        const url = `${environment.serverBaseUrl}api/widgets/update`;
        return this.http.post(url, widget, { withCredentials: true });
    }
    saveWidgets(widget) {
        const url = `${environment.serverBaseUrl}api/widgets/updateAll`;
        return this.http.post(url, widget, { withCredentials: true });
    }
    saveDashboard(dashboard) {
        const url = `${environment.serverBaseUrl}api/dashboards/update`;
        return this.http.post(url, dashboard, { withCredentials: true });
    }
    deleteWidget(widgetId) {
        const url = `${environment.serverBaseUrl}api/widgets/delete/${widgetId}`;
        return this.http.get(url, { withCredentials: true });
    }
    getWidget(widgetId) {
        const url = `${environment.serverBaseUrl}api/widget/${widgetId}`;
        return this.http.get(url, { withCredentials: true });
    }
    getInjectionWidgets(dashboardId, isConfig = false) {
        return new Observable(observer => {
            let widgets = [];
            this.getWidgets(dashboardId).subscribe(w => {
                widgets = w.map(info => new WidgetInjection({
                    componentName: {
                        key: WidgetInjection.metadata.COMPONENTNAME,
                        value: info.componentName
                    },
                    columnSpan: {
                        key: WidgetInjection.metadata.COLUMNSPAN,
                        value: info.columnSpan
                    },
                    dashboardId: {
                        key: WidgetInjection.metadata.DASHBOARDID,
                        value: info.dashboardId
                    },
                    description: {
                        key: WidgetInjection.metadata.DESCRIPTION,
                        value: info.description
                    },
                    positionNumber: {
                        key: WidgetInjection.metadata.POSITIONNUMBER,
                        value: info.positionNumber
                    },
                    widgetProperties: {
                        key: WidgetInjection.metadata.WIDGETPROPERTIES,
                        value: info.widgetProperties
                    },
                    rowSpan: {
                        key: WidgetInjection.metadata.ROWSPAN,
                        value: info.rowSpan
                    },
                    id: {
                        key: WidgetInjection.metadata.ID,
                        value: info.id
                    }
                }, this.srv.getComponentWithConfig(info.componentName, isConfig)));
                observer.next(widgets);
            });
        });
    }
    getInjectionWidget(widgetId, isConfig = false) {
        let result;
        return new Observable(observer => {
            this.getWidget(widgetId).subscribe(info => {
                result = new WidgetInjection({
                    componentName: {
                        key: WidgetInjection.metadata.COMPONENTNAME,
                        value: info.componentName
                    },
                    columnSpan: {
                        key: WidgetInjection.metadata.COLUMNSPAN,
                        value: info.columnSpan
                    },
                    dashboardId: {
                        key: WidgetInjection.metadata.DASHBOARDID,
                        value: info.dashboardId
                    },
                    description: {
                        key: WidgetInjection.metadata.DESCRIPTION,
                        value: info.description
                    },
                    positionNumber: {
                        key: WidgetInjection.metadata.POSITIONNUMBER,
                        value: info.positionNumber
                    },
                    widgetProperties: {
                        key: WidgetInjection.metadata.WIDGETPROPERTIES,
                        value: info.widgetProperties
                    },
                    rowSpan: {
                        key: WidgetInjection.metadata.ROWSPAN,
                        value: info.rowSpan
                    },
                    id: {
                        key: WidgetInjection.metadata.ID,
                        value: info.id
                    }
                }, this.srv.getComponentWithConfig(info.componentName, isConfig));
                observer.next(result);
            });
        });
    }
    getWidgetMenu() {
        let result = [{
                id: "1",
                name: "",
                items: [{
                        id: "1_1",
                        name: "Configure",
                        icon: "dx-icon-preferences"
                    },
                    {
                        id: "1_2",
                        name: "Copy to dashboard",
                        icon: "dx-icon-add"
                    },
                    {
                        id: "1_3",
                        name: "Delete",
                        icon: "dx-icon-remove"
                    }
                ]
            }];
        return result;
    }
    //======================================================================================================
    // DEFAULTS 
    //======================================================================================================
    getDashboardDefaults() {
        let result = {
            cols: 6,
            rowHeight: 400
        };
        return of(result);
    }
};
DashboardService = __decorate([
    Injectable()
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map