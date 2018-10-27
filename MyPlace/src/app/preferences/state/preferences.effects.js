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
import * as forRoot from "./preferences.actions";
let UserPreferencesEffects = class UserPreferencesEffects {
    constructor(store, actions$, userPreferencesService) {
        this.store = store;
        this.actions$ = actions$;
        this.userPreferencesService = userPreferencesService;
        this.onGetUserPreferences = this.actions$.pipe(ofType(forRoot.VIEW_USER_PREFERENCES), switchMap((action) => this.userPreferencesService.getPreferences()
            .pipe(map(preferences => new forRoot.ViewUserPreferencesSucceeded(preferences)), catchError(error => of(new forRoot.UserPreferencesSettingsFailed("Unable to read user preferences. Please, try again later."))))));
        this.onSetUserPreferences = this.actions$.pipe(ofType(forRoot.SET_CHART_PREFERENCES_SETTINGS, forRoot.SET_PROJECT_VIEWER_PREFERENCES_SETTINGS), withLatestFrom(this.store.select(s => s.userPreferences), (_, state) => state), switchMap((state) => this.userPreferencesService.savePreferences(state.preferences)
            .pipe(map(() => new forRoot.UserPreferencesSettingsUpdated(state.preferences)), catchError(error => of(new forRoot.UserPreferencesSettingsFailed("Unable to save user preferences. Please, try again later."))))));
    }
};
__decorate([
    Effect()
], UserPreferencesEffects.prototype, "onGetUserPreferences", void 0);
__decorate([
    Effect()
], UserPreferencesEffects.prototype, "onSetUserPreferences", void 0);
UserPreferencesEffects = __decorate([
    Injectable()
], UserPreferencesEffects);
export { UserPreferencesEffects };
//# sourceMappingURL=preferences.effects.js.map