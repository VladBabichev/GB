var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
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
import { FeedbackComponent } from "./feedback/feedback.component";
import { ProjectListComponent } from "./projects/project-list.component";
import { ViewListComponent } from "./views/view-list.component";
import { UserSharedViewComponent } from "./views/user-shared/user-shared-view.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { DevicesComponent } from "./devices/devices.component";
import { DashboardsComponent } from "../app/dashboards/dashboards.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { MainLayoutComponent } from "./layouts/main/main-layout.component";
import { DiagnosticProcessComponent } from "./diagnostics/diagnostic-process.component";
const appRoutes = [
    {
        path: "auth",
        component: AuthLayoutComponent,
        children: [
            {
                path: "login",
                component: LoginComponent
            },
            {
                path: "logoff",
                component: LogoffComponent
            },
            {
                path: "signup",
                component: SignupComponent
            },
            {
                path: "signup-success",
                component: SignupSuccessComponent
            },
            {
                path: "confirm-success",
                component: ConfirmSuccessComponent
            },
            {
                path: "confirm-failure",
                component: ConfirmFailureComponent
            },
            {
                path: "acquire-password-reset",
                component: AcquirePasswordResetComponent
            },
            {
                path: "password-reset-acquired",
                component: PasswordResetAcquiredComponent
            },
            {
                path: "reset-password",
                component: ResetPasswordComponent
            },
            {
                path: "reset-password-success",
                component: ResetPasswordSuccessComponent
            },
            { path: "**", redirectTo: "/auth/login" }
        ]
    },
    {
        path: "diagnosticProcess",
        component: DiagnosticProcessComponent
    },
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            {
                path: "feedback",
                component: FeedbackComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "projects",
                component: ProjectListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "views",
                component: ViewListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "devices",
                component: DevicesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "shared/view/:token",
                component: UserSharedViewComponent
            },
            {
                path: "upload",
                component: ProjectDetailComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "preferences",
                component: PreferencesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: "dashboards",
                component: DashboardsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'specifications',
                loadChildren: 'app/specifications/specifications.module#SpecificationsModule',
                canActivate: [AuthGuard]
            },
            {
                path: "projects/:projectId/measurements",
                loadChildren: 'app/measurement/measurement.module#MeasurementsModule',
                canActivate: [AuthGuard]
            },
            {
                path: "admin",
                loadChildren: 'app/admin/admin.module#AdminModule',
                canActivate: [AuthGuard]
            },
            { path: "", redirectTo: "projects", pathMatch: "full" }
        ]
    },
    { path: "**", redirectTo: "" }
];
let AppRouteModule = class AppRouteModule {
};
AppRouteModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(appRoutes)],
        exports: [RouterModule]
    })
], AppRouteModule);
export { AppRouteModule };
//# sourceMappingURL=app-routes.module.js.map