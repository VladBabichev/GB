import { PipeTransform, Pipe } from "@angular/core";

import { formatMessage } from "devextreme/localization";

@Pipe({
    name: 'translate',
    pure: false
  })
  export class TranslatePipe implements PipeTransform {

    transform(key: any, ...args: any[]): any {
        return formatMessage(key, args) || key;
    }
}