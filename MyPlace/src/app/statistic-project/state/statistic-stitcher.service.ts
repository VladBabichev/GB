import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { StatisticProjectParams } from "../model/statistic-project-params";

@Injectable()
export class StatisticStitcherService {
    constructor(private http: HttpClient) {
    }

    stitch(params: StatisticProjectParams): Observable<any> {
        const url = environment.serverBaseUrl + "api/projects/average";
        return this.http.post(url, params, { withCredentials: true });
    }
}
