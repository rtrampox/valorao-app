import {
	View,
	Image,
	SectionList,
	Text,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { cacheStorefront } from "../../api/services/storefront";
import { useEffect, useState } from "react";
import notifee, { AndroidImportance } from "@notifee/react-native";
import messaging, {
	type FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import Skeleton from "react-native-reanimated-skeleton";
import { LinearGradient } from "expo-linear-gradient";
import CountdownPage from "~/components/countdown";
import {
	getNotificationTokenLocal,
	storeNotificationToken,
} from "~/app/api/services/storeNotificationToken";
import { getPuuid } from "~/app/api/services/storePuuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Storefront } from "~/app/api/types/storefrontResponse";

type DataBody = {
	title: string;
	data: {
		uuid: string;
		displayIcon: string;
		displayName: string;
		cost: number;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		contentTierData: any;
		contentTier: string;
		theme: string;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		raw: any;
	}[];
};

export default function StorefrontPage() {
	const [data, setData] = useState<DataBody[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	async function displayNotification(
		message: FirebaseMessagingTypes.RemoteMessage,
	) {
		const channelId = await notifee.createChannel({
			id: "default",
			name: "Default Channel",
			vibration: true,
			importance: AndroidImportance.DEFAULT,
		});

		await notifee.displayNotification({
			id: message.messageId,
			title: message.notification?.title || "Valorao",
			body: message.notification?.body,
			android: { channelId },
		});
	}

	messaging().onMessage(displayNotification);
	messaging().setBackgroundMessageHandler(displayNotification);

	useEffect(() => {
		async function requestAccess() {
			const getState = await AsyncStorage.getItem(
				"user/permissions/notification",
			);
			if (getState && getState === "false") return;
			const perm = await notifee.requestPermission();
			if (perm.authorizationStatus === 0)
				return await AsyncStorage.setItem(
					"user/permissions/notification",
					"false",
				);
			if (perm.authorizationStatus === 1)
				return await AsyncStorage.setItem(
					"user/permissions/notification",
					"true",
				);
		}

		async function getStorefront() {
			const storefront = await cacheStorefront();

			const groupedData: { [key: string]: DataBody } = {};

			for (const item of storefront?.response as Storefront[]) {
				if (!groupedData[item.weapon.displayName]) {
					groupedData[item.weapon.displayName] = {
						title: item.weapon.displayName,
						data: [],
					};
				}
				groupedData[item.weapon.displayName].data.push({
					uuid: item.weapon.uuid,
					displayIcon:
						item.weapon.chromas[0].displayIcon || item.weapon.displayIcon,
					displayName: item.weapon.displayName,
					contentTier: item.weapon.contentTierUuid,
					contentTierData: item.contentTierData,
					theme: item.weapon.themeUuid,
					cost: item.cost,
					raw: item.weapon,
				});
			}

			const dataBody: DataBody[] = Object.values(groupedData);
			setData(dataBody);
			setIsLoading(false);
		}

		async function onAppBootstrap() {
			await messaging().registerDeviceForRemoteMessages();
			const token = await messaging().getToken();
			const puuid = await getPuuid();
			const findToken = await getNotificationTokenLocal();
			if (!findToken) {
				await storeNotificationToken(puuid as string, token);
			}
		}

		requestAccess();
		getStorefront();
		onAppBootstrap();
	}, []);

	return (
		<View className="mx-3 mt-2">
			<Skeleton
				isLoading={isLoading}
				containerStyle={{
					width: "100%",
					height: "auto",
					gap: 8,
					marginBottom: 60,
				}}
				boneColor="#333"
				highlightColor="#444"
				animationDirection="horizontalRight"
				layout={[
					{
						key: "storeCountdown",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: 200,
					},
					{
						key: "storeItem1",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: 200,
					},
					{
						key: "storeItem2",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: 200,
					},
					{
						key: "storeItem3",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: 200,
					},
					{
						key: "storeItem4",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: 200,
					},
				]}
			>
				<CountdownPage />
				<ScrollView className="mt-2" showsVerticalScrollIndicator={false}>
					<View style={{ minHeight: 975 }}>
						{data.map((item) => {
							return item.data.map((data) => {
								return (
									<View style={{ marginBottom: 13 }} key={data.uuid}>
										<TouchableOpacity activeOpacity={0.8} style={{ gap: 6 }}>
											<View
												style={{
													justifyContent: "center",
													alignItems: "center",
													width: "auto",
													height: 200,
													backgroundColor: `#${data.contentTierData.highlightColor}`,
												}}
												className="rounded-lg overflow-hidden"
											>
												<LinearGradient
													colors={[
														`#${data.contentTierData.highlightColor}`,
														"transparent",
													]}
													dither={true}
													className="absolute top-0 left-0 w-full h-11"
												/>
												<Image
													source={{
														uri:
															data.contentTierData.displayIcon || "defaultURI",
													}}
													style={{
														width: "100%",
														height: "100%",
														resizeMode: "contain",
														position: "absolute",
													}}
													className="opacity-30"
												/>
												<Image
													source={{ uri: data.displayIcon || "defaultURI" }}
													style={{
														width: 300,
														height: 250,
														resizeMode: "contain",
													}}
												/>
												<Text className="text-white text-xl absolute bottom-1 left-3">
													{data.displayName}{" "}
													<Image
														source={{
															uri:
																data.contentTierData.displayIcon ||
																"defaultURI",
														}}
														style={{
															width: 17,
															height: 17,
															resizeMode: "contain",
															marginLeft: 5,
														}}
													/>
												</Text>
												<Text className="text-white text-xl absolute bottom-1 right-3 flex-row gap-3">
													<Image
														source={require("../../assets/valorant/currencies/valorantPointsDisplayIcon.png")}
														style={{
															width: 17,
															height: 17,
															resizeMode: "contain",
															marginLeft: 5,
														}}
													/>{" "}
													{data.cost}
												</Text>
											</View>
										</TouchableOpacity>
									</View>
								);
							});
						})}
					</View>
				</ScrollView>
			</Skeleton>
		</View>
	);
}
