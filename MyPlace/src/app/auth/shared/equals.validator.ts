import { AbstractControl, ValidatorFn } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

export function createEqualsValidator(target: AbstractControl, until$: Subject<any>): ValidatorFn {
    let subscribed = false;

    return (control) => {
        if (!subscribed) {
            target.valueChanges
                .pipe(takeUntil(until$))
                .subscribe(() => control.updateValueAndValidity());

            subscribed = true;
        }

        return control.value === target.value ? null : { equals: true };
    };
}
