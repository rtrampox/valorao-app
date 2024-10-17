export interface GetMapDataResponse {
	status: number;
	data: Data[];
}

interface Data {
	uuid: string;
	displayName: string;
	narrativeDescription: any;
	tacticalDescription?: string;
	coordinates?: string;
	displayIcon?: string;
	listViewIcon: string;
	listViewIconTall?: string;
	splash: string;
	stylizedBackgroundImage?: string;
	premierBackgroundImage?: string;
	assetPath: string;
	mapUrl: string;
	xMultiplier: number;
	yMultiplier: number;
	xScalarToAdd: number;
	yScalarToAdd: number;
	callouts?: Callout[];
}

interface Callout {
	regionName: string;
	superRegionName: string;
	location: Location;
}

interface Location {
	x: number;
	y: number;
}
