var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Unauthorized } from "../../state";
let AuthInterceptor = class AuthInterceptor {
    constructor(store) {
        this.store = store;
    }
    intercept(request, next) {
        return next.handle(request).pipe(tap(() => { }, (err) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                this.store.dispatch(new Unauthorized());
            }
        }));
    }
};
AuthInterceptor = __decorate([
    Injectable()
], AuthInterceptor);
export { AuthInterceptor };
//# sourceMappingURL=auth-interceptor.js.map