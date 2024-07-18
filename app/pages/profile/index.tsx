import { View, Text } from "react-native"
import { useEffect, useState } from "react"
import { Button } from "~/components/button"
import { LogOut } from "~/app/api/services/logout"
import { router } from "expo-router"
import { getUserProfile } from "~/app/api/services/getProfile"
import { PlayerProfile } from "~/app/api/types/profile"

export default function ShowToken() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [profileData, setProfileData] = useState<PlayerProfile | null>(null)

    async function getProfile() {
        const profile = await getUserProfile()
        setProfileData(profile)
    }
    async function logout() {
        setIsLoggingOut(true)
        await LogOut()
        setIsLoggingOut(false)
        router.replace("/")
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <View className="flex-col flex-1 justify-center items-center gap-3 bg-background mb-12 px-5">
            <View className="w-full h-32 bg-black absolute top-2">

            </View>
            <Button
                onPress={() => logout()}
                variant="destructive-outlined"
                className="px-5 w-full absolute bottom-2"
                isLoading={isLoggingOut}
            >
                <Button.Title className="text-white">
                    Sair
                </Button.Title>
            </Button>
        </View>
    )
}