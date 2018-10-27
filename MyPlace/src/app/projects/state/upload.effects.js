var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HttpEventType, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Effect, ofType } from "@ngrx/effects";
import { of, empty } from "rxjs";
import { map, tap, filter, switchMap, catchError } from 'rxjs/operators';
import * as forRoot from "./upload.actions";
import * as Utils from "../../shared/utils";
let UploadEffects = class UploadEffects {
    constructor(actions$, uploadService, router, popupService, store$) {
        this.actions$ = actions$;
        this.uploadService = uploadService;
        this.router = router;
        this.popupService = popupService;
        this.store$ = store$;
        this.onCheckProjectsUnique = this.actions$.pipe(ofType(forRoot.BEFORE_START_UPLOAD), switchMap((action) => this.uploadService.uniqueProjectsCheck(action.project)
            .pipe(map(response => {
            if (response.isAllUnique)
                return new forRoot.StartUpload(action.project);
            return new forRoot.ProjectOverwriteComfirmation(action.project);
        }))));
        this.onProjectOverwriteComfirmation = this.actions$.pipe(ofType(forRoot.UPLOAD_OVERWRITE_CONFIRMATION), switchMap((action) => {
            this.popupService.showConfirm("confirm-project-overwriting-title", "confirm-project-overwriting-message")
                .subscribe(result => {
                if (result === true)
                    this.store$.dispatch(new forRoot.StartUpload(action.project));
            });
            return empty();
        }));
        this.onStartUpload = this.actions$.pipe(ofType(forRoot.START_UPLOAD), switchMap((action) => this.uploadService.upload(action.project)
            .pipe(map((event) => {
            if (event.type === HttpEventType.UploadProgress) {
                const progress = event;
                const percentDone = Math.round(100 * progress.loaded / progress.total);
                return new forRoot.UploadProgress(percentDone);
            }
            else if (event instanceof HttpResponse) {
                if (event.ok)
                    Utils.successMessage(event.statusText);
                return new forRoot.UploadSucceeded();
            }
        }), filter(a => a !== undefined), catchError(error => {
            const message = this.getMessage(error);
            Utils.errorMessage(error.message);
            if (error instanceof HttpErrorResponse && error.status === 400) {
                return of(new forRoot.UploadFailed(message || "Bad request"));
            }
            else {
                return of(new forRoot.UploadFailed("Network error"));
            }
            ;
        }))));
        this.onUploadSucceeded = this.actions$.pipe(ofType(forRoot.UPLOAD_SUCCEEDED), tap(() => this.router.navigate(["/projects"])));
    }
    getMessage(error) {
        if (!error.error) {
            return null;
        }
        try {
            const response = JSON.parse(error.error);
            if (!response) {
                return null;
            }
            return response.message;
        }
        catch (e) {
            return null;
        }
    }
};
__decorate([
    Effect()
], UploadEffects.prototype, "onCheckProjectsUnique", void 0);
__decorate([
    Effect()
], UploadEffects.prototype, "onProjectOverwriteComfirmation", void 0);
__decorate([
    Effect()
], UploadEffects.prototype, "onStartUpload", void 0);
__decorate([
    Effect({ dispatch: false })
], UploadEffects.prototype, "onUploadSucceeded", void 0);
UploadEffects = __decorate([
    Injectable()
], UploadEffects);
export { UploadEffects };
//# sourceMappingURL=upload.effects.js.map