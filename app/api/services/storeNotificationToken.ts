import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeNotificationToken(puuid: string, token: string) {
    const findExisting = await firestore().collection('Users').where('puuid', '==', puuid).get({ source: 'server' })
    if (findExisting.docs) {
        const notificationCollection = await firestore().collection('Users').add({
            puuid,
            token,
        })
        const body = {
            puuid,
            token,
        }
        await AsyncStorage.setItem("user/notificationToken", JSON.stringify(body))
        return notificationCollection
    }
}

export async function getNotificationTokenLocal() {
    try {
        const getItem = await AsyncStorage.getItem("user/notificationToken")
        if (getItem) {
            const item = await JSON.parse(getItem)
            return item
        }
    } catch (error) {
        console.log(error)
    }
}
