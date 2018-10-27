var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { finalize } from 'rxjs/operators';
import { LoginSucceeded } from "../../state";
//import notify from 'devextreme/ui/notify';
import * as Utils from "../../shared/utils";
let LoginComponent = class LoginComponent {
    constructor(store, srv) {
        this.store = store;
        this.srv = srv;
        this.inProgress = false;
    }
    ngOnInit() {
        this.username = new FormControl(null, Validators.required);
        this.password = new FormControl(null);
        this.rememberMe = new FormControl(false);
        this.form = new FormGroup({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        });
    }
    login() {
        if (this.form.invalid) {
            return;
        }
        this.inProgress = true;
        this.srv.login(this.username.value, this.password.value, this.rememberMe.value)
            .pipe(finalize(() => this.inProgress = false))
            .subscribe((response) => this.store.dispatch(new LoginSucceeded(response.username, response.isAdmin, response.isOwner, response.isUndefined)), error => Utils.errorMessage(error.error.message));
    }
};
LoginComponent = __decorate([
    Component({
        templateUrl: "./login.component.html",
        styleUrls: ["./login.component.css"]
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map