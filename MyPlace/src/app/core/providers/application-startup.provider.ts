import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { locale, loadMessages } from 'devextreme/localization';
//import 'devextreme-intl';
import enMessages from "devextreme/localization/messages/en.json";

import { environment } from "../../../environments/environment";
import { map, finalize } from "rxjs/operators";
import { Observable, forkJoin } from "rxjs";

export function ApplicationStartupProviderFactory(provider: ApplicationStartupProvider) {
    return () => provider.load();
}

@Injectable()
export class ApplicationStartupProvider {
    constructor(private http: HttpClient) {
    }

    load() : Promise<any> {
       
        return new Promise((resolve, reject) => {

            let currentLocale = localStorage.getItem("locale");
            currentLocale = currentLocale ? currentLocale : "en";

            forkJoin([
                `./assets/localization/${currentLocale}.json`,
                `./assets/localization/${currentLocale}-extended.json`]
                .map(item => this.http.get(item))
            )
            .pipe(
                finalize(() => {
                    locale(currentLocale);
                    resolve(true);
                })
            )
            .subscribe(response => {
                response.map(dictionary => loadMessages(dictionary))
            });
        });
    }
}
