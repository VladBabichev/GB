var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Injector, Output, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import * as Utils from "../../shared/utils";
import { WidgetCommands } from "../model/constants";
let WidgetFactoryComponent = class WidgetFactoryComponent {
    //  ==================================================================
    //
    //  ==================================================================
    constructor(resolver, store, modalService, srv, dashSrv) {
        this.resolver = resolver;
        this.store = store;
        this.modalService = modalService;
        this.srv = srv;
        this.dashSrv = dashSrv;
        this.isMainMenuVisible = false;
        this.isMenuVisible = false;
        this.editWidget = new EventEmitter();
        this.bubble = new EventEmitter();
        this.mode = "show";
        this.widgetMenus = [];
        this.init();
    }
    set widget(data) {
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
        this.widgetComponent = component.instance;
        if (this.widgetComponent != null && this.widgetComponent != undefined) {
            this.widgetComponent.onBubble.subscribe(s => this.onBubble(s));
        }
        if (this.currentComponent) {
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
                promise.then((resp) => {
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
    onMouseOver(v, isDrag, dragStart) {
        this.currentWidgetId = v.input.id.value;
        if (isDrag) {
            //alert(dargStatrt.input.id.value + " " + this.currentWidgetId);
            let par = { widgetFromId: dragStart.input.id.value, widgetToId: this.currentWidgetId };
            let command = { commandName: WidgetCommands.refreshAfterDrag, componentName: "WidgetContainerComponent", param: par };
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
        let par = { clientHeight: null, clientWidth: null, widgetId: this.currentWidgetId };
        let command = { commandName: WidgetCommands.copyWidget, componentName: "DashboardsComponent", param: par };
        this.onBubble(command);
    }
    onDestroy() {
        this.container = null;
    }
    // ==============================================================================================
    // public methods
    // ==============================================================================================
    SaveWidget(e) {
        this.widgetComponent.SaveWidget(e);
    }
    onConfigureView(e) {
        let result = document.getElementsByClassName('mat-grid-tile');
        let index = this.widgets.findIndex(s => s.id == this.currentWidgetId);
        //console.log(document.getElementsByClassName('mat-grid-tile'));
        if (result != null && index >= 0) {
            let ee = result[index];
            console.log(result);
            //alert("index:"+index);
            let par = { clientHeight: ee.clientHeight, clientWidth: ee.clientWidth, widgetId: this.currentWidgetId };
            let command = { commandName: WidgetCommands.view, componentName: "DashboardsComponent", param: par };
            this.onBubble(command);
        }
    }
    onConfigure(e) {
        let result = document.getElementsByClassName('mat-grid-tile');
        this.dashSrv.getWidgets(this.dashboardId).subscribe(w => {
            let index = w.findIndex(s => s.id == this.currentWidgetId);
            if (result != null && index >= 0) {
                let ee = result[index];
                let par = { clientHeight: ee.clientHeight, clientWidth: ee.clientWidth, widgetId: this.currentWidgetId };
                let command = { commandName: WidgetCommands.config, componentName: "DashboardsComponent", param: par };
                this.onBubble(command);
            }
        });
    }
    onWidgetEdit() {
        this.editWidget.emit(this.selectedWidget);
    }
    onDelete() {
        var promise = new Promise((resolve, reject) => {
            this.dashSrv.deleteWidget(this.currentWidgetId)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((r) => {
            this.bubble.emit({ commandName: WidgetCommands.delete, componentName: "DashboardWidgetsComponent", param: r });
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    onRefresh() {
        this.init();
    }
    setMenuVisible(param) {
        this.isMainMenuVisible = param;
        if (!this.isMainMenuVisible)
            this.isMenuVisible = param;
    }
    onDashboardEdit() {
        this.init();
    }
    // ==============================================================================================
    // private methods
    // ==============================================================================================
    init() {
        this.store.subscribe(s => {
            this.mode = s.dashboardState.dashboardMode;
        });
    }
    configureWidget() {
        //const modalRef = this.modalService.open(WidgetDetailComponent, { windowClass: 'template-editor-modal' });
        //modalRef.componentInstance.widget = this.selectedWidget; 
        //modalRef.result.then((result: number) => {
        //    if (result == -1) {
        //    }
        //    else {
        //    }
        //}, err => { Utils.errorMessage(err) });
    }
};
__decorate([
    ViewChild('placeHolder', { read: ViewContainerRef })
], WidgetFactoryComponent.prototype, "container", void 0);
__decorate([
    Input()
], WidgetFactoryComponent.prototype, "componentId", void 0);
__decorate([
    Output()
], WidgetFactoryComponent.prototype, "editWidget", void 0);
__decorate([
    Output()
], WidgetFactoryComponent.prototype, "bubble", void 0);
__decorate([
    Input()
], WidgetFactoryComponent.prototype, "widget", null);
WidgetFactoryComponent = __decorate([
    Component({
        selector: 'app-widgetFactory',
        templateUrl: './widgetFactory.component.html',
        styleUrls: ['./widgetFactory.component.css']
    })
], WidgetFactoryComponent);
export { WidgetFactoryComponent };
//# sourceMappingURL=widgetFactory.component.js.map