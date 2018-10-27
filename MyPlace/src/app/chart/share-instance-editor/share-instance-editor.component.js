var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventEmitter, Input, Output } from "@angular/core";
let ShareInstanceEditorComponent = class ShareInstanceEditorComponent {
    constructor(router, store) {
        this.router = router;
        this.store = store;
        this.cancel = new EventEmitter();
        this.save = new EventEmitter();
        this.store.select(s => s.chart).subscribe(s => s.plotType === -1 ? this.objectIdValue = s.plotTemplateId
            : s.plotType === -2 ? this.objectIdValue = s.viewId : null);
    }
    setEmail(e) {
        this.email = e.target.value;
    }
    onCancel() {
        this.cancel.emit();
    }
    onSave() {
        if (this.email != '')
            this.save.emit({ email: this.email, objectIds: [this.objectIdValue] });
    }
};
__decorate([
    Input()
], ShareInstanceEditorComponent.prototype, "objectIdValue", void 0);
__decorate([
    Output()
], ShareInstanceEditorComponent.prototype, "cancel", void 0);
__decorate([
    Output()
], ShareInstanceEditorComponent.prototype, "save", void 0);
ShareInstanceEditorComponent = __decorate([
    Component({
        selector: "app-share-instance-editor",
        templateUrl: "share-instance-editor.component.html",
        styleUrls: ["share-instance-editor.component.css"]
    })
], ShareInstanceEditorComponent);
export { ShareInstanceEditorComponent };
//# sourceMappingURL=share-instance-editor.component.js.map