import "~/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import TabBar from "~/components/tabBar";

const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				document.documentElement.classList.add("bg-background");
			}
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);

				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			SplashScreen.hideAsync();
		});
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<ThemeProvider value={DARK_THEME}>
			<StatusBar style="light" backgroundColor="#000000" />
			<Tabs
				screenOptions={{ headerShown: false }}
				tabBar={(props) => <TabBar {...props} />}
				backBehavior="history"
			>
				<Tabs.Screen name="storefront/index" options={{ title: "Loja" }} />
				<Tabs.Screen
					name="nightmarket/index"
					options={{ title: "Mercado Noturno" }}
				/>
				<Tabs.Screen name="profile/index" options={{ title: "Perfil" }} />
			</Tabs>
			<PortalHost />
		</ThemeProvider>
	);
}
