import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ModalComponent } from "./modal/modal.component";
import { SpecificationService } from "./services/specification.service";
import { TranslatePipe } from "../core/pipes/translation.pipe";

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot()
    ],
    declarations: [
        TranslatePipe,
        ModalComponent,
    ],
    exports: [
        TranslatePipe,
        ModalComponent
    ]
})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [
                SpecificationService
            ]
        }
    }
}
