import { View, Text, Image, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { Button } from "~/components/button"
import { clearCache, LogOut } from "~/app/api/services/logout"
import { router } from "expo-router"
import { getUserProfile } from "~/app/api/services/getProfile"
import { PlayerProfile } from "~/app/api/types/profile"
import Skeleton from "react-native-reanimated-skeleton";
import { Clock, RefreshCw } from "lucide-react-native"
import { currencies } from "~/app/assets/valorant/currencies/currencies"
import { getUserLastMatches } from "~/app/api/services/getUserLastMatches"
import { MatchDetailsResponse } from "~/app/api/types/matches"

export default function ShowToken() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState<PlayerProfile | null>(null)
    const [lastMatches, setLastMatches] = useState<MatchDetailsResponse[] | null>(null)

    async function getProfile() {
        const profile = await getUserProfile()
        const lastMatches = await getUserLastMatches()
        setLastMatches(lastMatches)
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
                    <View className="items-center justify-center absolute top-2 w-full gap-3">
                        <View className="w-full h-32 bg-slate-900/30 border border-muted-foreground justify-between rounded-lg flex-row gap-2 px-4">
                            <View className="flex-row gap-2 items-center">
                                <Image
                                    source={{ uri: profileData.playerCard.data.displayIcon }}
                                    style={{ width: 55, height: 55, resizeMode: 'contain' }}
                                />

                                <View className="flex-col">
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
                            <View className="bg-muted-foreground w-[1px] h-full" />

                            <View className="text-end items-center justify-center mr-5">
                                <View className="flex-col gap-2">
                                    <View className="text-end">
                                        <View className="flex-row gap-1 items-center">
                                            {currencies[Object.keys(profileData.playerWallet.Balances)[0]]()}
                                            <Text className="text-white text-end font-semibold">
                                                {profileData.playerWallet.Balances[Object.keys(profileData.playerWallet.Balances)[0]]}
                                            </Text>
                                        </View>
                                        <View className="flex-row gap-1 items-center">
                                            {currencies[Object.keys(profileData.playerWallet.Balances)[1]]()}
                                            <Text className="text-white text-end font-semibold">
                                                {profileData.playerWallet.Balances[Object.keys(profileData.playerWallet.Balances)[1]]}
                                            </Text>
                                        </View>
                                        <View className="flex-row gap-1 items-center">
                                            {currencies[Object.keys(profileData.playerWallet.Balances)[2]]()}
                                            <Text className="text-white text-end font-semibold">
                                                {profileData.playerWallet.Balances[Object.keys(profileData.playerWallet.Balances)[2]]}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>

                        <View className='flex-row gap-2 items-center justify-center'>
                            <View className='flex-row gap-2 items-center justify-center'>
                                <View className='flex-row items-center justify-center bg-neutral-800 rounded-full p-3'>
                                    <Clock size={15} color={"white"} />
                                    <Text className="text-white items-center text-center">{" "}Últimas partidas:{" "}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className='size-12 items-center justify-center p-3 bg-neutral-800 rounded-full'
                            >
                                <RefreshCw size={15} color={"white"} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 justify-center items-center text-center">
                            <Text className="text-muted-foreground text-2xl">Indisponível</Text>
                        </View>
                    </View>
                )}
            </Skeleton>
            <View className="w-full absolute bottom-2 gap-4">
                {profileData?.playerName === "OPULENCE#RENY" &&
                    <View className="text-center w-full gap-2">
                        <Text className="text-muted-foreground text-center">Somente para desenvolvedores:</Text>
                        <Button
                            onPress={() => router.push('/_sitemap')}
                            variant="outline"
                            className="flex-col"
                        >
                            <Button.Title className="text-white">
                                Mapa do Site
                            </Button.Title>
                        </Button>
                    </View>
                }
                <Button
                    onPress={() => clearCache()}
                    variant="outline"
                    className="flex-col"
                >
                    <Button.Title className="text-white">
                        Limpar Cache
                    </Button.Title>
                </Button>
                <View>
                    <Text className="text-muted-foreground text-sm text-center">O aplicativo deve ser reiniciado para fazer efeito.</Text>
                </View>
                <View className="h-[1px] bg-muted-foreground" />
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