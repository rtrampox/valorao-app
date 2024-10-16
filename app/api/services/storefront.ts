import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { getEntToken } from "../getEntitlements";
import { clientInfo } from "../lib/clientInfo";
import { getAccToken } from "./storeAccessToken";
import { getPuuid } from "./storePuuid";
import type {
	Storefront,
	CachedStorefront,
	DetailedWeaponData,
	StorefrontResponse,
} from "../types/storefrontResponse";

async function cacheStorefront(): Promise<CachedStorefront | null> {
	try {
		const puuid = await getPuuid();
		console.log(puuid);
		// const existingCache = await getStorefrontFromCache();
		// if (existingCache && !(existingCache.expiry < Date.now()))
		// 	return existingCache;

		const now = new Date();
		now.setHours(now.getHours() - 3);
		const expiry = now.setHours(21, 0, 0, 0);
		const access_token = await getAccToken();
		const entitlements = await getEntToken();

		const shard = "na";
		const client = await clientInfo();

		if (
			!access_token ||
			!entitlements ||
			!puuid ||
			access_token.expiry < Date.now()
		) {
			router.replace("/");
			return null;
		}

		const getstorefront = await axios.post<StorefrontResponse>(
			`https://pd.${shard}.a.pvp.net/store/v3/storefront/${puuid}`,
			"{}",
			{
				headers: {
					"X-Riot-ClientPlatform": client.platform,
					"X-Riot-ClientVersion": client.version,
					"X-Riot-Entitlements-JWT": entitlements.entToken,
					Authorization: `Bearer ${access_token.accToken}`,
				},
			},
		);

		const getWeaponData = await axios.get(
			"https://valorant-api.com/v1/weapons/skinlevels?language=pt-BR",
		);
		const detailedWeaponData = await axios.get(
			"https://valorant-api.com/v1/weapons/skins?language=pt-BR",
		);
		const getContentTiers = await axios.get(
			"https://valorant-api.com/v1/contenttiers?language=pt-BR",
		);

		const detailedData: Storefront[] =
			getstorefront.data.SkinsPanelLayout.SingleItemStoreOffers.map((item) => {
				const weapon = getWeaponData.data.data.find(
					(weapon: any) => weapon.uuid === item.OfferID,
				);
				const weaponDetailed: DetailedWeaponData =
					detailedWeaponData.data.data.find(
						(data: DetailedWeaponData) =>
							data.displayName === weapon.displayName,
					);
				const contentTier = getContentTiers.data.data.find(
					(tier: any) => tier.uuid === weaponDetailed.contentTierUuid,
				);
				const cost = Object.values(item.Cost)[0];
				return {
					weapon: weaponDetailed,
					cost,
					contentTierData: contentTier,
					item,
				};
			});

		const body: CachedStorefront = {
			response: detailedData,
			expiry,
		};

		await AsyncStorage.setItem("cache/storefront", JSON.stringify(body));
		return body;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error("request: ", error.request);
			console.error("response: ", error.response?.data);
		}
		console.log(error);
		return null;
	}
}

async function getStorefrontFromCache(): Promise<CachedStorefront | null> {
	try {
		const item = await AsyncStorage.getItem("cache/storefront");
		if (item) {
			const getEnt = JSON.parse(item);
			return getEnt;
		}
		return null;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export { cacheStorefront, getStorefrontFromCache };
