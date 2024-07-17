import { View, Image, SectionList, Text, TouchableOpacity } from "react-native";
import { cacheStorefront } from "../../api/services/storefront";
import { useEffect, useState } from "react";
import notifee, { AndroidImportance } from '@notifee/react-native'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Loading } from "~/components/loading";

type DataBody = {
    title: string;
    data: {
        uuid: string;
        displayIcon: string;
        displayName: string;
        cost: number;
    }[];
};

export default function Storefront() {
    const [data, setData] = useState<DataBody[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function displayNotification(message: FirebaseMessagingTypes.RemoteMessage) {
        await notifee.requestPermission();

        const channelId = await notifee.createChannel({
            id: "default",
            name: "Default Channel",
            vibration: true,
            importance: AndroidImportance.HIGH,
        })

        await notifee.displayNotification({
            id: message.messageId,
            title: message.notification?.title || "Valorao",
            body: message.notification?.body,
            android: { channelId }
        })
    }

    messaging().onMessage(displayNotification);
    messaging().setBackgroundMessageHandler(displayNotification);

    async function onAppBootstrap() {
        await messaging().registerDeviceForRemoteMessages()
        const token = await messaging().getToken()
        console.log(token)
    }

    async function getStorefront() {
        const storefront = await cacheStorefront();

        const groupedData: { [key: string]: DataBody } = {}
        storefront?.response.forEach((item) => {
            if (!groupedData[item.weapon.displayName]) {
                groupedData[item.weapon.displayName] = {
                    title: item.weapon.displayName,
                    data: []
                };
            }
            groupedData[item.weapon.displayName].data.push({
                uuid: item.weapon.uuid,
                displayIcon: item.weapon.displayIcon,
                displayName: item.weapon.displayName,
                cost: item.cost,
            });
        });

        const dataBody: DataBody[] = Object.values(groupedData);
        setData(dataBody)
        setIsLoading(false)
    }

    useEffect(() => {
        getStorefront()
        // onAppBootstrap()
    }, []);

    if (isLoading) return <Loading />

    return (
        <View className="gap-40 mx-3 mb-12">
            <SectionList
                sections={data}
                keyExtractor={(item) => item.uuid}
                contentContainerClassName="gap-2"
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <View
                            style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 }}
                            className="rounded-lg border border-muted-foreground backdrop-blur-xl"
                        >
                            <Image
                                source={{ uri: item.displayIcon || 'defaultURI' }}
                                style={{ width: 300, height: 250, resizeMode: 'contain' }}
                            />
                            <Text className="text-white text-xl absolute bottom-0 left-2">{item.displayName}</Text>
                            <Text className="text-white text-xl absolute bottom-0 right-2 flex-row gap-3">
                                <Image
                                    source={require('../../../assets/valorant/currencies/valorantPointsLargeIcon.png')}
                                    style={{ width: 17, height: 17, resizeMode: 'contain', marginLeft: 5 }}
                                />
                                {" "}{item.cost}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
