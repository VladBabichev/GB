var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AdminService } from "../../admin/admin.service";
import { Component } from '@angular/core';
import * as Utils from "../../shared/utils";
let AdminCompanyComponent = class AdminCompanyComponent {
    constructor(adminSrv, actions$, store) {
        this.adminSrv = adminSrv;
        this.store = store;
        //this.store.select(s => s.admin).subscribe(r => this.user=r.user);
        // this.store.select(s => s.admin).subscribe(r => this.companies = r.companies);  
    }
    ngOnInit() {
        this.getComponies();
    }
    onRefresh() {
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
            promise.then((result) => {
                e.key = result;
                this.getComponies();
            });
            promise.catch(err => {
                Utils.errorMessage(err.message);
            });
        });
    }
    onRowInserted(e) {
        var d = this.getCompanyById(e.key);
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.saveCompany({ companyId: 0, companyName: e.data.companyName }).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
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
    getCompanyById(id) {
        var result;
        for (var i = 0; i < this.companies.length; i++) {
            if (this.companies[i].companyId == id) {
                result = this.companies[i];
                break;
            }
        }
        return result;
    }
    //
    getComponies() {
        var promise = new Promise((resolve, reject) => {
            this.adminSrv.getCompanies(0).subscribe(resp => resolve(resp), error => reject(error));
        });
        promise.then((result) => {
            this.companies = result;
        });
        promise.catch(err => {
            Utils.errorMessage(err.message);
        });
    }
};
AdminCompanyComponent = __decorate([
    Component({
        templateUrl: "./admin-companies.component.html",
        selector: "app-admin-companies",
        providers: [AdminService]
    })
], AdminCompanyComponent);
export { AdminCompanyComponent };
//# sourceMappingURL=admin-companies.component.js.map