var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, switchMap, catchError } from 'rxjs/operators';
import * as forRoot from "./view.actions";
import * as Utils from "../../shared/utils";
let ViewEffects = class ViewEffects {
    constructor(actions$, store, viewService) {
        this.actions$ = actions$;
        this.store = store;
        this.viewService = viewService;
        this.onGetViews = this.actions$.pipe(ofType(forRoot.VIEW_PROJECTS), switchMap((action) => this.viewService.getViews()
            .pipe(map(views => new forRoot.ViewSucceeded(views)), catchError(error => {
            Utils.errorMessage(error.message);
            return of(new forRoot.ViewFailed(error));
        }))));
        this.onSave = this.actions$.pipe(ofType(forRoot.VIEW_ADD), switchMap((action) => this.viewService.add(action.params)
            .pipe(map(views => new forRoot.ViewSucceeded(views)), catchError(error => {
            Utils.errorMessage(error.message);
            return of(new forRoot.ViewFailed(error));
        }))));
        this.onDeleteView = this.actions$.pipe(ofType(forRoot.VIEW_DELETE), switchMap((action) => this.viewService.deleteView(action.viewIdValue)
            .pipe(map(views => new forRoot.ViewProjects()), catchError(error => {
            Utils.errorMessage(error.message);
            return of(new forRoot.ViewFailed(error));
        }))));
    }
};
__decorate([
    Effect()
], ViewEffects.prototype, "onGetViews", void 0);
__decorate([
    Effect()
], ViewEffects.prototype, "onSave", void 0);
__decorate([
    Effect()
], ViewEffects.prototype, "onDeleteView", void 0);
ViewEffects = __decorate([
    Injectable()
], ViewEffects);
export { ViewEffects };
//# sourceMappingURL=view.effects.js.map