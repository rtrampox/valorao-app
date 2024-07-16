import AsyncStorage from "@react-native-async-storage/async-storage"

export async function LogOut() {
    await AsyncStorage.removeItem("access_token")
    await AsyncStorage.removeItem("entitlements_token")
    await AsyncStorage.removeItem("puuid")
    await AsyncStorage.removeItem("cache/storefront")
}