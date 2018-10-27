import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { SpecificationService } from '../../shared/services/specification.service';

@Injectable({
    providedIn: "root"
})
export class SpecificationDetailResolver implements Resolve<any> {

    constructor(
        private router: Router,
        private specificationService: SpecificationService) {
    }

    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const specificationId = +route.paramMap.get('id');
        return this.fetchSpecificationDetails(specificationId)
            .pipe(
                switchMap((specification: any) => {
                    if (!specification) {
                        this.router.navigateByUrl('specifications');

                        return of(null);
                    }

                    return of(specification);
                })
            );
    }

    private fetchSpecificationDetails(specificationId: number): Observable<any> {
        return this.specificationService.getBatterySpecification(specificationId)
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