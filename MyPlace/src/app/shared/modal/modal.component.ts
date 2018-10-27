import { Component, Input } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-modal",
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent {
    @Input() public title: string;
    @Input() public modalType: string;
    @Input() public activeModal: NgbActiveModal;

    public get modalClass(): string {
        return `icon-${this.modalType}`;
    }
}