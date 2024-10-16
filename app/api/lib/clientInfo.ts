import axios from "axios";
import { version } from "react";

interface ClientInfoGETResponse {
	status: number;
	data: {
		manifestId: string;
		branch: string;
		version: string;
		buildVersion: string;
		engineVersion: string;
		riotClientVersion: string;
		riotClientBuild: string;
		buildDate: string;
	};
}

const clientPlatform =
	"ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";

const clientInfo = async () => {
	const { data } = await axios.get<ClientInfoGETResponse>(
		"https://valorant-api.com/v1/version",
	);
	return {
		version: data.data.version,
		build: data.data.riotClientVersion,
		platform: clientPlatform,
	};
};

export { clientInfo };
