import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import * as Utils from "../shared/utils";
import { AppState, StatisticStitcherState, StatisticStitchProjects, StatisticClearStitchError, STATISTIC_STITCH_SUCCEEDED } from "../state";
import { ProjectListItem } from "../projects/model/project-list-item";
import { StatisticStitcherService } from "../statistic-project/state/statistic-stitcher.service";
import { StatisticProjectParams } from "../statistic-project/model/statistic-project-params";

@Component({
    selector: "app-statistic-project",
    templateUrl: "./statistic-project.component.html",
    styleUrls: ["./statistic-project.component.css"]
})
export class StatisticProjectComponent implements OnInit, OnDestroy {
    form: FormGroup;
    state$: Observable<StatisticStitcherState>;
    private dead$ = new Subject();
    params: StatisticProjectParams;
    indicatorVisible: boolean = false;

    @Input()
    projects: ProjectListItem[];

    @Output()
    close = new EventEmitter<any>();

    constructor(actions$: Actions, private store: Store<AppState>, private srv: StatisticStitcherService) {
        this.store.dispatch(new StatisticClearStitchError());
        this.state$ = this.store.select(s => s.stitcher);

        actions$.pipe(
            ofType(STATISTIC_STITCH_SUCCEEDED),
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
        this.params = { ...this.form.value, projects: this.projects.map(p => p.id) };
        this.store.dispatch(new StatisticStitchProjects(this.params));
        this.showLoadPanel();
        this.avarage();
    }

    // private region
    private avarage(): void {
        var promise = new Promise((resolve, reject) => {
            this.srv.stitch(this.params)
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp: any) => {
            this.indicatorVisible = false;
            this.close.emit();
        });       
        promise.catch(err => {
            this.indicatorVisible = false;
            Utils.errorMessage(err.message);
        });
    }
    onShown() {        
    }

    onHidden() {        
    }

    showLoadPanel() {        
        this.indicatorVisible = true;
    }
}
