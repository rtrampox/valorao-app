import { View, Text } from "react-native";
import { Button } from "~/components/button";
import { clearCache } from "~/app/api/services/logout";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LogOut } from "~/app/api/services/logout";
import type { PlayerProfile } from "~/app/api/types/profile";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee, { AuthorizationStatus } from "@notifee/react-native";

export function OptionsSheet({
	profileData,
	setIsLoggingOut,
	isLoggingOut,
	bottomSheetRef,
}: {
	profileData: PlayerProfile | null;
	setIsLoggingOut: (isLoggingOut: boolean) => void;
	isLoggingOut: boolean;
	bottomSheetRef: React.RefObject<BottomSheet>;
}) {
	const [notifState, setNotifState] = useState("");

	async function enableNotifications() {
		const perm = await notifee.requestPermission();
		if (perm.authorizationStatus === AuthorizationStatus.DENIED)
			return await AsyncStorage.setItem(
				"user/permissions/notification",
				"false",
			);
		if (perm.authorizationStatus === AuthorizationStatus.AUTHORIZED)
			return await AsyncStorage.setItem(
				"user/permissions/notification",
				"true",
			);
	}
	async function logout() {
		setIsLoggingOut(true);
		await LogOut();
		setIsLoggingOut(false);
		router.replace("/");
	}
	useEffect(() => {
		async function getNotificationState() {
			const state = await AsyncStorage.getItem("user/permissions/notification");
			if (state) setNotifState(state);
			else setNotifState("false");
		}
		getNotificationState();
	}, []);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			snapPoints={
				profileData?.playerName === "OPULENCE#RENY" ? [55, 380] : [55, 280]
			}
			handleIndicatorStyle={{ backgroundColor: "white" }}
			backgroundStyle={{ backgroundColor: "#262626" }}
			style={{ marginHorizontal: 7 }}
		>
			<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
				<View className="w-full gap-4 px-5">
					<Text className="text-white text-center font-semibold">Opções</Text>
					{profileData?.playerName === "OPULENCE#RENY" && (
						<View className="text-center w-full gap-2">
							<Text className="text-white text-center">
								Para desenvolvedores:
							</Text>
							<Button
								onPress={() => router.navigate("/_sitemap")}
								variant="outline-dark"
								className="flex-col"
							>
								<Button.Title className="text-white">Mapa do Site</Button.Title>
							</Button>
							<Button
								onPress={() => router.navigate("/pages/profile/tab")}
								variant="outline-dark"
								className="flex-col"
							>
								<Button.Title className="text-white">
									Informações da sua conta
								</Button.Title>
							</Button>
							<View className="h-[1px] bg-muted-foreground" />
						</View>
					)}
					{notifState === "false" && (
						<Button
							onPress={enableNotifications}
							variant="outline-dark"
							className="flex-col"
						>
							<Button.Title className="text-muted-foreground">
								Ativar Notificações
							</Button.Title>
						</Button>
					)}

					<Button
						onPress={() => clearCache()}
						variant="outline-dark"
						className="flex-col"
					>
						<Button.Title className="text-muted-foreground">
							Limpar Cache
						</Button.Title>
					</Button>

					<View>
						<Text className="text-white text-sm text-center -m-3">
							O aplicativo deve ser reiniciado para fazer efeito.
						</Text>
					</View>
					<View className="h-[1px] bg-muted-foreground" />
					<Button
						onPress={() => logout()}
						variant="destructive-outlined"
						isLoading={isLoggingOut}
					>
						<Button.Title className="text-white">Sair</Button.Title>
					</Button>
				</View>
			</BottomSheetView>
		</BottomSheet>
	);
}
