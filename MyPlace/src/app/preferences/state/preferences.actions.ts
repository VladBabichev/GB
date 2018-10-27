import { Action } from "@ngrx/store";
import { UserPreferences, ChartPreferences, OtherPreferences } from "../model/preferences.model";

export const VIEW_USER_PREFERENCES = "USER_PREFERENCES: VIEW_USER_PREFERENCES";
export const VIEW_USER_PREFERENCES_SUCCEEDED = "USER_PREFERENCES: VIEW_USER_PREFERENCES_SUCCEEDED";
export const SET_CHART_PREFERENCES_SETTINGS = "USER_PREFERENCES: SET_CHART_PREFERENCES_SETTINGS";
export const SET_PROJECT_VIEWER_PREFERENCES_SETTINGS = "USER_PREFERENCES: SET_PROJECT_VIEWER_PREFERENCES_SETTINGS";
export const USER_PREFERENCES_UPDATED = "USER_PREFERENCES: USER_PREFERENCES_UPDATED";
export const USER_PREFERENCES_FAILED = "USER_PREFERENCES: USER_PREFERENCES_FAILED";

export class ViewUserPreferences implements Action {
    readonly type = VIEW_USER_PREFERENCES;

    constructor() {
    }
}

export class ViewUserPreferencesSucceeded implements Action {
    readonly type = VIEW_USER_PREFERENCES_SUCCEEDED;
    constructor(public userPreferences: UserPreferences) {
    }
}

export class SetChartPreferencesSettings implements Action {
	readonly type = SET_CHART_PREFERENCES_SETTINGS;

	constructor(public chartPreferences: ChartPreferences, public otherPreferences: OtherPreferences) {
	}
}

export class SetProjectViewerPreferencesSettings implements Action {
    readonly type = SET_PROJECT_VIEWER_PREFERENCES_SETTINGS;

    constructor(public projectViewerPreferences: any) {
    }
}

export class UserPreferencesSettingsUpdated implements Action {
    readonly type = USER_PREFERENCES_UPDATED;
    constructor(public userPreferences: UserPreferences) {
    }
} 

export class UserPreferencesSettingsFailed implements Action {
    readonly type = USER_PREFERENCES_FAILED;

    constructor(public error: string) {
    }
}

export type UserPreferencesAction
    = ViewUserPreferences
    | ViewUserPreferencesSucceeded
	| SetChartPreferencesSettings
    | SetProjectViewerPreferencesSettings
    | UserPreferencesSettingsUpdated
	| UserPreferencesSettingsFailed
