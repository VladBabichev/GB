export interface measurement {
	measurementId: number;
	projectId: number;
	specificationId: number;
	measure: number;
	value: number;
}

export interface specification {
	id: number;
	name: string;
    measurements: measurement[];
	targetTypeName: string;
    unit: string;
}

export interface measureResult {
    projectId: number;  
    spec: specification[];
}