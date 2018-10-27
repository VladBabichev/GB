import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { MarkdownComponent } from "../widgets/markdown/markdown.component";
import { WelcomeComponent } from "../widgets/welcome/welcome.component";
import { IWidgetComponent, IWidgetConfigComponent } from "../model/interfaces";
import { BatteryChargeComponent } from "../widgets/batteryCharge/batteryCharge.component";
import { CalendarComponent } from "../widgets/calendar/calendar.component";
import { ProjectsGridComponent } from "../widgets/projects-grid/projects-grid.component";
import { ProjectsWidgetComponent } from "../widgets/projects-grid/projects-widget.component";
import { DeviceStatusComponent } from "../widgets/device-status/device-status.component";
import { BatteryChargeConfigComponent } from "../widgets/batteryCharge/batteryChargeConfig.component";
//import { FlexLayoutModule, ObservableMedia, MediaChange} from '@angular/flex-layout';

export interface IResponsiveColumnsMap {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

@Injectable()
export class WidgetComponentsService {
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
	widgetComponents: IWidgetComponent[] = [
		{
			componentName: 'ProjectsWidgetComponent', component: ProjectsWidgetComponent, name: "Projects grid", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
			description: "The component provide quick access to the particulare projects."
		}
	];
    widgetConfigComponents: IWidgetConfigComponent[] = [
        { component: ProjectsWidgetComponent, componentName: "ProjectsWidgetComponent", name: "ProjectsWidgetComponent" }

    ];
	//widgetComponents: IWidgetComponent[] = [
	//	{
	//		componentName: 'ProjectsWidgetComponent', component: ProjectsWidgetComponent, name: "Projects grid", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects."
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent1', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent2', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent3', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent4', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent5', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent6', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent7', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent8', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent9', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent10', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent11', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent12', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent13', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent14', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent15', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent16', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent17', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent18', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	},
	//	{
	//		componentName: 'ProjectsWidgetComponent19', component: ProjectsWidgetComponent, name: "Projects grid 2", configComponentName: null, pictureFile: "assets/img/widgetProject.png",
	//		description: "The component provide quick access to the particulare projects. sfsf sagdgs fgdfsg sfdgdsfg adfgdafgdf afdgadgasg adgadgag asdgasdasdf asdgas adgasdgasd dfsdfsad asdfsaf adfghghjhgk fghkfky fghgfh "
	//	}
	//];
   // 
    private countBySize: IResponsiveColumnsMap = { xs: 2, sm: 2, md: 4, lg: 6, xl: 8 };

    constructor() {
        
    }
    //
    public getWidgetComponents(): Observable<IWidgetComponent[]> {
        return of(this.widgetComponents);
    }
    public getComponent(componentName: string): any {
        let result: any = null;
        let comp: any = this.widgetComponents.find(r => r.componentName == componentName);
        if (comp != null && comp != undefined)
            result = comp.component;  

        return result;
    }
    public getConfigComponent(componentName: string): any {
        if (this.widgetComponents.find(r => r.componentName == componentName).configComponentName != null) {
            componentName = this.widgetComponents.find(r => r.componentName == componentName).configComponentName;
            return this.widgetConfigComponents.find(r => r.componentName == componentName).component;
        }
        else
            return this.widgetComponents.find(r => r.componentName == componentName).component;
    }
    public getComponentWithConfig(componentName: string, isConfig: boolean = false): any {
        let result: any;
        if (isConfig)
            result = this.getConfigComponent(componentName);
        else
            result = this.getComponent(componentName);
        return result;
    }

    public getName(componentName: string): any {
        let result: string=null;
        let comp: IWidgetComponent = this.widgetComponents.find(r => r.componentName == componentName);
        if (comp != null && comp != undefined)
            result = comp.name;       
        return result;
    }
    public getDesc(componentName: string): any {
        let result: string = null;
        let comp: IWidgetComponent = this.widgetComponents.find(r => r.componentName == componentName);
        if (comp != null && comp != undefined)
            result = comp.description;
        return result;
    }
    //public getGridColumsCount(): Observable<number> {
    //    let result: number = 8;
    //    return new Observable(
    //        observer => {
    //            this.observableMedia.asObservable()
    //                .subscribe((changes: MediaChange) =>
    //                    result = this.countBySize[changes.mqAlias]
    //                );
    //        });
    //}
}

