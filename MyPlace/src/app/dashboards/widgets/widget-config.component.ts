import {
	Component, OnInit, AfterViewChecked, InjectionToken, Input, ViewChild,
	ViewChildren, QueryList, Output, EventEmitter, ElementRef
} from '@angular/core';
import { WidgetInjection } from '../model/widgetInjection';
import { WidgetComponentsService } from '../services/widgetComponents.service';
import { WidgetFactoryComponent } from "../widgets/widgetFactory.component";
import { MarkdownComponent } from '../widgets/markdown/markdown.component';
import { WelcomeComponent } from '../widgets/welcome/welcome.component';
import { BatteryChargeComponent } from '../widgets/batteryCharge/batteryCharge.component';
import { CalendarComponent } from '../widgets/calendar/calendar.component';
import { WidgetInfo, DashboardInfo, IWidgetCommand } from '../model/interfaces';
import { Store } from "@ngrx/store";
import { AppState } from "../../../app/state";
import { DashboardService } from "../services/dashboard.service";
import * as Utils from "../../shared/utils";
import { WidgetCommands } from '../model/constants';
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular';

@Component({
    selector: 'app-widgetConfig',
    templateUrl: './widget-config.component.html',
    styleUrls: ['./widget-config.component.css'],
    entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
})

export class WidgetConfigComponent implements OnInit, AfterViewChecked  {
    validate(arg0: any): any {
        throw new Error("Method not implemented.");
    }
    //  ==============================================================================
    //  declarations
    //  ==============================================================================
	@ViewChild("myContainer") myContainer: ElementRef;
	@ViewChild("myHeader") myHeader: ElementRef;
	@ViewChild("myForm") myForm: ElementRef;
	@ViewChild("myDescription") myDescription: ElementRef;
	@ViewChild("mySize") mySize: ElementRef;
	@ViewChild("myButtons") myButtons: ElementRef;
	@ViewChild(DxScrollViewComponent) scrollView: DxScrollViewComponent;
    form: FormGroup;  
    dashboard: DashboardInfo;
    widgetRanges: string[];
    widgetRange: string="1x1";
    widgetId: number;
    widget: WidgetInjection;
    widgetInfo: WidgetInfo;
    @Output() bubble = new EventEmitter<IWidgetCommand>();
    dashboardId: number;
    description: string;
    @ViewChild(WidgetFactoryComponent) widgetFactory: WidgetFactoryComponent;
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================

    constructor(
        private srv: WidgetComponentsService,
        private store: Store<AppState>,
        private dashSrv: DashboardService
     
    ) {
        this.init();
    }

    //  ==============================================================================
    //  ng
    //  ==============================================================================
    ngOnInit() {
        this.store.subscribe(s => {
            this.dashboardId = s.dashboardState.dashboard.id;
            this.widgetRange = `${s.dashboardState.widgetInfo.rowSpan}x${s.dashboardState.widgetInfo.columnSpan}`;
            //alert(`${this.widgetInfo.rowSpan}x${this.widgetInfo.columnSpan}`);
            this.widgetRanges = this.getRanges(s.dashboardState.dashboard.columnsCount);
            this.widgetInfo = s.dashboardState.widgetInfo;
            this.getWidgetConfig(this.widgetInfo.id);
            this.form = new FormGroup({              
                description: new FormControl(this.widgetInfo.description) 
            });              
        });
	}

	ngAfterViewChecked() {
		this.setHeight();
	}

    //  ==============================================================================
    //  events handlers
    //  ==============================================================================

    onRefresh() {

    }

    onRangeValueChanged(e) {
        let toArray: string[] = e.value.split("x");
        this.widgetInfo.rowSpan = Number(toArray[0]);
        this.widgetInfo.columnSpan = Number(toArray[1]);
        this.store.subscribe(s => {
            s.dashboardState.widgetInfo = this.widgetInfo;
            this.dashboardId = s.dashboardState.dashboardId;
            //alert("index:"+index);

            //this.dashSrv.saveWidget(this.widgetInfo, this.dashboardId).subscribe(s => {
            //    let command: IWidgetCommand = { commandName: WidgetCommands.refreshDashboardWidgets, componentName: "DashboardsComponent", param: null };
            //    this.bubble.emit(command);
            //});
            let command: IWidgetCommand = { commandName: WidgetCommands.rowColSpanChanges, componentName: "DashboardsComponent", param: null };
            this.bubble.emit(command);
        })
    }

    onBubble(e) {
        this.bubble.emit(e);
    }
    onSubmit(): void {    
        if (this.form.invalid)
            return;

        let result: WidgetInfo = this.form.value;
        this.widgetInfo.description = result.description;
        
        this.store.subscribe(s => {
            //this.widgetFactory.onRefresh();
            s.dashboardState.widgetInfo = this.widgetInfo;         
            this.dashSrv.saveWidget(this.widgetInfo).subscribe(s => {
                let command: IWidgetCommand = { commandName: WidgetCommands.refreshDashboardWidgets, componentName: "DashboardsComponent", param: null };
                this.bubble.emit(command);
                //this.onSave(null);
            });             
        });    
    }

    onSave(e) {
       let command: IWidgetCommand = { commandName: WidgetCommands.saveWidgets, componentName: "DashboardsComponent", param: null };
        this.bubble.emit(command);        
    }

    onClose(e) {
        let command: IWidgetCommand = { commandName: WidgetCommands.show, componentName: "DashboardsComponent", param: null };
        this.onBubble(command);
    }
    //  ==============================================================================
    //  private methods
    //  ==============================================================================
    private init() {
        //var domRect = document.getElementById('element').getBoundingClientRect();
        //var height = document.getElementById('element').style.height;
        //let h = (document.querySelector('#placeHolder'))[0].offsetHeight;
        //let w = (document.querySelector('#placeHolder'))[0].offsetWidth;
	}

	private setHeight() {
		if (this.myContainer) {
			var r = this.myContainer.nativeElement.getBoundingClientRect();
			var e: HTMLElement = document.documentElement
			var h: number = e.clientHeight - r.top - window.pageYOffset -
				this.calcFullHeight(this.myContainer, false, false, true, true) -
				this.calcFullHeight(this.myHeader, true, true, true, true) -
				this.calcFullHeight(this.myForm, false, true, true, true) -
				this.calcFullHeight(this.myDescription, true, true, true, true) -
				this.calcFullHeight(this.mySize, true, true, true, true) -
				this.calcFullHeight(this.myButtons, true, true, true, true);

			var newHeight: string = h.toString() + "px";

			var offset: number = this.calcFullWidth(this.myForm, false, false, true, false);
			var newWidth: number = this.myForm.nativeElement.offsetWidth - offset;

			if (this.scrollView.height != newHeight)
				this.scrollView.height = newHeight;

			//if (this.myButtons.nativeElement.offsetWidth != newWidth)
			//	this.myButtons.nativeElement.offsetWidth = newWidth;
		}
	}

	calcFullHeight(er: ElementRef, isHeight: boolean = true, isMargin: boolean = true, isPadding: boolean = true, isBorder: boolean = true): number {
		var result: number = 0;
		var style = getComputedStyle(er.nativeElement);
		if (isHeight) {
			result += er.nativeElement.offsetHeight;
		}
		if (isMargin) {
			result += parseInt(style.marginTop.replace("px", ""));
			result += parseInt(style.marginBottom.replace("px", ""));
		}
		if (isPadding) {
			result += parseInt(style.paddingTop.replace("px", ""));
			result += parseInt(style.paddingBottom.replace("px", ""));
		}
		if (isBorder) {
			result += parseInt(style.borderTopWidth.replace("px", ""));
			result += parseInt(style.borderBottomWidth.replace("px", ""));
		}
		return result;
	}

	calcFullWidth(er: ElementRef, isHeight: boolean = true, isMargin: boolean = true, isPadding: boolean = true, isBorder: boolean = true): number {
		var result: number = 0;
		var style = getComputedStyle(er.nativeElement);
		if (isHeight) {
			result += er.nativeElement.offsetWidth;
		}
		if (isMargin) {
			result += parseInt(style.marginLeft.replace("px", ""));
			result += parseInt(style.marginRight.replace("px", ""));
		}
		if (isPadding) {
			result += parseInt(style.paddingLeft.replace("px", ""));
			result += parseInt(style.paddingRight.replace("px", ""));
		}
		if (isBorder) {
			result += parseInt(style.borderLeftWidth.replace("px", ""));
			result += parseInt(style.borderRightWidth.replace("px", ""));
		}
		return result;
	}

    private getRanges(cols: number): string[] {
        let result: string[] = [];
        for (var i = 1; i <= cols; i++) {
            for (var j = 1; j <= cols; j++) {
                result.push(`${i}x${j}`);
            }
        }
        return result;
    }
    private getWidgetConfig(id: number) {
        this.dashSrv.getInjectionWidget(id,true).subscribe(r => this.widget = r);
    }
   
}
