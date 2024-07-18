import { View, Text } from "react-native"
import { useState } from "react"
import { Button } from "~/components/button"
import { LogOut } from "~/app/api/services/logout"
import { router } from "expo-router"

export default function ShowToken() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function logout() {
        setIsLoggingOut(true)
        await LogOut()
        setIsLoggingOut(false)
        router.replace("/")
    }

    return (
        <View className="flex-col flex-1 justify-center items-center gap-3 bg-background mb-12 px-5">
            <Button
                onPress={() => logout()}
                variant="destructive-outlined"
                className="px-5 w-full absolute bottom-2"
                isLoading={isLoggingOut}
            >
                <Text className="text-white">
                    Sair
                </Text>
            </Button>
        </View>
    )
}