import { View, Text, PlatformColor } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { ArrowLeft } from "lucide-react-native"
import { getEntitlements } from "../../api/getEntitlements"
import { useEffect, useState } from "react"
import { Button } from "~/components/button"
import { LogOut } from "../../api/services/logout"
import WebView from "react-native-webview"

export default function ShowToken() {
    const [entitlements, setEntitlements] = useState("")
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const tripParams = useLocalSearchParams<{
        accessToken: string
        idToken: string
        expiresAt: string
        puuid: string
    }>()
    async function entToken() {
        if (!tripParams.accessToken) return
        const token = await getEntitlements(tripParams.accessToken)
        setEntitlements(token)
    }
    useEffect(() => {
        entToken()
    }, [])

    function logout() {
        setIsLoggingOut(true)
        LogOut()
    }

    return (
        <View className="flex-col flex-1 justify-center items-center gap-3 bg-background mb-12">
            <Text className="text-zinc-100" selectable>{tripParams.accessToken?.toString()}</Text>
            <Text className="text-zinc-100" selectable>Entitlements token: {entitlements}</Text>
            <Text className="text-zinc-100" selectable selectionColor="blue">{tripParams.puuid?.toString()}</Text>
            <Button onPress={() => logout()} className="bg-zinc-100 px-5" isLoading={isLoggingOut}>
                <Text>Sair</Text>
            </Button>
            <Button onPress={() => router.push("/storefront")} className="bg-zinc-100 px-5" isLoading={isLoggingOut}>
                <Text>Ver loja</Text>
            </Button>
            {isLoggingOut &&
                <View className="absolute w-0 h-0">
                    <WebView
                        source={{ uri: 'https://auth.riotgames.com/logout' }}
                        onNavigationStateChange={(data) => {
                            if (data.url.includes('https://auth.riotgames.com/logout') && !data.loading) {
                                console.log(data)
                                setIsLoggingOut(false)
                                router.replace("/")
                            }
                        }}
                        className="hidden"
                    />
                </View>
            }
        </View>
    )
}