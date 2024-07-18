import { Text, View } from "react-native"
import * as React from "react"
import { Button } from "~/components/button"
import { router } from "expo-router"

export default function Nightmarket() {

    return (
        <View className="items-center justify-center flex-1 px-4 gap-2">
            <Text className="text-white text-center text-xl">O mercado Noturno ainda não está disponível!</Text>
            <Button onPress={() => router.back()} variant="outline" className="w-full">
                <Button.Title>
                    Voltar
                </Button.Title>
            </Button>
        </View>
    )
}
