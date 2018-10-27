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
import * as forRoot from "./stitcher.actions";
import { StitcherService } from "./stitcher.service";

@Injectable()
export class StitcherEffects {
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

    constructor(private actions$: Actions, private store: Store<AppState>, private stitcherService: StitcherService) {
    }
}
