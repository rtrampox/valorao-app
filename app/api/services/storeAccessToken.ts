import AsyncStorage from "@react-native-async-storage/async-storage";

type AccessTokenStorage = {
	accToken: string;
	expiry: number;
};

const storeAccToken = async (accToken: string) => {
	try {
		const body: AccessTokenStorage = {
			accToken,
			expiry: Date.now() + 3600000,
		};
		await AsyncStorage.setItem("user/accessToken", JSON.stringify(body));
	} catch (error) {
		console.error(error);
	}
};

const getAccToken = async () => {
	try {
		const item = await AsyncStorage.getItem("user/accessToken");
		if (item) {
			const getEnt: AccessTokenStorage = JSON.parse(item);
			return getEnt;
		}
	} catch (error) {
		console.error(error);
	}
};

export { storeAccToken, getAccToken };
