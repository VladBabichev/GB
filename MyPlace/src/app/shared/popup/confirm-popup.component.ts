import { Component, Input, OnInit, EventEmitter  } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-confirm",
    styles: [`
    .modal-header {
        border-bottom: none;
    }
    `],
    templateUrl: "confirm-popup.component.html",
})
export class ConfirmPopupComponent implements OnInit {
    @Input() title: string = "Modal with component";
    @Input() message: string = "Message here...";
    onHide: EventEmitter<boolean>;

    constructor(public activeModal: NgbActiveModal) { }

    public ngOnInit(): void {
        this.onHide = new EventEmitter<boolean>();
    }

    public onConfirm() {
        this.onHide.emit(true);
        this.activeModal.close(true);
    }
}