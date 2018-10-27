import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap,map,take } from "rxjs/operators";
import { AdminService } from "./../../admin/admin.service";
import { AppState, AuthState } from "../../state";

@Injectable()
export class AuthGuard implements CanActivate {
    state$: AuthState;
    constructor(private store: Store<AppState>, private router: Router, private srv: AdminService) {
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

    canActivate(): Observable<boolean> {
        return this.store
            .select(s => s.auth.loggedIn)
            .pipe(
                take(1),
                map(val => {
                    if (!val) {
                        this.router.navigate(["/auth"]);
                    }
                    
                    return true;
                })
            );
    }
}
