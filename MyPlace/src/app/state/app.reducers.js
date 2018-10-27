import { authReducer } from "../auth/state/auth.reducers";
import { chartReducer } from "../chart/state/chart.reducers";
import { feedbackReducer } from "../feedback/state/feedback.reducer";
import { stitcherReducer } from "../stitcher/state/stitcher.reducer";
import { statisticStitcherReducer } from "../statistic-project/state/statistic-stitcher.reducer";
import { viewerReducer } from "../view/state/view.reducer";
import { uploadReducer } from "../projects/state/upload.reducers";
import { userPreferencesReducer } from "../preferences/state/preferences.reducer";
import { adminReducer } from "../admin/state/admin.reducers";
import { projectsReducer } from "../project/state/project.reducer";
import { dashboardReducer } from "../dashboards/state/dashboard.reducers";
export const appReducers = {
    auth: authReducer,
    chart: chartReducer,
    feedback: feedbackReducer,
    viewer: viewerReducer,
    stitcher: stitcherReducer,
    statisticStitcher: statisticStitcherReducer,
    upload: uploadReducer,
    userPreferences: userPreferencesReducer,
    admin: adminReducer,
    projectsState: projectsReducer,
    dashboardState: dashboardReducer
};
//# sourceMappingURL=app.reducers.js.map