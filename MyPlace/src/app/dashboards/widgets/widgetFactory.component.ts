import { Component, ComponentFactoryResolver, Injector, Output, EventEmitter, Input, OnInit, ViewChild, ViewContainerRef, ViewChildren, InjectionToken, ComponentFactory, ComponentRef} from '@angular/core';
import { WidgetInjection } from '../model/widgetInjection';
import { Store } from '@ngrx/store';
import { AppState } from '../../state';
import { DashboardService } from "../services/dashboard.service";
import * as Utils from "../../shared/utils";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { WelcomeComponent } from "../widgets/welcome/welcome.component";
import { IWidget, WidgetInfo, IWidgetCommand, IWidgetViewParam,IWidgetDragParam, WidgetMenu } from "../model/interfaces";
import { WidgetBase } from './widget-base';
import { WidgetCommands, WidgetMode } from "../model/constants";
import { MatMenu, MatMenuModule, MatMenuItem, MatMenuTrigger,  } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { WidgetComponentsService} from "../services/widgetComponents.service";
import { DxScrollViewModule, DxScrollViewComponent} from 'devextreme-angular';

@Component({
    selector: 'app-widgetFactory',
    templateUrl: './widgetFactory.component.html',
    styleUrls: ['./widgetFactory.component.css']
})
export class WidgetFactoryComponent implements OnInit {
    //  ==================================================================
    //  declarations
    //  ==================================================================
    @ViewChild('placeHolder', { read: ViewContainerRef }) container;
  
    selectedWidget: WidgetInjection;
    isMainMenuVisible: boolean = false;
    isMenuVisible: boolean = false;
    @Input() componentId: {
        key: InjectionToken<string>,
        value: number
    };

    @Output() editWidget = new EventEmitter<WidgetInjection>();
    @Output() bubble = new EventEmitter<IWidgetCommand>();
    mode: string = "show";
    currentWidgetId: number;
    widgetComponent: WidgetBase;
    widgetCommand: IWidgetCommand;
    dashboardId: number;
    widgets: WidgetInfo[];
    header: string;
    widgetMenus: WidgetMenu[] = [];
    id: number;
    currentComponent: any;
    //  ==================================================================
    //
    //  ==================================================================
    constructor(private resolver: ComponentFactoryResolver,
        private store: Store<AppState>,
        private modalService: NgbModal,
        private srv: WidgetComponentsService,
        private dashSrv: DashboardService) {
        this.init();
    }
  
    @Input() set widget(data: WidgetInjection) {
        if (!data) {
            return;
        }
        this.selectedWidget = data;
        const inputProviders = Object.keys(data.input).map((inputName) => {
            return { provide: data.input[inputName].key, useValue: data.input[inputName].value, deps: [] };
        });
        const injector = Injector.create(inputProviders, this.container.parentInjector);
        const factory = this.resolver.resolveComponentFactory(data.component);       
        const component = factory.create(injector);  
      
        this.container.insert(component.hostView);   
        //component.instance.
        this.widgetComponent = <WidgetBase>component.instance;
        if (this.widgetComponent != null && this.widgetComponent != undefined) {
            this.widgetComponent.onBubble.subscribe(s => this.onBubble(s));                
        }   
        if(this.currentComponent) {
            this.currentComponent.destroy();
        }
        this.currentComponent = component;
    }

    ngOnInit() {
        this.store.subscribe(s => {         
            this.dashboardId = s.dashboardState.dashboardId;
            if (this.widgetComponent != null && this.widgetComponent != undefined) {
                this.id = this.widgetComponent.id;
            }
            else {
                this.id = s.dashboardState.widgetInfo.id;
            }
            if (this.id > 0) {
                var promise = new Promise((resolve, reject) => {
                    this.dashSrv.getWidget(this.id).subscribe(resp => resolve(resp), error => reject(error));
                });
                promise.then((resp: WidgetInfo) => {
                    //this.widgets = resp;
                    this.header = resp.description;
                    //this.srv.getDesc(this.widgetComponent.componentName);
                });
                promise.catch(err => {
                    Utils.errorMessage(err.message);
                });
            }                        
        }).unsubscribe();
        this.widgetMenus = this.dashSrv.getWidgetMenu();
    }
    ngAfterViewInit() {
        // print array of CustomComponent objects
        //console.log(this.components.first);
        //this.components.map(c => alert(c.componentId));
        //alert(this.components);
        
    }
    //  ==================================================================
    //  events handlers
    //  ==================================================================
    itemClick(data) {
        let item = data.itemData;  
        if (item.id == "1") {
            this.isMenuVisible = true;
        }
        else if (item.id == "1_1") {
            this.onConfigure(item.id);
            this.isMenuVisible = false;
        }
        else if (item.id == "1_2") {
            this.onCopy(item.id);
            this.isMenuVisible = false;
        }
        else if (item.id == "1_3") {
            this.onDelete();  
            this.isMenuVisible = false;
        }
    }

    onMenuConfig() {
        this.isMenuVisible = !this.isMenuVisible;
    }

    public onMouseOver(v: any, isDrag: boolean, dragStart: any) { 
      
        this.currentWidgetId = v.input.id.value;
        if (isDrag) {
            //alert(dargStatrt.input.id.value + " " + this.currentWidgetId);
            let par: IWidgetDragParam = { widgetFromId: dragStart.input.id.value, widgetToId: this.currentWidgetId };
            let command: IWidgetCommand = { commandName: WidgetCommands.refreshAfterDrag, componentName: "WidgetContainerComponent", param: par };
            this.onBubble(command);          
        }

        if (!this.isMainMenuVisible)
            this.isMainMenuVisible = true;
    }

    onMouseLeave(event, v) {  
        //this.currentWidgetId = null;
        //this.isMainMenuVisible = false;
        if (!this.isMenuVisible)
            this.isMainMenuVisible = false;
    }

    onBubble(e) {       
        this.bubble.emit(e);
    }
    onCopy(e) {
        let par: IWidgetViewParam = { clientHeight: null, clientWidth: null, widgetId: this.currentWidgetId };
        let command: IWidgetCommand = { commandName: WidgetCommands.copyWidget, componentName: "DashboardsComponent", param: par };
        this.onBubble(command);  
    }
    onDestroy() {
        this.container = null;
    }
    // ==============================================================================================
    // public methods
    // ==============================================================================================
    public SaveWidget(e) {
        this.widgetComponent.SaveWidget(e);
    }

    public onConfigureView(e) {  
        let result = document.getElementsByClassName('mat-grid-tile');
       
        let index: number = this.widgets.findIndex(s => s.id == this.currentWidgetId);
        //console.log(document.getElementsByClassName('mat-grid-tile'));
        if (result != null && index >= 0) {  
            let ee = result[index];        
            console.log(result);
            //alert("index:"+index);
            let par: IWidgetViewParam = { clientHeight: ee.clientHeight, clientWidth: ee.clientWidth, widgetId: this.currentWidgetId };
            let command: IWidgetCommand = { commandName: WidgetCommands.view, componentName: "DashboardsComponent", param:par };
           this.onBubble(command);          
        }    
    }

    public onConfigure(e) {    
        let result = document.getElementsByClassName('mat-grid-tile');
        this.dashSrv.getWidgets(this.dashboardId).subscribe(w => {
            let index: number = w.findIndex(s => s.id == this.currentWidgetId);
            if (result != null && index >= 0) {
                let ee = result[index];
                let par: IWidgetViewParam = { clientHeight: ee.clientHeight, clientWidth: ee.clientWidth, widgetId: this.currentWidgetId };
                let command: IWidgetCommand = { commandName: WidgetCommands.config, componentName: "DashboardsComponent", param: par };
                this.onBubble(command);
            }  
        })        
    }

    public onWidgetEdit() {
        this.editWidget.emit(this.selectedWidget);
    }

    public onDelete() {        
        var promise = new Promise((resolve, reject) => {
            this.dashSrv.deleteWidget(this.currentWidgetId)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((r: number) => {
            this.bubble.emit({ commandName: WidgetCommands.delete,componentName:"DashboardWidgetsComponent",param:r});
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);           
        });
    }

    public onRefresh() {
        this.init();
    }

    public setMenuVisible(param:boolean) {
        this.isMainMenuVisible = param;
        if (!this.isMainMenuVisible)
            this.isMenuVisible = param;
    }
    public onDashboardEdit() {
        this.init();
    }
    
    // ==============================================================================================
    // private methods
    // ==============================================================================================
    private init() {
        this.store.subscribe(s => { 
            this.mode = s.dashboardState.dashboardMode;  
        })
    }

    private configureWidget() {
        //const modalRef = this.modalService.open(WidgetDetailComponent, { windowClass: 'template-editor-modal' });
        //modalRef.componentInstance.widget = this.selectedWidget; 
        //modalRef.result.then((result: number) => {
        //    if (result == -1) {
                
        //    }
        //    else {
                
        //    }
        //}, err => { Utils.errorMessage(err) });
    }
  
}
