export interface specificationsResult {
    data: specification[];
}

export interface specification {
    id: number;
    name: string;
    target: number;
    unit: string;
}