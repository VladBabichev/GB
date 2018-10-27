var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import * as forRoot from "./admin.actions";
import * as Constants from "../../shared/errorMessages";
let AdminEffects = class AdminEffects {
    constructor(actions$, store, adminService, modalService, popupService) {
        this.actions$ = actions$;
        this.store = store;
        this.adminService = adminService;
        this.modalService = modalService;
        this.popupService = popupService;
        this.onSelectCompanies = this.actions$.pipe(ofType(forRoot.SELECT_COMPANIES), switchMap(state => this.adminService
            .getCompanies(1)
            .pipe(map(c => new forRoot.SelectCompaniesCompleated(c)), catchError(error => of(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null))))));
        this.onSelectResourceGroups = this.actions$.pipe(ofType(forRoot.SELECT_RESORCE_GROUPS), switchMap(state => this.adminService
            .getResouceGroups()
            .pipe(map(rg => new forRoot.SelectResouceGroupsCompleated(rg)), catchError(error => of(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null))))));
        this.onSelectResourceProjects = this.actions$.pipe(ofType(forRoot.SELECT_RESORCE_PROJECTS), withLatestFrom(this.store.select(s => s.admin)), switchMap(([action, state]) => this.adminService
            .getResouceProjects(state.resourceGroupId)
            .pipe(map(rg => new forRoot.SelectResouceProjectsCompleated(rg)), catchError(error => of(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null))))));
    }
    getFailedMessage(response) {
        const body = response.error;
        const status = (body || {}).status;
        return Constants.errorMessages[status] || "";
    }
};
__decorate([
    Effect()
], AdminEffects.prototype, "onSelectCompanies", void 0);
__decorate([
    Effect()
], AdminEffects.prototype, "onSelectResourceGroups", void 0);
__decorate([
    Effect()
], AdminEffects.prototype, "onSelectResourceProjects", void 0);
AdminEffects = __decorate([
    Injectable()
], AdminEffects);
export { AdminEffects };
//# sourceMappingURL=admin.effects.js.map