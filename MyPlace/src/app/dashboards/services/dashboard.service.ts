import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { DashboardInfo, WidgetInfo, WidgetMenu, IDashboardDefault, Widgets } from "../model/interfaces";
import { WelcomeWidget } from "../model/interfaces";
import { WidgetInjection } from "../model/widgetInjection";
import {WidgetComponentsService } from "../services/widgetComponents.service";
@Injectable()
export class DashboardService {

    constructor(
        private http: HttpClient,
        private srv: WidgetComponentsService) { }

    public getDashboards(): Observable<DashboardInfo[]> {
        const url = `${environment.serverBaseUrl}api/dashboards`;     
        return  this.http.get<DashboardInfo[]>(url, { withCredentials: true });       
    }
    public deleteDashboard(dashboardId: number): Observable<any> {
        const url = `${environment.serverBaseUrl}api/dashboards/delete/${dashboardId}`;
        return this.http.get(url, { withCredentials: true });
    }
    public getWidgets(dashboardId: number): Observable<WidgetInfo[]> {
        const url = `${environment.serverBaseUrl}api/widgets/${dashboardId}`;
        return this.http.get<WidgetInfo[]>(url, { withCredentials: true });     
    }

    public saveWidget(widget: WidgetInfo): Observable<any> {       
        const url = `${environment.serverBaseUrl}api/widgets/update`;        
        return this.http.post<any>(url, widget, { withCredentials: true });      
    }
    public saveWidgets(widget: Widgets): Observable<any> {
        const url = `${environment.serverBaseUrl}api/widgets/updateAll`;      
        return this.http.post<any>(url, widget, { withCredentials: true });       
    }
    public saveDashboard(dashboard: DashboardInfo): Observable<number> {
        const url = `${environment.serverBaseUrl}api/dashboards/update`;    
        return this.http.post<any>(url, dashboard, { withCredentials: true });     
    }

    public deleteWidget(widgetId:number): Observable<any> {
        const url = `${environment.serverBaseUrl}api/widgets/delete/${widgetId}`;
        return this.http.get(url, { withCredentials: true });
    }
    public getWidget(widgetId: number): Observable<any> {
        const url = `${environment.serverBaseUrl}api/widget/${widgetId}`;
        return this.http.get<any>(url, { withCredentials: true });
    }
    public getInjectionWidgets(dashboardId: number,isConfig:boolean=false): Observable<WidgetInjection[]> {
        return new Observable(
            observer => {               
                let widgets: WidgetInjection[] = [];                
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
                })          
            }
        );
    }

    public getInjectionWidget(widgetId: number,isConfig:boolean=false): Observable<WidgetInjection> {
        let result: WidgetInjection;
        return new Observable(
            observer => {               
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
                })
            }
        );
    }

    public getWidgetMenu(): WidgetMenu[] {
        let result: WidgetMenu[] = [{
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
    public getDashboardDefaults(): Observable<IDashboardDefault>{
        let result: IDashboardDefault = {
            cols: 6,
            rowHeight: 400
        };
        return of(result);
    }    

}