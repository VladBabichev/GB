import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { StitchProjectsParams } from "../model/stitch-projects-params";

@Injectable()
export class StitcherService {
    constructor(private http: HttpClient) {
    }

    stitch(params: StitchProjectsParams): Observable<any> {
        const url = environment.serverBaseUrl + "api/projects/stitch";
        return this.http.post(url, params, { withCredentials: true});
    }
}
