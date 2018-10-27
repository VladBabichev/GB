var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
let StatisticStitcherEffects = class StatisticStitcherEffects {
    //@Effect()
    //onCalculateAverage = this.actions$.pipe(
    //    ofType(forRoot.STATISTIC_STITCH_PROJECTS),
    //    switchMap((action: forRoot.StatisticStitchProjects) =>
    //        this.stitcherService.stitch(action.params)
    //        .pipe(
    //            map(() => new forRoot.StatisticStitchSucceeded()),
    //catchError(error => {
    //	Utils.errorMessage(error.message);
    //	return of(new forRoot.StatisticStitchFailed(error));
    //})
    //        )
    //    )
    //);
    constructor(actions$, store, stitcherService) {
        this.actions$ = actions$;
        this.store = store;
        this.stitcherService = stitcherService;
    }
};
StatisticStitcherEffects = __decorate([
    Injectable()
], StatisticStitcherEffects);
export { StatisticStitcherEffects };
//# sourceMappingURL=statistic-stitcher.effects.js.map