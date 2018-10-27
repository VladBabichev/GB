import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { 
    map, 
    switchMap, 
    catchError 
} from 'rxjs/operators';
//import notify from 'devextreme/ui/notify';
import * as Utils from "../../shared/utils";

import { AppState } from "../../state";
import * as forRoot from "./statistic-stitcher.actions";
import { StatisticStitcherService } from "./statistic-stitcher.service";

@Injectable()
export class StatisticStitcherEffects {
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

    constructor(
        private actions$: Actions, 
        private store: Store<AppState>, 
        private stitcherService: StatisticStitcherService) {
    }
}
