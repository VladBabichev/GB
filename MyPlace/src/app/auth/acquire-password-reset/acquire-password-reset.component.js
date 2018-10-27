var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AcquirePasswordReset } from "../../state";
let AcquirePasswordResetComponent = class AcquirePasswordResetComponent {
    constructor(store, route, router) {
        this.store = store;
        this.route = route;
        this.router = router;
        this.state$ = this.store.select(s => s.auth);
    }
    ngOnInit() {
        this.username = new FormControl(null, Validators.required);
        this.form = new FormGroup({
            username: this.username
        });
    }
    onCancel() {
        this.router.navigate(['../login'], { relativeTo: this.route });
    }
    onSubmit() {
        if (this.form.valid) {
            this.store.dispatch(new AcquirePasswordReset(this.form.value.username));
        }
    }
};
AcquirePasswordResetComponent = __decorate([
    Component({
        templateUrl: "./acquire-password-reset.component.html",
        styleUrls: ["./acquire-password-reset.component.css"]
    })
], AcquirePasswordResetComponent);
export { AcquirePasswordResetComponent };
//# sourceMappingURL=acquire-password-reset.component.js.map