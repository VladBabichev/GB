import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { 
    map, 
    switchMap, 
    catchError 
} from 'rxjs/operators';

import { AppState } from "../../state";
import * as forRoot from "./view.actions";
import { ViewService } from "./view.service";
import * as Utils from "../../shared/utils";

@Injectable()
export class ViewEffects {
    @Effect()
    onGetViews = this.actions$.pipe(
        ofType(forRoot.VIEW_PROJECTS),
        switchMap((action: forRoot.ViewProjects) => 
            this.viewService.getViews()
            .pipe(
                map(views => new forRoot.ViewSucceeded(views)),
				catchError(error => {
					Utils.errorMessage(error.message);
					return of(new forRoot.ViewFailed(error));
				})
            )      
        )
    );
    
    @Effect()
    onSave = this.actions$.pipe(
        ofType(forRoot.VIEW_ADD),
        switchMap((action: forRoot.AddView) =>
            this.viewService.add(action.params)
            .pipe(
                map(views => new forRoot.ViewSucceeded(views)),
				catchError(error => {
					Utils.errorMessage(error.message);
					return of(new forRoot.ViewFailed(error));
				})
            )
        )
    );

    @Effect()
    onDeleteView = this.actions$.pipe(
        ofType(forRoot.VIEW_DELETE),
        switchMap((action: forRoot.ViewDeleted) =>
            this.viewService.deleteView(action.viewIdValue)
            .pipe(
                map(views => new forRoot.ViewProjects()),
				catchError(error => {
					Utils.errorMessage(error.message);
					return of(new forRoot.ViewFailed(error));
				})
            )
        )
    );

    constructor(private actions$: Actions, private store: Store<AppState>, private viewService: ViewService) {
    }
}
