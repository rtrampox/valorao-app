import AsyncStorage from "@react-native-async-storage/async-storage";

type SsidTokenStorage = {
	ssid: string;
	expiry: number;
};

const storeSsidCookie = async (ssid: string) => {
	try {
		const body: SsidTokenStorage = {
			ssid,
			expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
		};
		await AsyncStorage.setItem("user/ssidCookie", JSON.stringify(body));
	} catch (error) {
		console.error(error);
	}
};

const getStoredSsidCookie = async () => {
	try {
		const item = await AsyncStorage.getItem("user/ssidCookie");
		if (item) {
			const getEnt: SsidTokenStorage = JSON.parse(item);
			return getEnt;
		}
	} catch (error) {
		console.error(error);
	}
};

export { storeSsidCookie, getStoredSsidCookie };
