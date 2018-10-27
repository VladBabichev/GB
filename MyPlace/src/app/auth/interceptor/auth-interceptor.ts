import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AppState, Unauthorized } from "../../state";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private store: Store<AppState>) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(() => { },
                (err: any) => {
                    if (err instanceof HttpErrorResponse && err.status === 401) {
                        this.store.dispatch(new Unauthorized());
                    }
                })
            );
    }
}
