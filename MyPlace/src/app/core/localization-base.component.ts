import { formatMessage } from 'devextreme/localization';

export class LocalizationBaseComponent {
    public translate(key: string) : string {
        return formatMessage(key, [])
    }
}