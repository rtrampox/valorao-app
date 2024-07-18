import { View, Text, Image } from "react-native"
import { useEffect, useState } from "react"
import { Button } from "~/components/button"
import { clearCache, LogOut } from "~/app/api/services/logout"
import { router } from "expo-router"
import { getUserProfile } from "~/app/api/services/getProfile"
import { PlayerProfile } from "~/app/api/types/profile"
import Skeleton from "react-native-reanimated-skeleton";

export default function ShowToken() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState<PlayerProfile | null>(null)

    async function getProfile() {
        const profile = await getUserProfile()
        setProfileData(profile)
        setIsLoading(false)
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
            <Skeleton isLoading={isLoading}
                containerStyle={{ width: "100%", height: 128, position: "absolute", top: 8 }}
                boneColor="#333"
                highlightColor="#444"
                animationDirection="horizontalRight"
                layout={[
                    { key: "viewBox", width: "auto", height: 128, marginBottom: 6 },
                ]}
            >
                {profileData && (
                    <View className="w-full h-32 bg-slate-900/30 border border-muted-foreground absolute top-2 rounded-lg flex-row gap-2 items-center px-4">
                        <Image
                            source={{ uri: profileData.playerCard.data.displayIcon }}
                            style={{ width: 55, height: 55, resizeMode: 'contain' }}
                        />
                        <View className="flex-1 flex-col">
                            <View className="text-center">
                                <Text className="text-white text-base font-semibold">{profileData.playerName}</Text>
                                <Text className="text-muted-foreground text-sm">{profileData.playerTitle.data.titleText}</Text>
                            </View>
                            <View className="flex-row gap-1">
                                <Image
                                    source={{ uri: profileData.playerRank.largeIcon }}
                                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                                />
                                <Text className="text-white capitalize">{profileData.playerRank.tierName.toLowerCase()}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </Skeleton>
            <View className="w-full absolute bottom-2 gap-4">
                <Button
                    onPress={() => clearCache()}
                    variant="outline"
                    isLoading={isLoggingOut}
                >
                    <Button.Title className="text-white">
                        Limpar Cache
                    </Button.Title>
                </Button>
                <Button
                    onPress={() => logout()}
                    variant="destructive-outlined"
                    isLoading={isLoggingOut}
                >
                    <Button.Title className="text-white">
                        Sair
                    </Button.Title>
                </Button>
            </View>
        </View>
    )
}