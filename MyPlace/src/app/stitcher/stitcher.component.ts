import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable ,  Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

import { AppState, ClearStitchError, StitcherState, StitchFailed, STITCH_FAILED, STITCH_SUCCEEDED, StitchProjects } from "../state";
import { ProjectListItem } from "../projects/model/project-list-item";
import { StitcherService } from "../stitcher/state/stitcher.service";
import * as Utils from "../shared/utils";

@Component({
    selector: "app-stitcher",
    templateUrl: "./stitcher.component.html",
    styleUrls: ["./stitcher.component.css"]
})
export class StitcherComponent implements OnInit, OnDestroy {
    form: FormGroup;
    state$: Observable<StitcherState>;
    private dead$ = new Subject();
    indicatorVisible: boolean = false;

    @Input()
    projects: ProjectListItem[];

    @Output()
    close = new EventEmitter<any>();

    constructor(actions$: Actions, private store: Store<AppState>, private stitcherService: StitcherService,) {
        this.store.dispatch(new ClearStitchError());
        this.state$ = this.store.select(s => s.stitcher);

        actions$.pipe(
            ofType(STITCH_SUCCEEDED),
            takeUntil(this.dead$)
        ).subscribe(() => this.close.emit());
    }

    public ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
            testName: new FormControl(null, Validators.maxLength(256)),
            testType: new FormControl(null, Validators.maxLength(256)),
            channel: new FormControl(null, Validators.maxLength(256)),
            tag: new FormControl(null, Validators.maxLength(256)),
            mass: new FormControl(null),
            area: new FormControl(null),
            tryMergeAdjacentCycles: new FormControl(true),
            comments: new FormControl(null, Validators.maxLength(256))
        });
    }

    public ngOnDestroy(): void {
        this.dead$.next();
        this.dead$.complete();
    }

    public onBack(): void {
        this.close.emit();
    }

    public onSubmit(): void {
        this.indicatorVisible = true;
        const params = { ...this.form.value, projects: this.projects.map(p => p.id) };       
        this.store.dispatch(new StitchProjects(params));

        var promise = new Promise((resolve, reject) => {
            this.stitcherService.stitch(params)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((result: any) => {
           // Utils.successMessage("All projects have been stitched successfully.")
            this.indicatorVisible = false;
            this.close.emit();
        });
        promise.catch(err => {
            this.indicatorVisible = false;
            Utils.errorMessage(err.message);
        });
       
    }
}
