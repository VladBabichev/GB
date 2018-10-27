import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store, ActionsSubject } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ofType } from "@ngrx/effects";

import { AppState } from "../state";
import { ViewUserPreferences, SetChartPreferencesSettings} from "./state/preferences.actions"
import { UserPreferencesState } from "./state/preferences.state"
import * as UserPreferencesActions from "./state/preferences.actions";
import { UserPreferences, ChartPaletteColor, UserLocale } from "./model/preferences.model" 

@Component({
    selector: "app-preferences",
    templateUrl: "./preferences.component.html",
    styleUrls: ["./preferences.component.css"]
})
export class PreferencesComponent implements OnInit {
    private seriesPaletteColors: any[];
    private chartFontFamilies: string[] = [
        "Helvetica Neue", "Helvetica", "Arial", "Calibri", "Tahoma", "Times New Roman", "Georgia", "Segoe", "Verdana"
    ];
    private userLocales: UserLocale[] = [
        { name: 'English', value: 'en' },
        { name: '中文', value: 'zh' },
        { name: 'Русский', value: 'ru' }
    ];
    private isPreferencesLoaded: boolean;
    
    preferencesForm: FormGroup;
    state$: Observable<UserPreferencesState>;

    constructor(
        private router: Router,
        private store: Store<AppState>, 
        private dispatcher: ActionsSubject,
        private formBuilder: FormBuilder) {
        this.createForm();
        this.state$ = this.store.select(s => s.userPreferences);

        dispatcher
            .pipe(
                ofType(UserPreferencesActions.USER_PREFERENCES_UPDATED))
            .subscribe(() => this.applyUserLocale());
    }

    ngOnInit(): void {
        this.isPreferencesLoaded = false;
        this.store.dispatch(new ViewUserPreferences());
        this.store.select(s => s.userPreferences.preferences)
            .pipe(filter(p => !!p.chartPreferences))
            .subscribe(p => {
                this.isPreferencesLoaded = true;
                this.setChartPaletteColor(p.chartPreferences.paletteColors);
				this.preferencesForm.setValue({
					otherPreferences: p.otherPreferences,
                    chartPreferences: p.chartPreferences
                });
            });
    }

    get IsReady() {
        return this.isPreferencesLoaded;
    }

    get paletteColors(): FormArray {
        return this.preferencesForm.get("chartPreferences.paletteColors") as FormArray;
    }

    getPaletteColorGroup(fromIndex, toIndex): any[] {
        return this.paletteColors.controls.slice(fromIndex, toIndex);
    }

	onSubmit(): void {
		this.store.dispatch(new SetChartPreferencesSettings(this.preferencesForm.value.chartPreferences, this.preferencesForm.value.otherPreferences));
    }

    onCancel() : void {
        this.router.navigate(['/']);
    }

    private applyUserLocale(): void {
        const currentLocale = localStorage.getItem("locale");
        localStorage.setItem("locale", this.preferencesForm.value.otherPreferences.locale);

        if (currentLocale != this.preferencesForm.value.otherPreferences.locale) {
            window.location.reload(); // force application reloading
        }
    }

    private setChartPaletteColor(colors: ChartPaletteColor[]) {
        const colorFGs = colors.map(color => this.formBuilder.control(color));
        const colorFormArray = this.formBuilder.array(colorFGs);
        (this.preferencesForm.get("chartPreferences") as FormGroup).setControl("paletteColors", colorFormArray);
    }

	private createForm(): void {
		this.preferencesForm = this.formBuilder.group({
			otherPreferences: this.formBuilder.group({
                maxSelectedProjectCount: 10,
                locale: 'en'
			}),
			chartPreferences: this.formBuilder.group({
				pointSize: 11,
				xLineVisible: true,
				yLineVisible: true,
				showLegend: false,
				fontFamilyName: null,
				fontSize: null,
				paletteColors: this.formBuilder.array([])
			})
		});
	}
}