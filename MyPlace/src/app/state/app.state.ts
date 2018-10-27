import { AuthState } from "../auth/state/auth.state";
import { ChartState } from "../chart/state/chart.state";
import { FeedbackState } from "../feedback/state/feedback.state";
import { StitcherState } from "../stitcher/state/stitcher.state";
import { StatisticStitcherState } from "../statistic-project/state/statistic-stitcher.state";
import { ViewState } from "../view/state/view.state";
import { UploadState } from "../projects/state/upload.state";
import { UserPreferencesState } from "../preferences/state/preferences.state";
import { AdminState } from "../admin/state/admin.state";
import { ProjectsState } from "../project/state/project.state";
import { DashboardState } from "../dashboards/state/dashboard.state";

export interface AppState {
    auth: AuthState;
    chart: ChartState;
    feedback: FeedbackState;
    stitcher: StitcherState;
    statisticStitcher: StatisticStitcherState;
    viewer: ViewState;
    upload: UploadState;
    userPreferences: UserPreferencesState;
    admin: AdminState;
    projectsState: ProjectsState;
    dashboardState: DashboardState;
}
