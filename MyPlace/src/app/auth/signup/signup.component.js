var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { createEqualsValidator } from "../shared/equals.validator";
import { passwordValidator } from "../shared/password.validator";
import { Signup } from "../../state";
let SignupComponent = class SignupComponent {
    constructor(store) {
        this.store = store;
        this.dead$ = new Subject();
        this.state$ = this.store.select(s => s.auth);
    }
    ngOnInit() {
        this.username = new FormControl(null, Validators.required);
        this.email = new FormControl(null, [Validators.required, Validators.email]);
        this.password = new FormControl(null, passwordValidator);
        this.password2 = new FormControl(null, createEqualsValidator(this.password, this.dead$));
        this.form = new FormGroup({
            username: this.username,
            email: this.email,
            password: this.password,
            password2: this.password2
        });
    }
    ngOnDestroy() {
        this.dead$.next();
        this.dead$.complete();
    }
    signup() {
        if (this.form.valid) {
            this.store.dispatch(new Signup(this.username.value, this.email.value, this.password.value));
        }
    }
    onCheck(value) {
        this.store.select(s => s.auth).subscribe(s => s.isAgree = value);
    }
};
SignupComponent = __decorate([
    Component({
        templateUrl: "./signup.component.html",
        styleUrls: ["./signup.component.css"]
    })
], SignupComponent);
export { SignupComponent };
//# sourceMappingURL=signup.component.js.map