var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DxFileUploaderComponent } from "devextreme-angular";
import { SendFeedback } from "../state";
import { environment } from "../../environments/environment";
let FeedbackComponent = class FeedbackComponent {
    constructor(store) {
        this.store = store;
        this.state$ = this.store.select(s => s.feedback);
    }
    ngOnInit() {
        this.form = new FormGroup({
            comment: new FormControl(null, [Validators.required, Validators.maxLength(16000)])
        });
    }
    onSubmit() {
        this.store.dispatch(new SendFeedback(this.form.value.comment, this.getFile()));
    }
    onClear() {
        this.fileUploader.instance.reset();
    }
    isFileTooBig() {
        var file = this.getFile();
        if (!file)
            return false;
        return file.size > environment.maxFeedbackFilesize;
    }
    isFileSelected() {
        return this.getFile() != null;
    }
    getFile() {
        if (!this.fileUploader.value)
            return null;
        var file = this.fileUploader.value[0];
        if (!file)
            return null;
        return file;
    }
};
__decorate([
    ViewChild(DxFileUploaderComponent)
], FeedbackComponent.prototype, "fileUploader", void 0);
FeedbackComponent = __decorate([
    Component({
        templateUrl: "./feedback.component.html",
        styleUrls: ["./feedback.component.css"]
    })
], FeedbackComponent);
export { FeedbackComponent };
//# sourceMappingURL=feedback.component.js.map