import { WidgetCommands, WidgetMode } from "./constants";

export interface WidgetInfo {
    id: number;
    dashboardId: number;
    positionNumber: number;
    componentName: string;
    rowSpan: number;
    columnSpan: number;
    widgetProperties: any; 
    description: string;    
}

export interface WelcomeWidget { 
    linkUrl: string;
    linkName: string;
}

export interface Markdown {
    text: string;
    linkUrl: string[];
    linkName: string[];
    images: any[];
}

export interface DashboardInfo {
    id: number;
    name: string;
    description: string;
    columnsCount: number; 
    rowHeight: number;
    isFavorite: boolean;
}
export interface DashboardInfoUI {
    group: string;
    id: number;
    name: string;   
}
export interface WidgetMenu {
    id: string;
    name: string;
    icon?: string;  
    disabled?: boolean;
    items?: WidgetMenu[];
}

export interface IWidgetComponent {
    componentName: string;
    component: any;
    name: string;
    configComponentName: string;
    pictureFile: string;
    description: string;
}
export interface IWidgetConfigComponent {
    componentName: string;
    component: any;
    name: string;
}
export interface Team {
    name: string;
    id: number;
}

export interface IDashboardDefault {
    cols: number;
    rowHeight: number;
}

export interface IWidget {
    raiseBubble(): void;
    refresh(): void;
}

export interface IWidgetCommand {
    componentName: string;
    commandName: WidgetCommands;   
    param: any;
}

export interface IWidgetViewParam {
    clientWidth: number;
    clientHeight: number;
    widgetId: number;
}

export interface IWidgetDragParam {
    widgetFromId: number;
    widgetToId: number;
}

export interface Widgets {
    dashboardId: number;
    widgetInfo: WidgetInfo[];
}
export interface IProjectsWidgetParam {
    widgeId: number;
    param: any;
}

