import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SpecificationsComponent } from './specifications.component';
import { SpecificationDetailComponent } from "./specification-detail/specification-detail.component";
import { SpecificationDetailResolver } from "./specification-detail/specification-detail.resolver";

const routes: Routes = [
    {
      path: '',
      component: SpecificationsComponent
    },
    {
      path: 'add',
      component: SpecificationDetailComponent
    },
    {
      path: ':id',
      component: SpecificationDetailComponent,
      resolve: { specification: SpecificationDetailResolver }
    }
];
  
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class SpecificationsRouteModule {}
  