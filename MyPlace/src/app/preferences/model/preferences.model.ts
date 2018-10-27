export interface UserPreferences {
	chartPreferences: ChartPreferences,
	otherPreferences: OtherPreferences,
    projectViewerPreferences: any
}

export interface ChartPreferences {
    pointSize?: number;
    xLineVisible: boolean;
    yLineVisible: boolean;
    showLegend: boolean;
    fontSize?: number;
    fontFamilyName: string,
    paletteColors: ChartPaletteColor[];
}

export interface ChartPaletteColor {
    color: string;
}

export interface OtherPreferences {
    locale: string,
	maxSelectedProjectCount: number
}

export class UserLocale {
    name: string;
    value: string;
}