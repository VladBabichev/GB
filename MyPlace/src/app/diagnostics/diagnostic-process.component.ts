import { Component, OnInit } from "@angular/core";

//import notify from 'devextreme/ui/notify';
//import * as Utils from "../../shared/utils";

@Component({
    templateUrl: "./diagnostic-process.component.html",
	styleUrls: ["./diagnostic-process.component.css"]
})
export class DiagnosticProcessComponent implements OnInit {
    //form: FormGroup;
    //username: FormControl;
    //password: FormControl;
    //rememberMe: FormControl;   
    //inProgress: boolean = false;

    constructor() {       
    }

    ngOnInit(): void {
        //this.username = new FormControl(null, Validators.required);
        //this.password = new FormControl(null);
        //this.rememberMe = new FormControl(false);

        //this.form = new FormGroup({
        //    username: this.username,
        //    password: this.password,
        //    rememberMe: this.rememberMe
        //});
    }

    //login(): void {
    //    if (this.form.invalid) {
    //        return;
    //    }
    //    this.inProgress = true;

    //    this.srv.login(this.username.value, this.password.value, this.rememberMe.value)
    //        .pipe(finalize(() => this.inProgress = false))
    //        .subscribe(
    //            (response : AuthResponse) => this.store.dispatch(new LoginSucceeded(response.username, response.isAdmin, response.isOwner, response.isUndefined)), 
    //            error => Utils.errorMessage(error.error.message)
    //        );
    //}
}
