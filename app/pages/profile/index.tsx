import { View, Text, Image, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { getUserProfile } from "~/app/api/services/getProfile";
import type { PlayerProfile } from "~/app/api/types/profile";
import Skeleton from "react-native-reanimated-skeleton";
import { Clock, RefreshCw } from "lucide-react-native";
import { currencies } from "~/app/assets/valorant/currencies/currencies";
import { getUserLastMatches } from "~/app/api/services/getUserLastMatches";
import type { MatchDetailsResponse } from "~/app/api/types/matches";
import type BottomSheet from "@gorhom/bottom-sheet";
import { OptionsSheet } from "./components/optionsSheet";
import { LastMatches } from "./components/lastMatches";

export default function ShowToken() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [profileData, setProfileData] = useState<PlayerProfile | null>(null);
	const [lastMatches, setLastMatches] = useState<MatchDetailsResponse[] | null>(
		null,
	);

	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		async function getProfile() {
			const profile = await getUserProfile();
			const lastMatches = await getUserLastMatches();
			setLastMatches(lastMatches);
			setProfileData(profile);
			setIsLoading(false);
		}
		getProfile();
	}, []);

	return (
		<View className="flex-col flex-1 justify-center items-center gap-3 bg-background mb-14 px-5">
			<Skeleton
				isLoading={isLoading}
				containerStyle={{
					width: "100%",
					height: 128,
					position: "absolute",
					top: 8,
				}}
				boneColor="#333"
				highlightColor="#444"
				animationDirection="horizontalRight"
				layout={[
					{ key: "viewBox", width: "auto", height: 128, marginBottom: 6 },
					{ key: "viewBox", width: "auto", height: 128, marginBottom: 6 },
					{ key: "viewBox", width: "auto", height: 128, marginBottom: 6 },
				]}
			>
				{profileData && (
					<View className="items-center justify-center absolute top-2 w-full gap-3">
						<View className="w-full h-32 bg-slate-900/30 border border-muted-foreground justify-between rounded-lg flex-row gap-2 px-4">
							<View className="flex-row gap-2 items-center">
								<Image
									source={{ uri: profileData.playerCard.data.displayIcon }}
									style={{ width: 55, height: 55, resizeMode: "contain" }}
								/>

								<View className="flex-col">
									<View className="text-center">
										<Text className="text-white text-base font-semibold">
											{profileData.playerName}
										</Text>
										{profileData.playerTitle && (
											<Text className="text-muted-foreground text-sm italic">
												{profileData.playerTitle.data
													? profileData.playerTitle.data.titleText
													: ""}
											</Text>
										)}
									</View>
									<View className="flex-row gap-1">
										<Image
											source={{ uri: profileData.playerRank.smallIcon }}
											style={{ width: 20, height: 20, resizeMode: "contain" }}
										/>
										<View className="flex-row gap-1 items-center">
											<Text className="text-white capitalize">
												{profileData.playerRank.tierName.toLowerCase()}
											</Text>
											<Text className="text-muted-foreground text-sm italic">
												{profileData.RankedRating}/100
											</Text>
										</View>
									</View>
								</View>
							</View>

							<View className="bg-muted-foreground w-[1px] h-full" />

							<View className="text-end items-center justify-center mr-5">
								<View className="flex-col gap-2">
									<View className="text-end">
										<View className="flex-row gap-1 items-center">
											{currencies[
												Object.keys(profileData.playerWallet.Balances)[0]
											]()}
											<Text className="text-white text-end font-semibold">
												{
													profileData.playerWallet.Balances[
														Object.keys(profileData.playerWallet.Balances)[0]
													]
												}
											</Text>
										</View>
										<View className="flex-row gap-1 items-center">
											{currencies[
												Object.keys(profileData.playerWallet.Balances)[1]
											]()}
											<Text className="text-white text-end font-semibold">
												{
													profileData.playerWallet.Balances[
														Object.keys(profileData.playerWallet.Balances)[1]
													]
												}
											</Text>
										</View>
										<View className="flex-row gap-1 items-center">
											{currencies[
												Object.keys(profileData.playerWallet.Balances)[2]
											]()}
											<Text className="text-white text-end font-semibold">
												{
													profileData.playerWallet.Balances[
														Object.keys(profileData.playerWallet.Balances)[2]
													]
												}
											</Text>
										</View>
									</View>
								</View>
							</View>
						</View>

						<View className="flex-row gap-2 items-center justify-center">
							<View className="flex-row gap-2 items-center justify-center">
								<View className="flex-row items-center justify-center bg-neutral-800 rounded-full p-3">
									<Clock size={15} color="white" />
									<Text className="text-white items-center text-center">
										{" "}
										Últimas partidas:{" "}
									</Text>
								</View>
							</View>
							<TouchableOpacity
								activeOpacity={0.8}
								className="size-12 items-center justify-center p-3 bg-neutral-800 rounded-full"
							>
								<RefreshCw size={15} color="white" />
							</TouchableOpacity>
						</View>
						<LastMatches
							lastMatchesData={lastMatches}
							puuid={profileData.puuid}
						/>
					</View>
				)}
			</Skeleton>

			<OptionsSheet
				bottomSheetRef={bottomSheetRef}
				isLoggingOut={isLoggingOut}
				profileData={profileData}
				setIsLoggingOut={setIsLoggingOut}
			/>
		</View>
	);
}
