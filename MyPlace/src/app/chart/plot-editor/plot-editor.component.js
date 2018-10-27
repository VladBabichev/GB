var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventEmitter, Input, Output } from "@angular/core";
let PlotEditorComponent = class PlotEditorComponent {
    constructor() {
        this.cancel = new EventEmitter();
        this.save = new EventEmitter();
    }
    onCancel() {
        this.cancel.emit();
    }
    onSave(plotTemplates) {
        this.save.emit(this.plotSettings.find(t => t.name === plotTemplates.value));
    }
};
__decorate([
    Input()
], PlotEditorComponent.prototype, "plotSettings", void 0);
__decorate([
    Input()
], PlotEditorComponent.prototype, "selectedTemplateName", void 0);
__decorate([
    Output()
], PlotEditorComponent.prototype, "cancel", void 0);
__decorate([
    Output()
], PlotEditorComponent.prototype, "save", void 0);
PlotEditorComponent = __decorate([
    Component({
        selector: "app-plot-editor",
        templateUrl: "plot-editor.component.html",
        styleUrls: ["plot-editor.component.css"]
    })
], PlotEditorComponent);
export { PlotEditorComponent };
//# sourceMappingURL=plot-editor.component.js.map