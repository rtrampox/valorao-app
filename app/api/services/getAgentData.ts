import axios from "axios";
import type { GetAgentDataResponse } from "../types/agentData";

export async function getAgentData(agentIds: string[]) {
	const {
		data: { data },
	} = await axios.get<GetAgentDataResponse>(
		"https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR",
	);

	// Create a map for quick lookup of agents by UUID
	const agentMap = new Map(data.map((agent) => [agent.uuid, agent]));

	// Map over the agentIds and return the corresponding agents
	return agentIds
		.map((agentId) => agentMap.get(agentId))
		.filter((agent) => agent !== undefined);
}
