import { Injectable } from "@angular/core";
import { ConfirmPopupComponent } from "./confirm-popup.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, from } from "rxjs";

@Injectable()
export class PopupService {
    constructor(private modalService: NgbModal) {
    }

    showConfirm(title?: string, message?: string): Observable<any> {
        const modal = this.modalService.open(ConfirmPopupComponent);
        modal.componentInstance.title = title ;
        modal.componentInstance.message = message;

        return from(modal.result);
    }
}