import { Image, type ImageProps } from "react-native";

export const currencies: {
	[key: string]: (props?: ImageProps) => JSX.Element;
} = {
	"85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741": (props) => (
		<ValorantPoints {...props} />
	),
	"85ca954a-41f2-ce94-9b45-8ca3dd39a00d": (props) => (
		<KingdomPoints {...props} />
	),
	"e59aa87c-4cbf-517a-5983-6e81511be9b7": (props) => (
		<RadianitePoints {...props} />
	),
};

function ValorantPoints({ ...props }: ImageProps) {
	return (
		<Image
			source={require("./valorantPointsDisplayIcon.png")}
			className="size-5 object-cover"
			{...props}
		/>
	);
}

function RadianitePoints({ ...props }: ImageProps) {
	return (
		<Image
			source={require("./radianitePointsDisplayIcon.png")}
			className="size-5 object-cover"
			{...props}
		/>
	);
}

function KingdomPoints({ ...props }: ImageProps) {
	return (
		<Image
			source={require("./kingdomPointsDisplayIcon.png")}
			className="size-5 object-cover"
			{...props}
		/>
	);
}
