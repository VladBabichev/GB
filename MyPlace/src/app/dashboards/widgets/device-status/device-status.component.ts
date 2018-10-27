import { Component, OnInit, Output, Injector} from "@angular/core";
import { EventEmitter } from "events";
import { DxTileViewModule, DxSelectBoxModule } from 'devextreme-angular';
import { WidgetBase } from "../widget-base";
import { WidgetInjection } from "../../model/widgetInjection";
import { Device, Channel } from "../../../devices/model/devices-params";
import { DevicesService } from "../../../devices/state/devices.service";
import * as Utils from "../../../shared/utils";

class DeviceStatusInfo {
	deviceId: string;
	sort: string[];
	display: string[];
	tooltip: string[];
	columnCount: number;
}

class DataItem {
	f0: Channel;
	f1: Channel;
	f2: Channel;
	f3: Channel;
	f4: Channel;
	f5: Channel;
	f6: Channel;
	f7: Channel;
	f8: Channel;
	f9: Channel;
}

@Component({
	templateUrl: "./device-status.component.html",
	styleUrls: ["./device-status.component.css"]
})
export class DeviceStatusComponent extends WidgetBase {
	deviceInfo: DeviceStatusInfo = { deviceId: "x", sort: [], display: [], tooltip: [], columnCount: 3 };
	device: Device;
	channels: Channel[];
	stamp = Utils.guid();
	dataItems: DataItem[];

	@Output() props: string = JSON.stringify(this.deviceInfo); 

    @Output() onBubleRefresh = new EventEmitter();

	constructor(private injector: Injector,
		private devicesService: DevicesService
    ) {
        super(injector.get(WidgetInjection.metadata.COMPONENTNAME),
            injector.get(WidgetInjection.metadata.COLUMNSPAN),
            injector.get(WidgetInjection.metadata.ROWSPAN),
            injector.get(WidgetInjection.metadata.WIDGETPROPERTIES),
            injector.get(WidgetInjection.metadata.DASHBOARDID),
            injector.get(WidgetInjection.metadata.POSITIONNUMBER),
            injector.get(WidgetInjection.metadata.DESCRIPTION),
            injector.get(WidgetInjection.metadata.ID)
        );
	}    

	ngOnInit() {
		this.refresh();
	}
	onCellPrepared(e): void {
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

	getHeight(e: any) {
		//for (var key in e) {
		//	alert(key);
		//}
		//var r: any = e.getBoundingClientRect();
		//return r.top - r.bottom;
		return e.clientHeight;
	}

	private refresh() {
		//alert(this.deviceInfo);
		var info: DeviceStatusInfo = JSON.parse(this.widgetProperties);
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

	private getData(): void {
		this.devicePromise()
			.then((d: Device) => {
				this.device = d;
				return this.device.deviceId;
			})
			.then((id: string) => {
				return this.channelsPromise(id);
			})
			.then((resp: Channel[]) => {
				this.channels = resp;
				return resp;
			})
			.then((resp: Channel[]) => {
				this.dataItems = this.getDataItems();
			})
			.catch(err => {
				Utils.errorMessage(err.message);
			});
	}

	private devicePromise() {
		return new Promise((resolve, reject) => {
			this.devicesService.getDevice(this.deviceInfo.deviceId, this.stamp).subscribe(resp => resolve(resp), error => reject(error));
		});
	}

	private channelsPromise(id: string) {
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

	private getDataItems(): DataItem[] {
		var result = new Array<DataItem>();

		var item: DataItem;

		var row;
		var column: number = 0;

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
}
