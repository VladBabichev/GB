import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, } from "@angular/core";
import { DevicesService } from "../devices/state/devices.service";
import { Device } from "./model/devices-params";
import { Channel } from "./model/devices-params";
import * as Utils from "../shared/utils";

import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';


    //  ==============================================================================
    //  interfaces
    //  ==============================================================================
interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number;
    selectedRowsData: Device;
}

    //  ==============================================================================
    //  component metadata
    //  ==============================================================================
@Component({
    templateUrl: "./devices.component.html",
    selector: "app-devices"
})

export class DevicesComponent {
    //  ==============================================================================
    //  declarations
    //  ==============================================================================
    dataSource: Device[];
    dataSource1: Channel[];
    currentDeviceId: string = "x";
    stamp = Utils.guid();
    indicatorVisible: boolean = false;

    //  ==============================================================================
    //  the constructor
    //  ==============================================================================
    constructor(private devicesService: DevicesService) {
    }

    //  ==============================================================================
    //  region of the event handlers
    //  ==============================================================================
    // 
    ngOnInit() {
        this.getDevices();
    }
    //
    onContentReady(e): void {
        if (this.dataSource.length > 0) {
            e.component.selectRowsByIndexes([0]);
        }
    }
    //
    onSelectionChanged(e: ISelectionChangedEvent): void {
        this.currentDeviceId = e.component.getSelectedRowsData()[0].deviceId;
        this.getChannels(this.currentDeviceId);
    }
    //
    onCellPrepared(e): void {
        if (e.data != undefined) {
            e.cellElement.css("background-color", e.data.backColor);
            e.cellElement.css("color", e.data.foreColor);
        }
    }
    //
    onRefresh(): void {
        this.stamp = Utils.guid();
        this.getDevices();
    }

    //  ==============================================================================
    //  region of the private methods 
    //  ==============================================================================
    //
	private getChannels(id: string): void {
		this.dataSource1 = null;
        var promise = new Promise((resolve, reject) => {
            this.devicesService.getChannels(id, this.stamp).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp: Channel[]) => {
            //this.indicatorVisible = false;          
            this.dataSource1 = resp;
        });
        promise.catch(err => {
            //this.indicatorVisible = false;
            Utils.errorMessage(err.message);
        });
    }
    //
    private getDevices(): void {
        this.indicatorVisible = true;
        var promise = new Promise((resolve, reject) => {
            this.devicesService.getDevices(this.stamp).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp: Device[]) => {
            this.indicatorVisible = false;
            this.dataSource = resp;
        });
        promise.catch(err => {
            this.indicatorVisible = false;
            Utils.errorMessage(err.message);
        });
    }
}