import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { specificationsResult } from "../../specifications/model/interfaces";
import { specification } from "../../specifications/model/interfaces";
@Injectable()
export class SpecificationService {
    
    constructor(
        private http: HttpClient) {}
    
    public getBatterySpecifications(): Observable<any[]> {
        const url = `${environment.serverBaseUrl}api/specifications`;
        return this.http.get<any[]>(url, { withCredentials: true });
    }    

    public getBatterySpecification(specificationId: number) : Observable<any>  {
        const url = `${environment.serverBaseUrl}api/specifications/${specificationId}`;
        return this.http.get<any>(url, { withCredentials: true });
    }

    public saveBatterySpecification(specification: any) : Observable<any>  {
        const url = `${environment.serverBaseUrl}api/specifications`;
        return this.http.post<any>(url, specification, { withCredentials: true });
    }

    public updateBatterySpecification(id: number, specification: any): Observable<any> {
        const url = `${environment.serverBaseUrl}api/specifications`;       
        const body = new HttpParams()
        .set(`key`, "" + id)
        .set(`values`, JSON.stringify(specification));
  
        return this.http.put<any>(url, body.toString(), { 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true 
        });
    } 

    public deleteBatterySpecification(specificationId: number) : Observable<any>  {
        const url = `${environment.serverBaseUrl}api/specifications/${specificationId}`;
        return this.http.delete(url, { withCredentials: true });
    }

    public findBatterySpecification(name: string): Observable<any> {
        let url = `${environment.serverBaseUrl}api/specifications?`;
        if (name) {
            url += `filter=${encodeURIComponent(`['name', 'contains', '${name}']`)}`;
        }

        return this.http.get<any[]>(url, { withCredentials: true });
    }

    public getSpecifications(): Observable<specification[]> {     
		const url = `${environment.serverBaseUrl}api/specifications/list`;
        return this.http.get<specification[]>(url, { withCredentials: true });
    }   
}