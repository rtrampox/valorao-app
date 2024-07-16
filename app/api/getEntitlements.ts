import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

type EntitlementResponse = {
    entitlements_token: string;
};

type EntitlementsStorage = {
    entToken: string;
    expiry: number;
}

export async function getEntitlements(token: string) {
    const findExisting = await getEntToken()
    if (findExisting && !(findExisting.expiry < Date.now())) return findExisting.entToken
    const getEnt = await axios.post<EntitlementResponse>("https://entitlements.auth.riotgames.com/api/token/v1", {}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    await storeEntToken(getEnt.data.entitlements_token)
    return getEnt.data.entitlements_token
}

const storeEntToken = async (entToken: string) => {
    try {
        const body = {
            entToken,
            expiry: Date.now() + 3600000
        }
        await AsyncStorage.setItem("entitlements_token", JSON.stringify(body))
    } catch (error) {
        console.log(error)
    }
}

const getEntToken = async () => {
    try {
        const item = await AsyncStorage.getItem("entitlements_token");
        if (item) {
            const getEnt: EntitlementsStorage = JSON.parse(item);
            return getEnt;
        }
    } catch (error) {
        console.log(error)
    }
}

export { getEntToken }