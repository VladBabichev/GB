import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { 
    map, 
    switchMap, 
    withLatestFrom,
    catchError 
} from 'rxjs/operators';

import { UserPreferencesService } from "./preferences.service"
import { AppState } from "../../state";
import * as forRoot from "./preferences.actions";

@Injectable()
export class UserPreferencesEffects {
    constructor(
        private store: Store<AppState>, 
        private actions$: Actions, 
        private userPreferencesService: UserPreferencesService) {
    }

    @Effect()
    onGetUserPreferences = this.actions$.pipe(
        ofType(forRoot.VIEW_USER_PREFERENCES),
        switchMap((action: forRoot.ViewUserPreferences) =>
            this.userPreferencesService.getPreferences()
            .pipe(
                map(preferences => new forRoot.ViewUserPreferencesSucceeded(preferences)),
                catchError(error => of(new forRoot.UserPreferencesSettingsFailed("Unable to read user preferences. Please, try again later.")))
            )
        )
    );

	@Effect()
	onSetUserPreferences = this.actions$.pipe(
			ofType(forRoot.SET_CHART_PREFERENCES_SETTINGS, forRoot.SET_PROJECT_VIEWER_PREFERENCES_SETTINGS),
		withLatestFrom(this.store.select(s => s.userPreferences), (_, state) => state),
		switchMap((state) =>
			this.userPreferencesService.savePreferences(state.preferences)
				.pipe(
					map(() => new forRoot.UserPreferencesSettingsUpdated(state.preferences)),
					catchError(error => of(new forRoot.UserPreferencesSettingsFailed("Unable to save user preferences. Please, try again later.")))
				)
		)
	);
}