import axios from "axios";
import type { GetMapDataResponse } from "../types/mapData";

export async function getMapData(mapIds: string[]) {
	const {
		data: { data },
	} = await axios.get<GetMapDataResponse>(
		"https://valorant-api.com/v1/maps?language=pt-BR",
	);

	// Create a map for quick lookup of agents by UUID
	const mapMap = new Map(data.map((m) => [m.mapUrl, m]));

	// Map over the agentIds and return the corresponding agents
	return mapIds
		.map((mapId) => mapMap.get(mapId))
		.filter((agent) => agent !== undefined);
}
