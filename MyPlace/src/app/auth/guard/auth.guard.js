var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { map, take } from "rxjs/operators";
let AuthGuard = class AuthGuard {
    constructor(store, router, srv) {
        this.store = store;
        this.router = router;
        this.srv = srv;
        this.store.select(r => r.auth).subscribe(a => {
            this.state$ = a;
            if (a.isAdmin == undefined || a.isAdmin == null) {
                this.srv.getUser().subscribe(r => {
                    this.state$.isAdmin = r.isAdmin;
                    this.state$.isOwner = r.isOwner;
                    this.state$.isUndefined = (r.roleId == null || r.roleId == undefined);
                });
            }
        });
    }
    canActivate() {
        return this.store
            .select(s => s.auth.loggedIn)
            .pipe(take(1), map(val => {
            if (!val) {
                this.router.navigate(["/auth"]);
            }
            return true;
        }));
    }
};
AuthGuard = __decorate([
    Injectable()
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map