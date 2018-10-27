import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { MeasurementService } from '../state/measurement.service';

@Injectable({
    providedIn: "root"
})
export class MeasurementDetailResolver implements Resolve<any> {

    constructor(
        private router: Router,
        private measurementService: MeasurementService) {
    }

    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const measurementId = +route.paramMap.get('id');
        return this.fetchMeasurementDetails(measurementId)
            .pipe(
                switchMap((measurement: any) => {
                    if (!measurement) {
                        this.router.navigateByUrl('specifications');

                        return of(null);
                    }

                    return of(measurement);
                })
            );
    }

    private fetchMeasurementDetails(measurementId: number): Observable<any> {
        return this.measurementService.getMeasurement(measurementId)
            .pipe(
                switchMap((res: any) => {
                    if (!res)
                        return of(null);

                    return of(res);
                }),
                catchError(() => of(null))
            );
    }
}