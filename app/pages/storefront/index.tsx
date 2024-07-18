import { View, Image, SectionList, Text, TouchableOpacity } from "react-native";
import { cacheStorefront } from "../../api/services/storefront";
import { useEffect, useState } from "react";
import notifee, { AndroidImportance } from '@notifee/react-native'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import Skeleton from "react-native-reanimated-skeleton";
import { LinearGradient } from 'expo-linear-gradient';
import CountdownPage from "~/components/countdown";

type DataBody = {
    title: string;
    data: {
        uuid: string;
        displayIcon: string;
        displayName: string;
        cost: number;
        contentTierData: any;
        contentTier: string;
        theme: string;
        raw: any;
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
                displayIcon: item.weapon.chromas[0].displayIcon || item.weapon.displayIcon,
                displayName: item.weapon.displayName,
                contentTier: item.weapon.contentTierUuid,
                contentTierData: item.contentTierData,
                theme: item.weapon.themeUuid,
                cost: item.cost,
                raw: item.weapon,
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

    return (
        <View className="gap-40 mx-3 mt-2">
            <Skeleton isLoading={isLoading}
                containerStyle={{ width: "100%", height: "auto", gap: 8, marginBottom: 178 }}
                boneColor="#333"
                highlightColor="#444"
                animationDirection="horizontalRight"
                layout={[
                    { key: "storeCountdown", justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 },
                    { key: "storeItem1", justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 },
                    { key: "storeItem2", justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 },
                    { key: "storeItem3", justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 },
                    { key: "storeItem4", justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 },

                ]}
            >
                <CountdownPage />
                <SectionList
                    showsVerticalScrollIndicator={false}
                    sections={data}
                    keyExtractor={(item) => item.uuid}
                    contentContainerClassName="gap-1.5"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                        >
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: 200,
                                    backgroundColor: `#${item.contentTierData.highlightColor}`,
                                }}
                                className="rounded-lg overflow-hidden"
                            >
                                <LinearGradient
                                    colors={[`#${item.contentTierData.highlightColor}`, 'transparent']}
                                    dither={true}
                                    className="absolute top-0 left-0 w-full h-11"
                                />
                                <Image
                                    source={{ uri: item.contentTierData.displayIcon || 'defaultURI' }}
                                    style={{ width: "100%", height: "100%", resizeMode: 'contain', position: 'absolute' }}
                                    className="opacity-30"
                                />
                                <Image
                                    source={{ uri: item.displayIcon || 'defaultURI' }}
                                    style={{ width: 300, height: 250, resizeMode: 'contain' }}
                                />
                                <Text className="text-white text-xl absolute bottom-1 left-2">{item.displayName}</Text>
                                <Text className="text-white text-xl absolute bottom-1 right-2 flex-row gap-3">
                                    <Image
                                        source={require('../../assets/valorant/currencies/valorantPointsDisplayIcon.png')}
                                        style={{ width: 17, height: 17, resizeMode: 'contain', marginLeft: 5 }}
                                    />
                                    {" "}{item.cost}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </Skeleton>
        </View>
    );
}
