import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '~/components/components/ui/text';
import { WebView } from "react-native-webview";
import CookieManager from '@react-native-cookies/cookies';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { getAccToken, storeAccToken } from './api/services/storeAccessToken';
import { Loading } from '~/components/loading';
import { getPuuid, storePuuid } from './api/services/storePuuid';
import { Button } from '~/components/button';
import { getEntitlements, getEntToken } from './api/getEntitlements';

export default function Screen() {
  const [hasToken, setHasToken] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  let webViewRef: WebView | null = null;

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ['25%', '98%'], []);

  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  async function getLoggedInData() {
    const token = await getAccToken()
    const puuid = await getPuuid()
    const enttoken = await getEntToken()
    if (token && !(token.expiry < Date.now()) && puuid && enttoken) {
      setHasToken(true)
      return router.replace(`/tabs/storefront`)
    }
    setIsLoading(false)
    return setHasToken(false)
  }
  React.useEffect(() => {
    getLoggedInData()
    return () => {
      webViewRef = null;
    };
  }, []);

  React.useEffect(() => {
    if (!isLoading) handlePresentModalPress()
  }, [isLoading])

  if (isLoading) return <Loading />
  if (!hasToken) return (
    <BottomSheetModalProvider>
      <View className='flex-1 justify-center bg-black'>
        <View className='flex-1 items-center justify-center p-10 gap-2'>
          <Text className='text-center'>Para continuar, é necessário fazer login em sua conta Riot.</Text>
          <Button onPress={handlePresentModalPress}>
            <Button.Title>Voltar ao login</Button.Title>
          </Button>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <View className='flex-1'>
                <Text className='text-black p-2 text-center'>Lembre de clicar em "manter conectado", assim não será necessário fazer login novamente.</Text>
                <WebView
                  ref={(ref) => (webViewRef = ref)}
                  source={{ uri: 'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid' }}
                  onNavigationStateChange={(data) => {
                    data.url.includes('https://playvalorant.com') && parseAuthRedirect(data.url, setIsLoading)
                  }}
                  onError={(error) => console.error(error)}
                  renderLoading={() => <Loading />}
                  className='flex-1'
                />
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
        <StatusBar style='light' backgroundColor='black' />
      </View>
    </BottomSheetModalProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
  },
});

export interface AuthRedirectData {
  accessToken: string
  idToken: string
  expiresAt: number
  puuid: string
}

function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage)
}

export async function parseAuthRedirect(url: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
  setIsLoading(true)
  const searchParams = new URLSearchParams((new URL(url)).hash.slice(1));
  const accessToken = searchParams.get('access_token') ?? throwExpression('Access token missing from url');

  const accessTokenParts = accessToken.split('.');
  if (accessTokenParts.length !== 3) {
    setIsLoading(false)
    throw new Error(`Invalid access token, expected 3 parts, got ${accessTokenParts.length}`)
  }
  const base64Url = accessTokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
  const base64 = base64Url.length % 4 === 0 ? base64Url : base64Url.padEnd(base64Url.length + 4 - base64Url.length % 4, '=');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const accessTokenData = JSON.parse(jsonPayload);
  if (accessTokenData.sub === undefined) throw new Error('Invalid access token, missing sub');
  await storeAccToken(accessToken)
  await storePuuid(accessTokenData.sub)
  await getEntitlements(accessToken)
  return router.replace(`/tabs/storefront`)
}
