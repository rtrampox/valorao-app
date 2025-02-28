export interface GetAgentDataResponse {
	status: number;
	data: Daum[];
}

interface Daum {
	uuid: string;
	displayName: string;
	description: string;
	developerName: string;
	characterTags?: string[];
	displayIcon: string;
	displayIconSmall: string;
	bustPortrait?: string;
	fullPortrait?: string;
	fullPortraitV2?: string;
	killfeedPortrait: string;
	background?: string;
	backgroundGradientColors: string[];
	assetPath: string;
	isFullPortraitRightFacing: boolean;
	isPlayableCharacter: boolean;
	isAvailableForTest: boolean;
	isBaseContent: boolean;
	role?: Role;
	recruitmentData?: RecruitmentData;
	abilities: Ability[];
	voiceLine: any;
}

interface Role {
	uuid: string;
	displayName: string;
	description: string;
	displayIcon: string;
	assetPath: string;
}

interface RecruitmentData {
	counterId: string;
	milestoneId: string;
	milestoneThreshold: number;
	useLevelVpCostOverride: boolean;
	levelVpCostOverride: number;
	startDate: string;
	endDate: string;
}

interface Ability {
	slot: string;
	displayName: string;
	description: string;
	displayIcon?: string;
}
