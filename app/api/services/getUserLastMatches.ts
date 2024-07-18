import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEntToken } from "../getEntitlements";
import { getAccToken } from "./storeAccessToken";
import { getPuuid } from "./storePuuid";
import { clientInfo } from "../lib/clientInfo";
import { MatchHistoryResponse, MatchDetailsResponse } from "../types/matches";

export async function getUserLastMatches(): Promise<MatchDetailsResponse[] | null> {
    const existingCache = await getProfileFromCache()
    if (existingCache) return existingCache
    const puuid = await getPuuid()
    const ent = await getEntToken()
    const accToken = await getAccToken()
    const shard = "na"
    if (!puuid || !ent || !accToken) return null
    const client = await clientInfo();
    const headers = {
        "X-Riot-ClientPlatform": client.platform,
        "X-Riot-ClientVersion": client.version,
        "X-Riot-Entitlements-JWT": ent.entToken,
        "Authorization": `Bearer ${accToken.accToken}`
    }
    const getMatches = await axios.get<MatchHistoryResponse>(
        `https://pd.${shard}.a.pvp.net/match-history/v1/history/${puuid}?startIndex=0&endIndex=5`,
        { headers: headers }
    )
    const getMatchDetails: Promise<MatchDetailsResponse>[] = getMatches.data.History.map(async (item) => {
        const matchDetails = await axios.get<MatchDetailsResponse>(`https://pd.na.a.pvp.net/match-details/v1/matches/${item.MatchID}`,
            { headers: headers }
        )
        return matchDetails.data
    })

    const matchDetails = await Promise.all(getMatchDetails)
    await AsyncStorage.setItem("cache/profile/matches", JSON.stringify(matchDetails))
    return matchDetails
}

export async function getProfileFromCache(): Promise<MatchDetailsResponse[] | null> {
    try {
        const item = await AsyncStorage.getItem("cache/profile/matches");
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