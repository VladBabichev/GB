import {
    Component, OnInit, InjectionToken, Input, ViewChild,
    ViewChildren, QueryList, Output, EventEmitter
} from '@angular/core';
import { WidgetInjection } from '../model/widgetInjection';
import { MarkdownComponent } from './markdown/markdown.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { BatteryChargeComponent } from './batteryCharge/batteryCharge.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
    selector: 'app-widgetView',
    templateUrl: './widget-view.component.html',
    styleUrls: ['./widget-view.component.css'],
    entryComponents: [MarkdownComponent, WelcomeComponent, BatteryChargeComponent, CalendarComponent]
})

export class WidgetViewComponent implements OnInit {
    //  ==============================================================================
    //  declarations
    //  ==============================================================================
    @ViewChild(DxPopupComponent) popup: DxPopupComponent;
    widgetId: number;  
    popupVisible: boolean = true;
    @Input() widget: WidgetInjection;   
    @Input() width: number = 300;
    @Input() height: number = 250;
    //  ==============================================================================
    //  the constructor
    //  ==============================================================================

    constructor(
    ) {
      
    }

    //  ==============================================================================
    //  ng
    //  ==============================================================================
    ngOnInit() {
        
    }
  
    //  ==============================================================================
    //  events handlers
    //  ==============================================================================
    onSubmit(): void {
       
    }

    onCancel(): void {
       
    }

    onRefresh() {
      
    }   

    popup_hiding(e) {
        this.popup.instance.content().remove();
    }
}
