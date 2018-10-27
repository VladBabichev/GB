import { HttpEventType, HttpErrorResponse, HttpProgressEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import {
    map,
    tap,
    filter,
    switchMap,
    catchError
} from 'rxjs/operators';

import * as forRoot from "./upload.actions";
import { UploadService } from "./upload.service";
import { PopupService } from "../../shared/popup/popup.service";
import { AppState } from "../../state";
import * as Utils from "../../shared/utils";

@Injectable()
export class UploadEffects {

    constructor(
        private actions$: Actions,
        private uploadService: UploadService,
        private router: Router,
        private popupService: PopupService,
        private store$: Store<AppState>) {
    }

    @Effect()
    onCheckProjectsUnique = this.actions$.pipe(
        ofType(forRoot.BEFORE_START_UPLOAD),
        switchMap((action: forRoot.BeforeStartUpload) =>
            this.uploadService.uniqueProjectsCheck(action.project)
                .pipe(
                map(response => {     
                        if (response.isAllUnique)
                            return new forRoot.StartUpload(action.project);
                        return new forRoot.ProjectOverwriteComfirmation(action.project);
                    })
                )
        )
    );

    @Effect()
    onProjectOverwriteComfirmation = this.actions$.pipe(
        ofType(forRoot.UPLOAD_OVERWRITE_CONFIRMATION),
        switchMap((action: forRoot.ProjectOverwriteComfirmation) => {
            this.popupService.showConfirm("confirm-project-overwriting-title", "confirm-project-overwriting-message")
                .subscribe(result => {
                    if (result === true)
                        this.store$.dispatch(new forRoot.StartUpload(action.project));
                })

            return empty();
        })
    );

    @Effect()
    onStartUpload = this.actions$.pipe(
        ofType(forRoot.START_UPLOAD),
        switchMap((action: forRoot.StartUpload) =>
            this.uploadService.upload(action.project)
                .pipe(
                    map((event) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            const progress = event as HttpProgressEvent;
                            const percentDone = Math.round(100 * progress.loaded / progress.total);
                            return new forRoot.UploadProgress(percentDone);
                        } else if (event instanceof HttpResponse) {
                            if (event.ok)
                                Utils.successMessage(event.statusText);
                            return new forRoot.UploadSucceeded();
                        }
                    }
                    ),
                    filter(a => a !== undefined),
                    catchError(error => {
                        const message = this.getMessage(error);                       
                        Utils.errorMessage(error.message);
                        if (error instanceof HttpErrorResponse && error.status === 400) {
                            return of(new forRoot.UploadFailed(message || "Bad request"));
                        } else {
                            return of(new forRoot.UploadFailed("Network error"));
                        };
                    })
                )
        )
    );


    @Effect({ dispatch: false })
    onUploadSucceeded = this.actions$.pipe(
        ofType(forRoot.UPLOAD_SUCCEEDED),
        tap(() => this.router.navigate(["/projects"]))
    );

    private getMessage(error: HttpErrorResponse): string {
        if (!error.error) {
            return null;
        }

        try {
            const response = JSON.parse(error.error);
            if (!response) {
                return null;
            }

            return response.message;
        } catch (e) {
            return null;
        }
    }

}
