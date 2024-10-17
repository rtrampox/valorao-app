import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { getPlayerWinStatus } from "~/app/api/lib/isPlayerWinner";
import { getAgentData } from "~/app/api/services/getAgentData";
import { getMapData } from "~/app/api/services/getMapData";
import type { GetAgentDataResponse } from "~/app/api/types/agentData";
import type { GetMapDataResponse } from "~/app/api/types/mapData";
import type { MatchDetailsResponse } from "~/app/api/types/matches";

export function LastMatches({
	lastMatchesData,
	puuid,
}: { lastMatchesData: MatchDetailsResponse[] | null; puuid: string }) {
	const [agentData, setAgentData] = useState<
		GetAgentDataResponse["data"] | null
	>(null);
	const [mapData, setMapData] = useState<GetMapDataResponse["data"] | null>(
		null,
	);

	if (!lastMatchesData)
		return (
			<View className="flex-1 justify-center items-center text-center">
				<Text className="text-muted-foreground text-2xl">Indisponível</Text>
			</View>
		);

	useEffect(() => {
		const playedAgents = lastMatchesData.map(
			(match) => match.players.find((p) => p.subject === puuid)?.characterId,
		);
		const mapId = lastMatchesData.map((m) => m.matchInfo.mapId);

		async function getData() {
			if (!playedAgents) return;
			const $data1 = await getAgentData(playedAgents as string[]);
			setAgentData($data1);

			const $data2 = await getMapData(mapId);
			setMapData($data2);
		}
		getData();
	}, [lastMatchesData, puuid]);

	const isWinner = getPlayerWinStatus(lastMatchesData, puuid);

	const playerMatchData = lastMatchesData.map(
		(m) => m.players.filter((p) => p.subject === puuid).map((p) => p.stats)[0],
	);

	const matchScore = lastMatchesData.map((m) => {
		const playerTeamId = m.players.find((p) => p.subject === puuid)?.teamId;

		const playerTeamScore = m.teams?.find(
			(t) => t.teamId === playerTeamId,
		)?.roundsWon;
		const otherTeamScore = m.teams?.find(
			(t) => t.teamId !== playerTeamId,
		)?.roundsWon;
		return [playerTeamScore, otherTeamScore];
	});

	return (
		<View className="flex-1 justify-center items-center text-center w-full gap-2">
			{lastMatchesData.map((match, i) => (
				<LinearGradient
					key={match.matchInfo.matchId}
					start={{ x: 0, y: 0 }}
					end={{ x: 0.4, y: 0 }}
					dither
					colors={[`${isWinner[i] ? "#38B419" : "#C83535"}`, "transparent"]}
					className={`w-full relative border border-[${isWinner[i] ? "#38B419" : "#C83535"}]`}
					style={{ borderRadius: 10 }}
				>
					{mapData && (
						<Image
							src={mapData[i].listViewIcon}
							className="object-cover absolute top-0 left-0 w-full h-full -z-10 opacity-60"
							style={{ borderRadius: 10, overflow: "hidden" }}
							key={mapData[i].mapUrl}
						/>
					)}
					<View className="text-muted-foreground text-2xl flex flex-row items-center justify-between p-2 h-20">
						<View className="flex flex-row items-center justify-center gap-2">
							{agentData && (
								<Image
									src={agentData[i].displayIcon}
									alt={`${agentData[i].displayName} icon`}
									className="size-16 rounded-lg"
								/>
							)}

							<View className="text-white flex flex-col justify-center items-start">
								<Text className="text-muted-foreground text-sm italic">
									Competitive
								</Text>
								<Text className="text-white text-sm">
									{mapData ? mapData[i].displayName : ""}
								</Text>
								<View className="flex flex-row">
									{matchScore[i].map((s, i2) => (
										<Text className="text-white text-xl" key={s}>
											{i2 > 0 && " "}
											{s} {i2 === 0 && ":"}
										</Text>
									))}
								</View>
							</View>
						</View>
						<Text className="text-white mr-3 text-lg">
							{playerMatchData[i]?.kills} / {playerMatchData[i]?.deaths} /{" "}
							{playerMatchData[i]?.assists}
						</Text>
					</View>
				</LinearGradient>
			))}
		</View>
	);
}
