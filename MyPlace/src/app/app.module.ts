import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ActionReducer, StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { localStorageSync } from "ngrx-store-localstorage";
import { storeLogger } from "ngrx-store-logger";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { TabModule } from "angular-tabs-component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
    DxChartModule,
    DxDataGridModule,
    DxFileUploaderModule,
    DxNumberBoxModule,
    DxChartComponent,
    DxRangeSelectorModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DevExtremeModule,
	DxTemplateModule
} from "devextreme-angular";

import "devextreme/data/odata/store";
import { ColorPickerModule } from "ngx-color-picker";
import { ClipboardModule } from "ngx-clipboard";

import { AppComponent } from "./app.component";
import { AppRouteModule } from "./app-routes.module";

import { AuthInterceptor } from "./auth/interceptor/auth-interceptor";
import { AuthGuard } from "./auth/guard/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { LogoffComponent } from "./auth/logoff/logoff.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { SignupSuccessComponent } from "./auth/signup-success/signup-success.component";
import { ConfirmSuccessComponent } from "./auth/confirm-success/confirm-success.component";
import { ConfirmFailureComponent } from "./auth/confirm-failure/confirm-failure.component";
import { AcquirePasswordResetComponent } from "./auth/acquire-password-reset/acquire-password-reset.component";
import { PasswordResetAcquiredComponent } from "./auth/password-reset-acquired/password-reset-acquired.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { ResetPasswordSuccessComponent } from "./auth/reset-password-success/reset-password-success.component";
import { AuthService } from "./auth/state/auth.service";
import { ProjectService } from "./project/state/project.service"

import { AggregationSettingsEditorComponent } from "./chart/aggregation-settings-editor/aggregation-settings-editor.component";
import { StateOfChargeEditorComponent } from "./chart/stateof-charge-editor/stateof-charge-editor.component";

import { ChartComponent } from "./chart/chart/chart.component";
import { ChartJSComponent } from "./chart/chart/chartjs.component";
import { ChartViewComponent } from "./chart/chart-view.component";
import { ChartJSViewComponent } from "./chart/chartjs-view.component";

import { ChartUserSharedViewComponent } from "./chart/chart-user-shared-view.component";

import { ChartService } from "./chart/state/chart.service";
import { FilterEditorComponent } from "./chart/filter-editor/filter-editor.component";
import { ProjectLegendComponent } from "./shared/project-legend/project-legend.component";
import { PlotTypeSelectorComponent } from "./chart/plot-type-selector/plot-type-selector.component";
import { UoMSettingsEditorComponent } from "./chart/uom-settings-editor/uom-settings-editor.component";
import { ChartSettingsEditorComponent } from "./chart/chart-settings-editor/chart-settings-editor.component";
import { ChartAppearanceEditorComponent } from "./chart/chart-appearance-editor/chart-appearance-editor.component";
import { SeriesEditorComponent } from "./chart/series-editor/series-editor.component";
import { PagerService } from "./chart/service/pager-service";
import { AxisRangeEditorComponent } from "./chart/axis-range-editor/axis-range-editor.component";
import { PlotEditorComponent } from "./chart/plot-editor/plot-editor.component";
import { CustomTemplateEditorComponent } from "./chart/custom-template-editor/custom-template-editor.component";
import { CustomTemplateEditComponent } from "./chart/custom-template-editor/edit/custom-template-edit.component";
import { CustomTemplateCreateDialogComponent } from "./chart/custom-template-editor/create/custom-template-create-dialog.component";

import { PlotTemplateEditorComponent } from "./chart/plot-template-editor/plot-template-editor.component";
import { ShareInstanceEditorComponent } from "./chart/share-instance-editor/share-instance-editor.component";

import { UserPreferencesService } from "./preferences/state/preferences.service";
import { PreferencesComponent } from "./preferences/preferences.component";

import { FeedbackComponent } from "./feedback/feedback.component";
import { FeedbackService } from "./feedback/state/feedback.service";

import { ProjectListComponent } from "./projects/project-list.component";
import { ViewListComponent } from "./views/view-list.component";
import { UserSharedViewComponent } from "./views/user-shared/user-shared-view.component";

import { StitcherService } from "./stitcher/state/stitcher.service";
import { StitcherComponent } from "./stitcher/stitcher.component";

import { StatisticStitcherService } from "./statistic-project/state/statistic-stitcher.service";
import { StatisticProjectComponent } from "./statistic-project/statistic-project.component";

import { ViewService } from "./view/state/view.service";
import { ViewComponent } from "./view/view.component";

import { DevicesService } from "./devices/state/devices.service";
import { DevicesComponent } from "./devices/devices.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { UploadService } from "./projects/state/upload.service";
import { DropdownBoxComponent } from "./shared/dropdown-box/dropdown-box.component";
import { ConfirmPopupComponent } from "./shared/popup/confirm-popup.component";
import { PopupService } from "./shared/popup/popup.service";
import { environment } from "../environments/environment";

import { AppState } from "./state/app.state";
import { appEffects } from "./state/app.effects";
import { appReducers } from "./state/app.reducers";
import { SharedModule } from "./shared/shared.module";

import { SpecificationService } from "./shared/services/specification.service";
import { AdminService } from "./admin/admin.service";
import { ApplicationStartupProviderFactory, ApplicationStartupProvider } from "./core/providers/application-startup.provider";

// materials
import {
    MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatSidenavModule,
    MatTooltipModule,MatMenuModule
} from '@angular/material';
import { DxCircularGaugeModule, DxLinearGaugeModule, DxSliderModule } from 'devextreme-angular'
import {
    DxCheckBoxModule,
    DxDateBoxModule,
    DxCalendarModule

} from 'devextreme-angular';
//  =========================================================================
// dashboard
import { DashboardsComponent } from "../app/dashboards/dashboards.component";
import { DashboardDetailComponent } from "../app/dashboards/dashboard-detail.component";
import { WidgetContainerComponent } from "../app/dashboards/widgets/widgetContainer.component";
import { WidgetFactoryComponent } from "../app/dashboards/widgets/widgetFactory.component";
import { MarkdownComponent } from "../app/dashboards/widgets/markdown/markdown.component";
import { WelcomeComponent } from "../app/dashboards/widgets/welcome/welcome.component";
import { DashboardService } from "../app/dashboards/services/dashboard.service";
import { WidgetComponentsService } from "../app/dashboards/services/widgetComponents.service";
import { WidgetComponent } from "../app/dashboards/widgets/widget.component";
import { DashboardWidgetsComponent } from "../app/dashboards/dashboard-widgets.component";
import { BatteryChargeComponent } from "../app//dashboards/widgets/batteryCharge/batteryCharge.component";
import { CalendarComponent } from "../app//dashboards/widgets/calendar/calendar.component";
import { ProjectsGridComponent } from "../app//dashboards/widgets/projects-grid/projects-grid.component";
import { ProjectsWidgetComponent } from "../app//dashboards/widgets/projects-grid/projects-widget.component";
import { DeviceStatusComponent } from "../app//dashboards/widgets/device-status/device-status.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { MainLayoutComponent } from "./layouts/main/main-layout.component";
import { WidgetViewComponent } from "../app/dashboards/widgets/widget-view.component";
import { WidgetConfigComponent } from "../app/dashboards/widgets/widget-config.component";
import { BatteryChargeConfigComponent } from "../app/dashboards/widgets/batteryCharge/batteryChargeConfig.component";

//============================================================================================
import { DiagnosticProcessComponent } from "../app/diagnostics/diagnostic-process.component";

export function logger(reducer: ActionReducer<AppState>): any {
    return storeLogger()(reducer);
}

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return localStorageSync({keys: [{auth: ["username", "loggedIn","isAdmin","isOwner"] }], rehydrate: true })(reducer);
}

export const metaReducers = environment.production ? [logger, localStorageSyncReducer] : [logger, localStorageSyncReducer];

@NgModule({
    entryComponents: [
        ConfirmPopupComponent,
        CustomTemplateCreateDialogComponent,
        CustomTemplateEditComponent,
        DashboardDetailComponent,
		WidgetViewComponent,
        ProjectsGridComponent,
        WidgetConfigComponent,
        BatteryChargeConfigComponent,	
		ProjectsWidgetComponent,
		ProjectsGridComponent,
		DeviceStatusComponent
    ],
    declarations: [
        AppComponent,
        AuthLayoutComponent,
        MainLayoutComponent,
        LoginComponent,
        LogoffComponent,
        SignupComponent,
        SignupSuccessComponent,
        ConfirmSuccessComponent,
        ConfirmFailureComponent,
        AcquirePasswordResetComponent,
        PasswordResetAcquiredComponent,
        ResetPasswordComponent,
        ResetPasswordSuccessComponent,
        ShareInstanceEditorComponent,
        AxisRangeEditorComponent,
        ChartComponent,
        ChartJSComponent,
        PlotEditorComponent,
        PlotTemplateEditorComponent,
        ChartViewComponent,
        ChartJSViewComponent,
        FilterEditorComponent,
        SeriesEditorComponent,
        ProjectLegendComponent,
        PlotTypeSelectorComponent,
        StateOfChargeEditorComponent,
        AggregationSettingsEditorComponent,
        UoMSettingsEditorComponent,
        ChartSettingsEditorComponent,
        ChartAppearanceEditorComponent,
        StitcherComponent,
        StatisticProjectComponent,
        ViewComponent,
        FeedbackComponent,
        ViewListComponent,
        ProjectListComponent,
        ProjectDetailComponent,
        DropdownBoxComponent,
        ConfirmPopupComponent,
        CustomTemplateEditorComponent,
        CustomTemplateEditComponent,
        CustomTemplateCreateDialogComponent,
        PreferencesComponent,
        UserSharedViewComponent,
        ChartUserSharedViewComponent,
        DevicesComponent,
        DashboardsComponent,
        DashboardDetailComponent,      
        WidgetFactoryComponent,
        WidgetContainerComponent,
        MarkdownComponent,
        WelcomeComponent,
        WidgetComponent,
        DashboardWidgetsComponent,
        BatteryChargeComponent,
		CalendarComponent,
		ProjectsGridComponent,
        WidgetViewComponent,
        WidgetConfigComponent,
        BatteryChargeConfigComponent,
		ProjectsWidgetComponent,
		DeviceStatusComponent,	
        DiagnosticProcessComponent,
        ProjectsGridComponent,
    ],
    imports: [
        SharedModule.forRoot(),
        FormsModule,
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRouteModule,
        DevExtremeModule,
        DxChartModule,
        DxDataGridModule,
		DxTemplateModule,
        DxFileUploaderModule,
        DxRangeSelectorModule,
        DxNumberBoxModule,
        DxSelectBoxModule,
        DxTextAreaModule,
        DxPopupModule,
        AngularMultiSelectModule,
        TabModule,
        ClipboardModule,
        ColorPickerModule,
        StoreModule.forRoot(appReducers, { metaReducers }),
        EffectsModule.forRoot(appEffects),
        NgbModule.forRoot(),
        MatSidenavModule,
        MatTooltipModule,
        MatListModule,
        MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatMenuModule
        , DxCircularGaugeModule, DxLinearGaugeModule, DxSliderModule,
        DxCheckBoxModule,
        DxDateBoxModule,
        DxCalendarModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: ApplicationStartupProviderFactory,
            multi: true,
            deps: [
                ApplicationStartupProvider
            ]
        },        
        ApplicationStartupProvider,
        AuthGuard,
        AuthService,
        ChartService,
        FeedbackService,
        ViewService,
        StitcherService,
        StatisticStitcherService,
        UserPreferencesService,
        UploadService,
        PagerService,
        PopupService,
        ProjectService,
        DevicesService,     
        SpecificationService,
        AdminService,
        DashboardService,
        WidgetComponentsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
