import { AuthEffects } from "../auth/state/auth.effects";
import { ChartEffects } from "../chart/state/chart.effects";
import { FeedbackEffects } from "../feedback/state/feedback.effects";
import { StitcherEffects } from "../stitcher/state/stitcher.effects";
import { StatisticStitcherEffects } from "../statistic-project/state/statistic-stitcher.effects";
import { UploadEffects } from "../projects/state/upload.effects";
import { ViewEffects } from "../view/state/view.effects";
import { UserPreferencesEffects } from "../preferences/state/preferences.effects";
import { AdminEffects } from "../admin/state/admin.effects";
export const appEffects = [
    AuthEffects,
    ChartEffects,
    FeedbackEffects,
    StitcherEffects,
    StatisticStitcherEffects,
    UploadEffects,
    ViewEffects,
    UserPreferencesEffects,
    AdminEffects
];
//# sourceMappingURL=app.effects.js.map