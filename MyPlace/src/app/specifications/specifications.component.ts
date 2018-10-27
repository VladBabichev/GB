import { Component, OnInit } from "@angular/core";

import { environment } from "../../environments/environment";
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';

import { SpecificationService } from "../shared/services/specification.service";

@Component({
  selector: 'app-battery-specification',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.css']
})
export class SpecificationsComponent implements OnInit {
  
  specifications: DataSource;

  constructor(
    private specificationService: SpecificationService) {
  }

  ngOnInit(): void {
    this.specifications = this.getDataSource(); 
  }

  private getDataSource(): any {
    var baseUrl = `${environment.serverBaseUrl}api`;
    
    return {
      store: createStore({
        key: 'id',
        loadUrl: `${baseUrl}/specifications`,
        updateUrl: `${baseUrl}/specifications`,
        deleteUrl: `${baseUrl}/specifications`,
        onBeforeSend: function(method, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
        }
      })
    }
  }
}