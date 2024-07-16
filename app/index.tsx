import * as React from 'react';
import { View, Image } from 'react-native';
import { Text } from '~/components/components/ui/text';
import { WebView } from "react-native-webview";
import {
  Card, CardFooter, CardHeader
} from '~/components/components/ui/card';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { getAccToken, storeAccToken } from './api/services/storeAccessToken';
import { Loading } from '~/components/loading';
import { getPuuid, storePuuid } from './api/services/storePuuid';
import { X } from 'lucide-react-native';
import { colors } from './styles/colors';

export default function Screen() {
  const [hasToken, setHasToken] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cardIsOpen, setCardIsOpen] = React.useState(true);
  let webViewRef: WebView | null = null;
  async function getStoredItems() {
    const token = await getAccToken()
    const puuid = await getPuuid()
    if (token && !(token.expiry < Date.now())) {
      setHasToken(true)
      return router.replace(`/showToken?accessToken=${token.accToken}&puuid=${puuid}`)
    }
    setIsLoading(false)
    return setHasToken(false)
  }
  React.useEffect(() => {
    setIsLoading(true)
    getStoredItems()
    return () => {
      webViewRef = null;
    };
  }, []);

  if (isLoading) return <Loading />
  if (!hasToken) return (
    <View className='flex-1 justify-center bg-background'>
      <StatusBar style='light' backgroundColor='black' />
      <View className={`absolute z-10 bottom-2 left-0 right-0 items-center shadow-xl ${cardIsOpen ? '' : 'hidden'}`}>
        <Card className='w-full max-w-sm rounded-2xl'>
          <CardHeader className='flex-col'>
            <X style={{ position: 'absolute', top: 7, right: 7 }} color={colors.zinc[100]} size={15} onPress={() => setCardIsOpen(false)} />
            <View className='items-center justify-center flex-row gap-2'>
              <Text>Para continuar, faça login em sua conta Riot</Text>
              <Image source={require("~/assets/images/riotGamesLogo.png")} className='size-3' />
            </View>
            <Text className='text-sm text-start text-muted-foreground'>recomendamos selecionar manter conectado</Text>
          </CardHeader>
        </Card>
      </View>
      <View className='flex-1'>
        <WebView
          ref={(ref) => (webViewRef = ref)}
          source={{ uri: 'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid' }}
          onNavigationStateChange={(data) => {
            data.url.includes('https://playvalorant.com') && parseAuthRedirect(data.url)
          }}
          onError={(error) => console.error(error)}
          className='flex-1'
        />
      </View>
    </View>
  );
}

export interface AuthRedirectData {
  accessToken: string
  idToken: string
  expiresAt: number
  puuid: string
}

function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage)
}

export async function parseAuthRedirect(url: string): Promise<AuthRedirectData> {
  const searchParams = new URLSearchParams((new URL(url)).hash.slice(1));
  const accessToken = searchParams.get('access_token') ?? throwExpression('Access token missing from url');
  const idToken = searchParams.get('id_token') ?? throwExpression('Entitlement missing from url');
  const expiresIn = searchParams.get('expires_in') ?? throwExpression('Expiry missing from url');

  const accessTokenParts = accessToken.split('.');
  if (accessTokenParts.length !== 3) throw new Error(`Invalid access token, expected 3 parts, got ${accessTokenParts.length}`);
  const base64Url = accessTokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
  const base64 = base64Url.length % 4 === 0 ? base64Url : base64Url.padEnd(base64Url.length + 4 - base64Url.length % 4, '=');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const accessTokenData = JSON.parse(jsonPayload);

  if (accessTokenData.sub === undefined) throw new Error('Invalid access token, missing sub');
  await storeAccToken(accessToken)
  await storePuuid(accessTokenData.sub)
  router.replace(`/showToken?accessToken=${accessToken}&idToken=${idToken}&puuid=${accessTokenData.sub}`)
  return {
    accessToken,
    idToken,
    expiresAt: (Number(expiresIn) * 1000) + Date.now() - 60_000,
    puuid: accessTokenData.sub
  };
}
