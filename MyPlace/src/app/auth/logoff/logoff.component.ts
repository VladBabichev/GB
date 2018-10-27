import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { AppState, Logoff, LogoffSucceeded } from "../../state";
import { AuthService, AuthResponse } from "../../auth/state/auth.service";
import { Router } from "@angular/router";
import * as Utils from "../../shared/utils";

@Component({
     templateUrl: "./logoff.component.html"
})
export class LogoffComponent implements OnInit {    

    constructor(private store: Store<AppState>, private srv: AuthService,private router: Router) {       
    }

    ngOnInit(): void {
        var promise = new Promise((resolve, reject) => {
            this.srv.logoff()
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp: AuthResponse) => {
            this.store.dispatch(new Logoff());          
            this.store.dispatch(new LogoffSucceeded());          
        });
        promise.then((resp: AuthResponse) => {
            this.router.navigate(["/auth"])
        });
        promise.catch(err => {        
            Utils.errorMessage(err.message);  
        });
    }  
}
