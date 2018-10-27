export interface Project {
    file: File[];
    name: string;
    testName: string;
    testType: string;
    channel: string;
    tag: string;
    mass?: number;
    theoreticalCapacity?: number;
    activeMaterialFraction?: number;
    area?: number;
    batteryName: string;
    build: string;
    packSupplier: string;
    cellSupplier: string;
    temperature?: number;
    testOwner: string;
    serialNumber: string;
    technology: string;
    nameplateCapacity: string;
    tester: string;
    procedure: string;
    comments: string;
}
