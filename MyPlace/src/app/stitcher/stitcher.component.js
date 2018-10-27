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
import { ClearStitchError, STITCH_SUCCEEDED, StitchProjects } from "../state";
import * as Utils from "../shared/utils";
let StitcherComponent = class StitcherComponent {
    constructor(actions$, store, stitcherService) {
        this.store = store;
        this.stitcherService = stitcherService;
        this.dead$ = new Subject();
        this.indicatorVisible = false;
        this.close = new EventEmitter();
        this.store.dispatch(new ClearStitchError());
        this.state$ = this.store.select(s => s.stitcher);
        actions$.pipe(ofType(STITCH_SUCCEEDED), takeUntil(this.dead$)).subscribe(() => this.close.emit());
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
            tryMergeAdjacentCycles: new FormControl(true),
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
        this.indicatorVisible = true;
        const params = Object.assign({}, this.form.value, { projects: this.projects.map(p => p.id) });
        this.store.dispatch(new StitchProjects(params));
        var promise = new Promise((resolve, reject) => {
            this.stitcherService.stitch(params)
                .subscribe(r => resolve(r), error => reject(error));
        });
        promise.then((result) => {
            // Utils.successMessage("All projects have been stitched successfully.")
            this.indicatorVisible = false;
            this.close.emit();
        });
        promise.catch(err => {
            this.indicatorVisible = false;
            Utils.errorMessage(err.message);
        });
    }
};
__decorate([
    Input()
], StitcherComponent.prototype, "projects", void 0);
__decorate([
    Output()
], StitcherComponent.prototype, "close", void 0);
StitcherComponent = __decorate([
    Component({
        selector: "app-stitcher",
        templateUrl: "./stitcher.component.html",
        styleUrls: ["./stitcher.component.css"]
    })
], StitcherComponent);
export { StitcherComponent };
//# sourceMappingURL=stitcher.component.js.map