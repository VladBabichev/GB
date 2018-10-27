import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MeasurementDetailComponent } from "./measurement-detail/measurement-detail.component";
import { MeasurementComponent } from "./measurement.component";
import { MeasurementDetailResolver } from "./measurement-detail/measurement-detail.resolver";

const routes: Routes = [
    {
      path: '',
      component: MeasurementComponent
    },
    {
      path: 'add',
      component: MeasurementDetailComponent
    },
    {
      path: ':id',
      component: MeasurementDetailComponent,
      resolve: { measurement: MeasurementDetailResolver }
    }
];
  
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class MeasurementsRouteModule {}
  