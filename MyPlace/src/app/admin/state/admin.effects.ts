import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Observable, of, empty } from "rxjs";
import {
    map,
    tap,
    filter,
    switchMap,
    mergeMap,
    withLatestFrom,
    catchError
} from 'rxjs/operators';
import * as FileSaver from "file-saver";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AppState } from "../../state";
import { PopupService } from "../../shared/popup/popup.service";
import { AdminState } from "./admin.state";
import * as forRoot from "./admin.actions";
import { AdminService } from "./../admin.service";
import * as Constants from "../../shared/errorMessages";

@Injectable()
export class AdminEffects {

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private adminService: AdminService,
        private modalService: NgbModal,
        private popupService: PopupService) {
    }



    @Effect()
    onSelectCompanies = this.actions$.pipe(
        ofType(forRoot.SELECT_COMPANIES),
        switchMap(state =>
            this.adminService
                .getCompanies(1)
                .pipe(
                    map(c => new forRoot.SelectCompaniesCompleated(c)),
                    catchError(error => of<forRoot.AdminAction>(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null)))
                )
        )
    );

    @Effect()
    onSelectResourceGroups = this.actions$.pipe(
        ofType(forRoot.SELECT_RESORCE_GROUPS),
        switchMap(state =>
            this.adminService
                .getResouceGroups()
                .pipe(
                    map(rg => new forRoot.SelectResouceGroupsCompleated(rg)),
                    catchError(error => of<forRoot.AdminAction>(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null)))
                )
        )
    );

    @Effect()
    onSelectResourceProjects = this.actions$.pipe(
            ofType(forRoot.SELECT_RESORCE_PROJECTS),
            withLatestFrom(this.store.select(s => s.admin)),
            switchMap(([action, state]) =>
            this.adminService
                .getResouceProjects(state.resourceGroupId)
                .pipe(
                    map(rg => new forRoot.SelectResouceProjectsCompleated(rg)),
                    catchError(error => of<forRoot.AdminAction>(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null)))
                )
        )
    );

    private getFailedMessage(response: HttpErrorResponse): string {
        const body = response.error;
        const status = (body || {}).status;

        return Constants.errorMessages[status] || "";
    }
}
