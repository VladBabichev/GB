import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Device } from "../model/devices-params";
import { Channel } from "../model/devices-params";

@Injectable()
export class DevicesService {
    constructor(private http: HttpClient) {
    }

	getDevice(id:string, stamp: string): Observable<Device> {
		const url = `${environment.serverBaseUrl}api/devices/${id}?stamp=${stamp}`;
		return this.http.get<Device>(url, { withCredentials: true });
	}
	getDevices(stamp: string): Observable<Device[]> {
		const url = `${environment.serverBaseUrl}api/devices?stamp=${stamp}`;
        return this.http.get<Device[]>(url, { withCredentials: true });
	}
    // get all channels of the given device
	getChannels(deviceId: string, stamp: string): Observable<Channel[]> {
		const url = `${environment.serverBaseUrl}api/channel/${deviceId}?stamp=${stamp}`;
		return this.http.get<Channel[]>(url, { withCredentials: true });
    }
}
