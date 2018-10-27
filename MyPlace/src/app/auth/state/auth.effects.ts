import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { 
    map, 
    tap,
    switchMap, 
    catchError 
} from 'rxjs/operators';

import * as forRoot from "./auth.actions";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthEffects {
    @Effect()
    onLogin = this.actions$.pipe(
        ofType(forRoot.LOGIN),
        switchMap((action: forRoot.Login) =>
            this.authService.login(action.username, action.password, action.rememberMe)
            .pipe(
                map(response => response.success
                ? new forRoot.LoginSucceeded(response.username, response.isAdmin, response.isOwner, response.isUndefined)
                    : new forRoot.LoginFailed(response.message || "Invalid username and/or password")
                ),
                catchError(error => of(new forRoot.LoginFailed("Network error")))
            )
        )
    );

    @Effect()
    onSignup = this.actions$.pipe(
        ofType(forRoot.SIGNUP),
        switchMap((action: forRoot.Signup) =>
            this.authService.signup(action.username, action.email, action.password)
            .pipe(
                map(response => response.success
                    ? new forRoot.SignupSucceeded()
                    : new forRoot.SignupFailed(response.message || "Unknown error")
                ),
                catchError(error => of(new forRoot.SignupFailed("Network error")))
            )
        )
    );

    @Effect({ dispatch: false })
    onLoginSucceeded = this.actions$.pipe(
        ofType(forRoot.LOGIN_SUCCEEDED),
        tap(() => this.router.navigate(["/projects"]))
    );

    @Effect({ dispatch: false })
    onSignupSucceeded = this.actions$.pipe(
        ofType(forRoot.SIGNUP_SUCCEEDED),
        tap(() => this.router.navigate(["/auth/signup-success"]))
    );

   // @Effect()
   // onLogoff = this.actions$.pipe(
   //     ofType(forRoot.LOGOFF),
   //     switchMap(() => 
   //         this.authService.logoff()
   //         .pipe(
   //             map(() => new forRoot.LogoffSucceeded()),
   //             catchError(error => of(new forRoot.LogoffFailed(error)))
   //         )
   //     )
   // );

    @Effect({ dispatch: false })
    onUnauthorized = this.actions$.pipe(
        ofType(forRoot.UNAUTHORIZED, forRoot.LOGOFF_SUCCEEDED, forRoot.LOGOFF_FAILED),
        tap(() => this.router.navigate(["/auth"]))
    );

    @Effect()
    onAcquirePasswordReset = this.actions$.pipe(
        ofType(forRoot.ACQUIRE_PASSWORD_RESET),
        switchMap((action: forRoot.AcquirePasswordReset) =>
            this.authService.acquirePasswordReset(action.username)
            .pipe(
                map(response => response.success
                    ? new forRoot.AcquirePasswordResetSucceeded()
                    : new forRoot.AcquirePasswordResetFailed(response.message || "Unknown error")
                ),
                catchError(error => of(new forRoot.AcquirePasswordResetFailed("Network error")))
            )
        )
    );

    @Effect({ dispatch: false })
    onAcquirePasswordResetSucceeded = this.actions$.pipe(
        ofType(forRoot.ACQUIRE_PASSWORD_RESET_SUCCEEDED),
        tap(() => this.router.navigate(["/auth/password-reset-acquired"]))
    );

    @Effect()
    onResetPassword = this.actions$.pipe(
        ofType(forRoot.RESET_PASSWORD),
        switchMap((action: forRoot.ResetPassword) =>
            this.authService.resetPassword(action.id, action.code, action.password)
            .pipe(
                map(response => response.success
                    ? new forRoot.ResetPasswordSucceeded()
                    : new forRoot.ResetPasswordFailed(response.message || "Unknown error")
                ),
                catchError(error => of(new forRoot.ResetPasswordFailed("Network error")))
            )
        )
    );

    @Effect({ dispatch: false })
    onResetPasswordSucceeded = this.actions$.pipe(
        ofType(forRoot.RESET_PASSWORD_SUCCEEDED),
        tap(() => this.router.navigate(["/auth/reset-password-success"]))
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService, 
        private router: Router) {
    }
}
