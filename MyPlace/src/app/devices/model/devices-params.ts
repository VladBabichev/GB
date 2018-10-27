export interface Device {
	deviceId: string;
	systemID: string;
	testChannels: number;
	ipAddress: string;
	port: number;
	measurementDate: string;
}

export interface Channel {
    chan: number;
    rf1: string;
    rf2: string;
    stat: number;
    lastRec: number;
    cycle: number;
    step: number;
    testTime: string;
    stepTime: string;
    capacity: string;
    energy: string;
    current: string;
    voltage: string;
    testerTime: string;
	macNetError: number;
	statName: string;
	rf1name: string;
	rf22name: string;
	backColor: string;
	foreColor: string;
}

