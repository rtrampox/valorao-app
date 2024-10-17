import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { WebView } from "react-native-webview";
import CookieManager from "@react-native-cookies/cookies";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { getAccToken, storeAccToken } from "./api/services/storeAccessToken";
import { Loading } from "~/components/loading";
import { getPuuid, storePuuid } from "./api/services/storePuuid";
import { Button } from "~/components/button";
import { getEntitlements, getEntToken } from "./api/getEntitlements";
import { storeSsidCookie } from "./api/services/storeSsidCookie";
import * as Updates from "expo-updates";
import { clearCache } from "./api/services/logout";

export default function Screen() {
	const [hasToken, setHasToken] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	let webViewRef: WebView | null = null;

	const bottomSheetModalRef = React.useRef<BottomSheet>(null);
	const snapPoints = React.useMemo(() => ["10%", "98%"], []);

	const handlePresentModalPress = React.useCallback(() => {
		bottomSheetModalRef.current?.expand();
	}, []);

	const uri = {
		url: "https://auth.riotgames.com/authorize",
		redirectUri: "http://localhost/redirect",
		clientId: "riot-client",
		resposeType: "token id_token",
		scope: "openid link ban lol_region account",
	};

	React.useEffect(() => {
		async function onFetchUpdateAsync() {
			try {
				const update = await Updates.checkForUpdateAsync();

				if (update.isAvailable) {
					await clearCache();
					await Updates.fetchUpdateAsync();
					await Updates.reloadAsync();
				}
			} catch (error) {
				// You can also add an alert() to see the error message in case of an error when fetching updates.
				alert(`Error fetching latest Expo update: ${error}`);
			}
		}

		async function getLoggedInData() {
			const token = await getAccToken();
			const puuid = await getPuuid();
			const enttoken = await getEntToken();
			if (token && !(token.expiry < Date.now()) && puuid && enttoken) {
				setHasToken(true);
				return router.replace("/pages/storefront");
			}
			await onFetchUpdateAsync();
			setIsLoading(false);
			return setHasToken(false);
		}
		getLoggedInData();
		return () => {
			webViewRef = null;
		};
	}, [webViewRef]);

	React.useEffect(() => {
		if (!isLoading) handlePresentModalPress();
	}, [isLoading, handlePresentModalPress]);

	if (isLoading) return <Loading />;
	if (!hasToken)
		return (
			<View className="flex-1 justify-center bg-black">
				<View className="flex-1 items-center justify-center p-10 gap-2">
					<Text className="text-center">
						Para continuar, é necessário fazer login em sua conta Riot.
					</Text>
					<Button onPress={handlePresentModalPress}>
						<Button.Title>Voltar ao login</Button.Title>
					</Button>
					<BottomSheet
						keyboardBehavior="interactive"
						ref={bottomSheetModalRef}
						index={1}
						snapPoints={snapPoints}
						enableContentPanningGesture={false}
					>
						<BottomSheetView className="flex-1">
							<Text className="text-black p-2 text-center">
								Lembre de clicar em "Manter login" e aceitar os cookies, assim
								não será necessário fazer login novamente.
							</Text>
							<WebView
								ref={(ref) => {
									webViewRef = ref;
								}}
								source={{
									uri: `${uri.url}?client_id=${uri.clientId}&redirect_uri=${uri.redirectUri}&response_type=${uri.resposeType}&nonce=1&scope=${uri.scope}&ui_locales=pt-BR`,
								}}
								onNavigationStateChange={(data) => {
									data.url.includes(uri.redirectUri) &&
										parseAuthRedirect(data.url, setIsLoading);
								}}
								onError={(error) => console.error(error)}
								renderLoading={() => <Loading />}
								className="flex-1"
							/>
						</BottomSheetView>
					</BottomSheet>
				</View>
				<StatusBar style="light" backgroundColor="black" />
			</View>
		);
}

export interface AuthRedirectData {
	accessToken: string;
	idToken: string;
	expiresAt: number;
	puuid: string;
}

function throwExpression(errorMessage: string): never {
	throw new Error(errorMessage);
}

export async function parseAuthRedirect(
	url: string,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
	setIsLoading(true);
	const searchParams = new URLSearchParams(new URL(url).hash.slice(1));
	const accessToken =
		searchParams.get("access_token") ??
		throwExpression("Access token missing from url");
	const cookies = await CookieManager.get("https://auth.riotgames.com");

	const accessTokenParts = accessToken.split(".");
	if (accessTokenParts.length !== 3) {
		setIsLoading(false);
		throw new Error(
			`Invalid access token, expected 3 parts, got ${accessTokenParts.length}`,
		);
	}
	const base64Url = accessTokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
	const base64 =
		base64Url.length % 4 === 0
			? base64Url
			: base64Url.padEnd(base64Url.length + 4 - (base64Url.length % 4), "=");
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
			.join(""),
	);

	const accessTokenData = JSON.parse(jsonPayload);
	if (accessTokenData.sub === undefined)
		throw new Error("Invalid access token, missing sub");
	await storeAccToken(accessToken);
	await storePuuid(accessTokenData.sub);
	await getEntitlements(accessToken);
	await storeSsidCookie(cookies.ssid.value);
	return router.replace("/pages/storefront");
}
