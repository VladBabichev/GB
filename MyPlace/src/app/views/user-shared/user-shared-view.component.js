var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { SetUserSharedView } from "../../chart/state/chart.actions";
let UserSharedViewComponent = class UserSharedViewComponent {
    constructor(route, store) {
        this.route = route;
        this.store = store;
        this.route.params.subscribe(params => {
            var token = encodeURIComponent(params["token"]);
            this.store.dispatch(new SetUserSharedView(token));
        });
    }
};
UserSharedViewComponent = __decorate([
    Component({
        templateUrl: "./user-shared-view.component.html",
        styleUrls: ["./user-shared-view.component.css"]
    })
], UserSharedViewComponent);
export { UserSharedViewComponent };
//# sourceMappingURL=user-shared-view.component.js.map