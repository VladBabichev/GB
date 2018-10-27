import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { AppState, AuthState, AcquirePasswordReset } from "../../state";

@Component({
    templateUrl: "./acquire-password-reset.component.html",
    styleUrls: ["./acquire-password-reset.component.css"]
})
export class AcquirePasswordResetComponent implements OnInit {
    form: FormGroup;
    username: FormControl;
    state$: Observable<AuthState>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router) {
        this.state$ = this.store.select(s => s.auth);
    }

    ngOnInit(): void {
        this.username = new FormControl(null, Validators.required);

        this.form = new FormGroup({
            username: this.username
        });
    }

    onCancel() : void {
        this.router.navigate(['../login'], { relativeTo: this.route });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.store.dispatch(new AcquirePasswordReset(this.form.value.username));
        }
    }
}
