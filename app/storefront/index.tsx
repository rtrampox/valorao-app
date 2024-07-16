import { View, Image, SectionList, Text } from "react-native";
import { cacheStorefront, getStoreData } from "../api/services/storefront";
import { useEffect, useState } from "react";
import { StorefrontResponse } from "../api/types/storefrontResponse";

type cachedStorefrontResponse = {
    response: StorefrontResponse;
    expiry: number;
};

type DataBody = {
    title: string;
    data: {
        uuid: string;
        displayIcon: string;
        displayName: string;
        streamedVideo: string;
    }[];
};

export default function Storefront() {
    const [data, setData] = useState<DataBody[]>([]);

    async function getStorefront() {
        const storefront = await cacheStorefront();
        const storeData = await getStoreData(storefront as cachedStorefrontResponse);

        const groupedData: { [key: string]: DataBody } = {};
        storeData.forEach((item) => {
            if (!groupedData[item.displayName]) {
                groupedData[item.displayName] = {
                    title: item.displayName,
                    data: []
                };
            }
            groupedData[item.displayName].data.push({
                uuid: item.uuid,
                displayIcon: item.displayIcon,
                displayName: item.displayName,
                streamedVideo: item.streamedVideo,
            });
        });

        const dataBody: DataBody[] = Object.values(groupedData);
        setData(dataBody);
    }

    useEffect(() => {
        getStorefront();
    }, []);

    return (
        <View className="gap-40 mx-3">
            <SectionList
                sections={data}
                keyExtractor={(item) => item.uuid}
                contentContainerClassName="gap-2"
                renderItem={({ item }) => (
                    <View
                        style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 }}
                        className="rounded-xl border border-muted-foreground backdrop-blur-xl"
                    >
                        <Image
                            source={{ uri: item.displayIcon || 'defaultURI' }}
                            style={{ width: 230, height: '100%', resizeMode: 'contain' }}
                        />
                        <Text className="text-white text-xl absolute bottom-2">{item.displayName}</Text>
                    </View>
                )}
            />
        </View>
    );
}
