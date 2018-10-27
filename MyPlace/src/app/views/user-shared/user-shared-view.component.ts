import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";

import { AppState } from "../../state";
import { SetUserSharedView } from "../../chart/state/chart.actions";

@Component({
    templateUrl: "./user-shared-view.component.html",
    styleUrls: ["./user-shared-view.component.css"]
})
export class UserSharedViewComponent {
    constructor(private route: ActivatedRoute, private store: Store<AppState>) {
        this.route.params.subscribe(params => {
            var token = encodeURIComponent(params["token"]);
            this.store.dispatch(new SetUserSharedView(token));
        });
    }
}