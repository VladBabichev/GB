var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { ProjectsWidgetComponent } from "../widgets/projects-grid/projects-widget.component";
let WidgetComponentsService = class WidgetComponentsService {
    constructor() {
        //  widgetComponents: IWidgetComponent[] = [  
        //{
        //	componentName: 'ProjectsWidgetComponent', component: ProjectsWidgetComponent, name: "Projects grid", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
        //	description: "Projects grid widget. The component provide quick access to the particulare projects."
        //},
        //{
        //	componentName: 'DeviceStatusComponent', component: DeviceStatusComponent, name: "Device status", configComponentName: null, pictureFile: "assets/img/widget1.png",
        //	description: "Device status widget. The component allows operational monitoring of testing devices."
        //},
        //{ componentName: 'batteryCharge', component: BatteryChargeComponent, name: "Battery charge", configComponentName: null, pictureFile: "assets/img/batteryCharge.png", description: "Battery charge component" },
        //{ componentName: 'markdown', component: MarkdownComponent, name: "Markdown widget", configComponentName: null, pictureFile: "assets/img/markDown.png", description: "Mark down component" },
        //      { componentName: 'welcome', component: WelcomeComponent, name: "Welcome widget", configComponentName: null, pictureFile:"assets/img/widget1.png",description:"Welcome component "},
        //      { componentName: 'calendar', component: CalendarComponent, name: "Calendar widget", configComponentName: null, pictureFile: "assets/img/widgetCalendar.png", description: "Calendar component"}
        //  ];
        //  widgetConfigComponents: IWidgetConfigComponent[] = [
        //      { component: BatteryChargeConfigComponent, componentName: "batteryChargeConfig", name: "BatteryChargeConfigComponent" }
        //  ];
        this.widgetComponents = [
            {
                componentName: 'ProjectsWidgetComponent', component: ProjectsWidgetComponent, name: "Projects grid", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
                description: "Projects grid widget. The component provide quick access to the particulare projects."
            }
        ];
        this.widgetConfigComponents = [
            { component: ProjectsWidgetComponent, componentName: "ProjectsWidgetComponent", name: "ProjectsWidgetComponent" }
        ];
        // 
        this.countBySize = { xs: 2, sm: 2, md: 4, lg: 6, xl: 8 };
    }
    //
    getWidgetComponents() {
        return of(this.widgetComponents);
    }
    getComponent(componentName) {
        let result = null;
        let comp = this.widgetComponents.find(r => r.componentName == componentName);
        if (comp != null && comp != undefined)
            result = comp.component;
        return result;
    }
    getConfigComponent(componentName) {
        if (this.widgetComponents.find(r => r.componentName == componentName).configComponentName != null) {
            componentName = this.widgetComponents.find(r => r.componentName == componentName).configComponentName;
            return this.widgetConfigComponents.find(r => r.componentName == componentName).component;
        }
        else
            return this.widgetComponents.find(r => r.componentName == componentName).component;
    }
    getComponentWithConfig(componentName, isConfig = false) {
        let result;
        if (isConfig)
            result = this.getConfigComponent(componentName);
        else
            result = this.getComponent(componentName);
        return result;
    }
    getName(componentName) {
        let result = null;
        let comp = this.widgetComponents.find(r => r.componentName == componentName);
        if (comp != null && comp != undefined)
            result = comp.name;
        return result;
    }
    getDesc(componentName) {
        let result = null;
        let comp = this.widgetComponents.find(r => r.componentName == componentName);
        if (comp != null && comp != undefined)
            result = comp.description;
        return result;
    }
};
WidgetComponentsService = __decorate([
    Injectable()
], WidgetComponentsService);
export { WidgetComponentsService };
//# sourceMappingURL=widgetComponents.service.js.map