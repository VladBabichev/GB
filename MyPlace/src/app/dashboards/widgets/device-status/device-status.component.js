var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Output } from "@angular/core";
import { EventEmitter } from "events";
import { WidgetBase } from "../widget-base";
import { WidgetInjection } from "../../model/widgetInjection";
import * as Utils from "../../../shared/utils";
class DeviceStatusInfo {
}
class DataItem {
}
let DeviceStatusComponent = class DeviceStatusComponent extends WidgetBase {
    constructor(injector, devicesService) {
        super(injector.get(WidgetInjection.metadata.COMPONENTNAME), injector.get(WidgetInjection.metadata.COLUMNSPAN), injector.get(WidgetInjection.metadata.ROWSPAN), injector.get(WidgetInjection.metadata.WIDGETPROPERTIES), injector.get(WidgetInjection.metadata.DASHBOARDID), injector.get(WidgetInjection.metadata.POSITIONNUMBER), injector.get(WidgetInjection.metadata.DESCRIPTION), injector.get(WidgetInjection.metadata.ID));
        this.injector = injector;
        this.devicesService = devicesService;
        this.deviceInfo = { deviceId: "x", sort: [], display: [], tooltip: [], columnCount: 3 };
        this.stamp = Utils.guid();
        this.props = JSON.stringify(this.deviceInfo);
        this.onBubleRefresh = new EventEmitter();
    }
    ngOnInit() {
        this.refresh();
    }
    onCellPrepared(e) {
        if (e.data != undefined) {
            //e.cellElement.css("background-color", e.value.backColor);
            e.cellElement.children(0).css("background-color", e.value.backColor);
            //for (var key in e.cellElement.children) {
            //	alert(key); 
            //}
            //alert(e.cellElement.children(0)); 
            //e.cellElement.css("color", e.data.foreColor);
        }
    }
    getHeight(e) {
        //for (var key in e) {
        //	alert(key);
        //}
        //var r: any = e.getBoundingClientRect();
        //return r.top - r.bottom;
        return e.clientHeight;
    }
    refresh() {
        //alert(this.deviceInfo);
        var info = JSON.parse(this.widgetProperties);
        if (info != null) {
            this.deviceInfo = info;
        }
        var r = JSON.stringify(this.deviceInfo);
        //alert(r);
        this.getData();
    }
    //private getChannels(id: string): void {
    //	var promise = new Promise((resolve, reject) => {
    //		this.devicesService.getChannels(id, this.stamp).subscribe(resp => resolve(resp), error => reject(error));
    //	});
    //	promise.then((resp: Channel[]) => {
    //		this.channels = resp;
    //	});
    //	promise.catch(err => {
    //		Utils.errorMessage(err.message);
    //	});
    //}
    //private getDevice(): void {
    //	var promise = new Promise((resolve, reject) => {
    //		this.devicesService.getDevice(this.deviceInfo.deviceId, this.stamp).subscribe(resp => resolve(resp), error => reject(error));
    //	});
    //	promise.then((resp: Device) => {
    //		this.device = resp;
    //	});
    //	promise.catch(err => {
    //		Utils.errorMessage(err.message);
    //	});
    //}
    getData() {
        this.devicePromise()
            .then((d) => {
            this.device = d;
            return this.device.deviceId;
        })
            .then((id) => {
            return this.channelsPromise(id);
        })
            .then((resp) => {
            this.channels = resp;
            return resp;
        })
            .then((resp) => {
            this.dataItems = this.getDataItems();
        })
            .catch(err => {
            Utils.errorMessage(err.message);
        });
    }
    devicePromise() {
        return new Promise((resolve, reject) => {
            this.devicesService.getDevice(this.deviceInfo.deviceId, this.stamp).subscribe(resp => resolve(resp), error => reject(error));
        });
    }
    channelsPromise(id) {
        return new Promise((resolve, reject) => {
            this.devicesService.getChannels(id, this.stamp).subscribe(resp => resolve(resp), error => reject(error));
        });
    }
    //private defaultDevice(): Device {
    //	return {
    //		DeviceId: "x",
    //		Id: "x",
    //		Description: "Select device",
    //		Type: "",
    //		ChannelCount: 0,
    //		IpAddress: "",
    //		Port: 0,
    //		createdAt: Date.now.toString(),
    //		updatedAt: Date.now.toString(),
    //		Comments: ""
    //	}
    //}
    getDataItems() {
        var result = new Array();
        var item;
        var row;
        var column = 0;
        for (row = 0; row < this.channels.length; row++) {
            if (column == 0) {
                item = new DataItem();
            }
            item["f" + column.toString()] = this.channels[row];
            if (column == this.deviceInfo.columnCount - 1 || row == this.channels.length - 1) {
                result.push(item);
                column = 0;
            }
            else {
                column++;
            }
        }
        return result;
    }
};
__decorate([
    Output()
], DeviceStatusComponent.prototype, "props", void 0);
__decorate([
    Output()
], DeviceStatusComponent.prototype, "onBubleRefresh", void 0);
DeviceStatusComponent = __decorate([
    Component({
        templateUrl: "./device-status.component.html",
        styleUrls: ["./device-status.component.css"]
    })
], DeviceStatusComponent);
export { DeviceStatusComponent };
//# sourceMappingURL=device-status.component.js.map