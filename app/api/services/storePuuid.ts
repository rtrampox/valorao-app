import AsyncStorage from '@react-native-async-storage/async-storage';

const storePuuid = async (puuid: string) => {
    try {
        await AsyncStorage.setItem("puuid", puuid)
    } catch (error) {
        console.log(error)
    }
}

const getPuuid = async () => {
    try {
        const item = await AsyncStorage.getItem("puuid");
        if (item) {
            const getPuuid = item;
            return getPuuid;
        }
    } catch (error) {
        console.log(error)
    }
}

export { storePuuid, getPuuid }