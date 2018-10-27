var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import { filter } from 'rxjs/operators';
import { ofType } from "@ngrx/effects";
import { ViewUserPreferences, SetChartPreferencesSettings } from "./state/preferences.actions";
import * as UserPreferencesActions from "./state/preferences.actions";
let PreferencesComponent = class PreferencesComponent {
    constructor(router, store, dispatcher, formBuilder) {
        this.router = router;
        this.store = store;
        this.dispatcher = dispatcher;
        this.formBuilder = formBuilder;
        this.chartFontFamilies = [
            "Helvetica Neue", "Helvetica", "Arial", "Calibri", "Tahoma", "Times New Roman", "Georgia", "Segoe", "Verdana"
        ];
        this.userLocales = [
            { name: 'English', value: 'en' },
            { name: '中文', value: 'zh' },
            { name: 'Русский', value: 'ru' }
        ];
        this.createForm();
        this.state$ = this.store.select(s => s.userPreferences);
        dispatcher
            .pipe(ofType(UserPreferencesActions.USER_PREFERENCES_UPDATED))
            .subscribe(() => this.applyUserLocale());
    }
    ngOnInit() {
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
    get paletteColors() {
        return this.preferencesForm.get("chartPreferences.paletteColors");
    }
    getPaletteColorGroup(fromIndex, toIndex) {
        return this.paletteColors.controls.slice(fromIndex, toIndex);
    }
    onSubmit() {
        this.store.dispatch(new SetChartPreferencesSettings(this.preferencesForm.value.chartPreferences, this.preferencesForm.value.otherPreferences));
    }
    onCancel() {
        this.router.navigate(['/']);
    }
    applyUserLocale() {
        const currentLocale = localStorage.getItem("locale");
        localStorage.setItem("locale", this.preferencesForm.value.otherPreferences.locale);
        if (currentLocale != this.preferencesForm.value.otherPreferences.locale) {
            window.location.reload(); // force application reloading
        }
    }
    setChartPaletteColor(colors) {
        const colorFGs = colors.map(color => this.formBuilder.control(color));
        const colorFormArray = this.formBuilder.array(colorFGs);
        this.preferencesForm.get("chartPreferences").setControl("paletteColors", colorFormArray);
    }
    createForm() {
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
};
PreferencesComponent = __decorate([
    Component({
        selector: "app-preferences",
        templateUrl: "./preferences.component.html",
        styleUrls: ["./preferences.component.css"]
    })
], PreferencesComponent);
export { PreferencesComponent };
//# sourceMappingURL=preferences.component.js.map