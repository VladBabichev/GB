var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ofType } from "@ngrx/effects";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import * as Utils from "../shared/utils";
import { StatisticStitchProjects, StatisticClearStitchError, STATISTIC_STITCH_SUCCEEDED } from "../state";
let StatisticProjectComponent = class StatisticProjectComponent {
    constructor(actions$, store, srv) {
        this.store = store;
        this.srv = srv;
        this.dead$ = new Subject();
        this.indicatorVisible = false;
        this.close = new EventEmitter();
        this.store.dispatch(new StatisticClearStitchError());
        this.state$ = this.store.select(s => s.stitcher);
        actions$.pipe(ofType(STATISTIC_STITCH_SUCCEEDED), takeUntil(this.dead$)).subscribe(() => this.close.emit());
    }
    ngOnInit() {
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
    ngOnDestroy() {
        this.dead$.next();
        this.dead$.complete();
    }
    onBack() {
        this.close.emit();
    }
    onSubmit() {
        this.params = Object.assign({}, this.form.value, { projects: this.projects.map(p => p.id) });
        this.store.dispatch(new StatisticStitchProjects(this.params));
        this.showLoadPanel();
        this.avarage();
    }
    // private region
    avarage() {
        var promise = new Promise((resolve, reject) => {
            this.srv.stitch(this.params)
                .subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((resp) => {
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
};
__decorate([
    Input()
], StatisticProjectComponent.prototype, "projects", void 0);
__decorate([
    Output()
], StatisticProjectComponent.prototype, "close", void 0);
StatisticProjectComponent = __decorate([
    Component({
        selector: "app-statistic-project",
        templateUrl: "./statistic-project.component.html",
        styleUrls: ["./statistic-project.component.css"]
    })
], StatisticProjectComponent);
export { StatisticProjectComponent };
//# sourceMappingURL=statistic-project.component.js.map