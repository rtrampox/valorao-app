import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEntToken } from "../getEntitlements";
import { getAccToken } from "./storeAccessToken";
import { getPuuid } from "./storePuuid";
import { clientInfo } from "../lib/clientInfo";
import {
    PlayerLoadoutResponse,
    PlayerCardData,
    PlayerTitleData,
    RankData,
    PlayerProfile,
    NameServiceResponse,
    PlayerMMRResponse,
    WalletResponse
} from "../types/profile";

export async function getUserProfile() {
    const existingCache = await getProfileFromCache()
    if (existingCache) return existingCache
    const puuid = await getPuuid()
    const ent = await getEntToken()
    const accToken = await getAccToken()
    const shard = "na"
    console.log(ent, accToken)
    if (!puuid || !ent || !accToken) return null
    const client = await clientInfo();
    const headers = {
        "X-Riot-ClientPlatform": client.platform,
        "X-Riot-ClientVersion": client.version,
        "X-Riot-Entitlements-JWT": ent.entToken,
        "Authorization": `Bearer ${accToken.accToken}`
    }
    const getProfile = await axios.put<NameServiceResponse>(
        `https://pd.${shard}.a.pvp.net/name-service/v2/players`,
        [puuid],
        { headers: headers }
    )
    const getMMR = await axios.get<PlayerMMRResponse>(
        `https://pd.${shard}.a.pvp.net/mmr/v1/players/${puuid}`,
        { headers: headers }
    )
    const getProfileBanner = await axios.get<PlayerLoadoutResponse>(
        `https://pd.${shard}.a.pvp.net/personalization/v2/players/${puuid}/playerloadout`,
        { headers: headers }
    )
    const getWallet = await axios.get<WalletResponse>(`https://pd.${shard}.a.pvp.net/store/v1/wallet/${puuid}`, { headers: headers })
    const getMMRRankData = await axios.get(`https://valorant-api.com/v1/competitivetiers?language=pt-BR`)
    const getBannerData = await axios.get<PlayerCardData>(`https://valorant-api.com/v1/playercards/${getProfileBanner.data.Identity.PlayerCardID}?language=pt-BR`)
    const getTitleData = await axios.get<PlayerTitleData>(`https://valorant-api.com/v1/playertitles/${getProfileBanner.data.Identity.PlayerTitleID}?language=pt-BR`)
    const playerName = `${getProfile.data[0].GameName}#${getProfile.data[0].TagLine}`
    const lastPlayedSeasonID = Object.keys(getMMR.data.QueueSkills.competitive.SeasonalInfoBySeasonID)[0]
    const playerRank = getMMR.data.QueueSkills.competitive.SeasonalInfoBySeasonID[lastPlayedSeasonID].CompetitiveTier
    const playerRankData: RankData = getMMRRankData.data.data[getMMRRankData.data.data.length - 1].tiers.find((rank: any) => rank.tier === playerRank)
    const body: PlayerProfile = {
        playerName,
        playerLevel: getProfileBanner.data.Identity.AccountLevel,
        playerRank: playerRankData,
        playerCard: getBannerData.data,
        playerTitle: getTitleData.data,
        playerWallet: getWallet.data,
    }
    await AsyncStorage.setItem("cache/profile", JSON.stringify(body))
    return body
}

export async function getProfileFromCache(): Promise<PlayerProfile | null> {
    try {
        const item = await AsyncStorage.getItem("cache/profile");
        if (item) {
            const getProfile = JSON.parse(item);
            return getProfile;
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}