var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
let StitcherEffects = class StitcherEffects {
    //@Effect()
    //onExport = this.actions$.pipe(
    //    ofType(forRoot.STITCH_PROJECTS),
    //    switchMap((action: forRoot.StitchProjects) =>
    //        this.stitcherService.stitch(action.params)
    //        .pipe(
    //            map(() => new forRoot.StitchSucceeded()),
    //catchError(error => {
    //	Utils.errorMessage(error.message);
    //	return of(new forRoot.StitchFailed(error));
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
StitcherEffects = __decorate([
    Injectable()
], StitcherEffects);
export { StitcherEffects };
//# sourceMappingURL=stitcher.effects.js.map