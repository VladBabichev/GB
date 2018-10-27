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
import { ClearViewError, VIEW_SUCCEEDED, AddView } from "../state";
let ViewComponent = class ViewComponent {
    constructor(actions$, router, store) {
        this.router = router;
        this.store = store;
        this.dead$ = new Subject();
        this.close = new EventEmitter();
        this.store.dispatch(new ClearViewError());
        this.state$ = this.store.select(s => s.viewer);
        actions$.pipe(ofType(VIEW_SUCCEEDED), takeUntil(this.dead$)).subscribe(() => this.close.emit());
    }
    ngOnInit() {
        this.selectedTemplateId = this.plotTemplates.length > 0 ? this.plotTemplates[0].id : null;
        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
            comments: new FormControl(null)
        });
    }
    ngOnDestroy() {
        this.dead$.next();
        this.dead$.complete();
    }
    onBack() {
        this.close.emit();
    }
    onChangeTemplate(e) {
        this.selectedTemplateId = e.target.value;
    }
    onSubmit() {
        if (this.selectedTemplateId != null) {
            const params = { name: this.form.get("name").value, comments: this.form.get("comments").value, projects: this.projects.map(p => p.id), plotTemplateId: this.selectedTemplateId };
            this.store.dispatch(new AddView(params));
            this.router.navigate(['/views']);
        }
    }
};
__decorate([
    Input()
], ViewComponent.prototype, "plotTemplates", void 0);
__decorate([
    Input()
], ViewComponent.prototype, "projects", void 0);
__decorate([
    Output()
], ViewComponent.prototype, "close", void 0);
ViewComponent = __decorate([
    Component({
        selector: "app-view",
        templateUrl: "./view.component.html",
        styleUrls: ["./view.component.css"]
    })
], ViewComponent);
export { ViewComponent };
//# sourceMappingURL=view.component.js.map