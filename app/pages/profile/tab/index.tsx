import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { getEntToken } from "~/app/api/getEntitlements";
import { getAccToken } from "~/app/api/services/storeAccessToken";
import { getPuuid } from "~/app/api/services/storePuuid";
import { Button } from "~/components/button";

export default function DeveloperView() {
    const [puuid, setPuuid] = useState("")
    const [accessToken, setAccessToken] = useState("")
    const [entitlementsToken, setEntitlementsToken] = useState("")

    async function gatherData() {
        const id = await getPuuid()
        const accToken = await getAccToken()
        const entToken = await getEntToken()
        if (id && accToken && entToken) {
            setPuuid(id)
            setAccessToken(accToken?.accToken)
            setEntitlementsToken(entToken?.entToken)
        }
    }
    useEffect(() => {
        gatherData()
    }, [])

    return (
        <ScrollView className="text-center text-white gap-1 p-3" contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
            <View className="items-center w-full" style={{ minHeight: 850, paddingTop: 0 }}>
                <Button variant="primary" className="w-full" onPress={() => router.back()}>
                    <Button.Title>Voltar</Button.Title>
                </Button>
                <Text selectable className="text-white">puuid</Text>
                <Text selectable className="text-white">{puuid}</Text>
                <Text selectable className="text-white">Access Token:</Text>
                <Text selectable className="text-white">{accessToken}</Text>
                <Text selectable className="text-white">Entitlements Token:</Text>
                <Text selectable className="text-white">{entitlementsToken}</Text>
            </View>
        </ScrollView>
    )
}