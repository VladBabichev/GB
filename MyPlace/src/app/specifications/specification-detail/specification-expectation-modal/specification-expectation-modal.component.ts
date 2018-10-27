import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: "./specification-expectation-modal.component.html",
    styleUrls: ["specification-expectation-modal.component.css"]
})
export class SpecificationExpectationModalComponent implements OnInit {

    @Output() public expectationAdded = new EventEmitter<any>();

    public title: string;
	public form: FormGroup;
	public targetType: string;
	public unit: string;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            measureIndex: null,
            measureValue: null
        });
    }

    onCreateExpectation(): void {
        this.expectationAdded.emit(this.form.value);
        this.activeModal.close();
    }
}