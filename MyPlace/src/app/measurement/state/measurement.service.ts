import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { measurement } from "../model/measurement"
import { specification } from "../model/measurement";
import { measureResult } from "../model/measurement";

@Injectable()
export class MeasurementService {
    constructor(private http: HttpClient) {
    }
   
	public getMeasurements(projectId: number): Observable<specification[]> {
		const url = `${environment.serverBaseUrl}api/measurement?projectId=${projectId}`;
		return this.http.get<specification[]>(url, { withCredentials: true });
    }
    
    public getMeasurement(measurementId: number) : Observable<any>  {
        const url = `${environment.serverBaseUrl}api/measurements/${measurementId}`;
        return this.http.get<any>(url, { withCredentials: true });
    }
  
    // public save(result: measureResult): Observable<any> {
    //    const url = `${environment.serverBaseUrl}api/measurement`;
    //    return this.http.post<any>(url, result, { withCredentials: true });
    //}

    public saveMeasurement(result: measurement): Observable<any> {
        const url = `${environment.serverBaseUrl}api/measurements`;
        return this.http.post<any>(url, result, { withCredentials: true });
    }

	public deleteMeasurement(result: measurement): Observable<any> {
        const url = `${environment.serverBaseUrl}api/measurement/delete`;
		return this.http.post<any>(url, result, { withCredentials: true });
    }
}