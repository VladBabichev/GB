import { InjectionToken } from '@angular/core';

export class WidgetInjection {
    static metadata: any = {
        COMPONENTNAME: new InjectionToken<string>('componentName'),
        COLUMNSPAN: new InjectionToken<number>('columnSpan'),
        ROWSPAN: new InjectionToken<number>('rowSpan'),
        WIDGETPROPERTIES: new InjectionToken<any>('widgetProperties'),
        DASHBOARDID: new InjectionToken<number>('dashboardId'),
        POSITIONNUMBER: new InjectionToken<number>('positionNumber'),
        DESCRIPTION: new InjectionToken<string>('description'),
        ID: new InjectionToken<number>('id')
    };

    constructor(private _input: {
        componentName: {
            key: InjectionToken<string>,
            value: string
        },
        columnSpan: {
            key: InjectionToken<number>,
            value: number
        },
        rowSpan: {
            key: InjectionToken<number>,
            value: number
        },
        widgetProperties: {
            key: InjectionToken<any>,
            value: any
        },
        dashboardId: {
            key: InjectionToken<number>,
            value: number
        },
        positionNumber: {
            key: InjectionToken<number>,
            value: number
        },
        description: {
            key: InjectionToken<string>,
            value: string
        },
        id: {
            key: InjectionToken<number>,
            value: number
        }
    }, private _component: any)
    {
    }

    get input(): {
        componentName: {
            key: InjectionToken<string>;
            value: string;
        };
        columnSpan: {
            key: InjectionToken<number>;
            value: number;
        };
        rowSpan: {
            key: InjectionToken<number>;
            value: number;
        };
        widgetProperties: {
            key: InjectionToken<any>;
            value: any;
        };
        dashboardId: {
            key: InjectionToken<number>;
            value: number
        };
        positionNumber: {
            key: InjectionToken<number>;
            value: number
        };
        description: {
            key: InjectionToken<string>;
            value: string
        };
        id: {
            key: InjectionToken<number>;
            value: number
        };
    }
    {
        return this._input;
    }


    get component(): any {
        return this._component;
    }
}
