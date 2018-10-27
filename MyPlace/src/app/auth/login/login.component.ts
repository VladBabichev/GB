import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { finalize } from 'rxjs/operators'

import { AppState, AuthState, Login, LoginSucceeded } from "../../state";
import { AuthService, AuthResponse } from "../../auth/state/auth.service";
//import notify from 'devextreme/ui/notify';
import * as Utils from "../../shared/utils";

@Component({
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    username: FormControl;
    password: FormControl;
    rememberMe: FormControl;   
    inProgress: boolean = false;

    constructor(private store: Store<AppState>, private srv: AuthService) {       
    }

    ngOnInit(): void {
        this.username = new FormControl(null, Validators.required);
        this.password = new FormControl(null);
        this.rememberMe = new FormControl(false);

        this.form = new FormGroup({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        });
    }

    login(): void {
        if (this.form.invalid) {
            return;
        }
        this.inProgress = true;

        this.srv.login(this.username.value, this.password.value, this.rememberMe.value)
            .pipe(finalize(() => this.inProgress = false))
            .subscribe(
                (response : AuthResponse) => this.store.dispatch(new LoginSucceeded(response.username, response.isAdmin, response.isOwner, response.isUndefined)), 
                error => Utils.errorMessage(error.error.message)
            );
    }
}
