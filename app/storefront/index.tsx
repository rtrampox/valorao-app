import { View, Image, SectionList, Text } from "react-native";
import { cacheStorefront } from "../api/services/storefront";
import { useEffect, useState } from "react";

type DataBody = {
    title: string;
    data: {
        uuid: string;
        displayIcon: string;
        displayName: string;
        streamedVideo: string | null;
    }[];
};

export default function Storefront() {
    const [data, setData] = useState<DataBody[]>([]);

    async function getStorefront() {
        const storefront = await cacheStorefront();

        const groupedData: { [key: string]: DataBody } = {};
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
                streamedVideo: item.weapon.streamedVideo,
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
