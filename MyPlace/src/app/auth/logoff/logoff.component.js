var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { Logoff, LogoffSucceeded } from "../../state";
import * as Utils from "../../shared/utils";
let LogoffComponent = class LogoffComponent {
    constructor(store, srv, router) {
        this.store = store;
        this.srv = srv;
        this.router = router;
    }
    ngOnInit() {
        var promise = new Promise((resolve, reject) => {
            this.srv.logoff()
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp) => {
            this.store.dispatch(new Logoff());
            this.store.dispatch(new LogoffSucceeded());
        });
        promise.then((resp) => {
            this.router.navigate(["/auth"]);
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
};
LogoffComponent = __decorate([
    Component({
        templateUrl: "./logoff.component.html"
    })
], LogoffComponent);
export { LogoffComponent };
//# sourceMappingURL=logoff.component.js.map