var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { createEqualsValidator } from "../shared/equals.validator";
import { passwordValidator } from "../shared/password.validator";
import { ResetPassword } from "../../state";
let ResetPasswordComponent = class ResetPasswordComponent {
    constructor(route, store) {
        this.route = route;
        this.store = store;
        this.dead$ = new Subject();
        this.state$ = this.store.select(s => s.auth);
    }
    ngOnInit() {
        this.password = new FormControl(null, passwordValidator);
        this.password2 = new FormControl(null, createEqualsValidator(this.password, this.dead$));
        this.form = new FormGroup({
            password: this.password,
            password2: this.password2
        });
    }
    ngOnDestroy() {
        this.dead$.next();
        this.dead$.complete();
    }
    submit() {
        if (this.form.valid) {
            const id = this.route.snapshot.queryParams["id"];
            const code = this.route.snapshot.queryParams["code"];
            this.store.dispatch(new ResetPassword(id, code, this.password.value));
        }
    }
};
ResetPasswordComponent = __decorate([
    Component({
        templateUrl: "./reset-password.component.html",
        styleUrls: ["./reset-password.component.css"]
    })
], ResetPasswordComponent);
export { ResetPasswordComponent };
//# sourceMappingURL=reset-password.component.js.map