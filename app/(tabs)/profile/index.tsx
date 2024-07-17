import { View, Text } from "react-native"
import { router } from "expo-router"
import { useState } from "react"
import { Button } from "~/components/button"
import { LogOut } from "../../api/services/logout"

export default function ShowToken() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    function logout() {
        setIsLoggingOut(true)
        LogOut()
    }

    return (
        <View className="flex-col flex-1 justify-center items-center gap-3 bg-background mb-12">
            <Button variant="secondary" onPress={() => logout()} className="bg-zinc-100 px-5" isLoading={isLoggingOut}>
                <Text>Sair</Text>
            </Button>
            <Button onPress={() => router.push("/storefront")} className="bg-zinc-100 px-5" isLoading={isLoggingOut}>
                <Text>Ver loja</Text>
            </Button>
        </View>
    )
}