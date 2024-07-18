import AsyncStorage from "@react-native-async-storage/async-storage"
import CookieManager from "@react-native-cookies/cookies"

export async function LogOut() {
    await AsyncStorage.removeItem("user/accessToken")
    await AsyncStorage.removeItem("user/entitlementsToken")
    await AsyncStorage.removeItem("user/puuid")
    await AsyncStorage.removeItem("cache/storefront")
    await CookieManager.clearAll()
    await CookieManager.removeSessionCookies()
}