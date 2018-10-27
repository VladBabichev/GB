import { AdminService } from "../../admin/admin.service";
import { Component, ViewChild } from '@angular/core';
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../../state";
import { Company, User } from "./../model/interfaces";
import * as Utils from "../../shared/utils";

interface ISelectionChangedEvent {
    component: any; // DxDataGrid;
    currentSelectedRowKeys: number;
    selectedRowsData: Company;
}

@Component({
    templateUrl: "./admin-companies.component.html",
    selector: "app-admin-companies",
    providers: [AdminService]
})

export class AdminCompanyComponent {
    companies: Company[];

    constructor(private adminSrv: AdminService, actions$: Actions, private store: Store<AppState>) {
        //this.store.select(s => s.admin).subscribe(r => this.user=r.user);
        // this.store.select(s => s.admin).subscribe(r => this.companies = r.companies);  
    }

    ngOnInit() {
        this.getComponies();
    }

    onRefresh(): void {
        this.getComponies();
    }

    onRowRemoved(e) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.deleteCompany({ companyId: e.key, companyName: "" }).subscribe();
            resolve();
        });
    }

    onRowUpdated(e) {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveCompany({ companyId: e.key, companyName: e.data.companyName }).subscribe(resp => resolve(resp), error => reject(error));
            promise.then((result: any) => {
                e.key = result;
                this.getComponies();
            });
            promise.catch(err => {
                Utils.errorMessage(err.message);
            });
        });
    }

    onRowInserted(e) {
        var d: Company = this.getCompanyById(e.key);
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveCompany({ companyId: 0, companyName: e.data.companyName }).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result: any) => {
            d.companyId = result;
            e.component.selectRows([result], false);
            this.getComponies();
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });

    }
    //  =================================================================================
    //  private methods
    //  =================================================================================
    private getCompanyById(id: any): Company {
        var result: Company;
        for (var i = 0; i < this.companies.length; i++) {
            if (this.companies[i].companyId == id) {
                result = this.companies[i];
                break;
            }
        }
        return result;
    }
    //
    getComponies(): void {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getCompanies(0).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result: Company[]) => {
            this.companies = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }

}