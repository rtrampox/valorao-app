export type RankData = {
	tier: number;
	tierName: string;
	largeIcon: string;
	smallIcon: string;
	division: string;
	divisonName: string;
	backgroundColor: string;
	color: string;
	rankTriangleDownIcon: string;
	rankTriangleUpIcon: string;
};

export type PlayerCardData = {
	data: {
		uuid: string;
		displayName: string;
		isHiddenIfNotOwned: boolean;
		themeUuid: string | null;
		displayIcon: string;
		smallArt: string;
		wideArt: string;
		largeArt: string;
		assetPath: string;
	};
};

export type PlayerTitleData = {
	data:
		| {
				uuid: string | null;
				displayName: string | null;
				titleText: string | null;
				isHiddenIfNotOwned: boolean | null;
				assetPath: string | null;
		  }
		| undefined;
};

export type PlayerProfile = {
	puuid: string;
	playerName: string;
	playerLevel: number;
	playerRank: RankData;
	playerCard: PlayerCardData;
	playerTitle: PlayerTitleData | null;
	playerWallet: WalletResponse;
	RankedRating: number;
};

export type PlayerLoadoutResponse = {
	/** Player UUID */
	Subject: string;
	Version: number;
	Guns: {
		/** UUID */
		ID: string;
		/** UUID */
		CharmInstanceID?: string | undefined;
		/** UUID */
		CharmID?: string | undefined;
		/** UUID */
		CharmLevelID?: string | undefined;
		/** UUID */
		SkinID: string;
		/** UUID */
		SkinLevelID: string;
		/** UUID */
		ChromaID: string;
		Attachments: unknown[];
	}[];
	Sprays: {
		/** UUID */
		EquipSlotID: string;
		/** UUID */
		SprayID: string;
		SprayLevelID: null;
	}[];
	Identity: {
		/** UUID */
		PlayerCardID: string;
		/** UUID */
		PlayerTitleID: string;
		AccountLevel: number;
		/** UUID */
		PreferredLevelBorderID: string;
		HideAccountLevel: boolean;
	};
	Incognito: boolean;
};

export type NameServiceResponse = {
	DisplayName: string;
	/** Player UUID */
	Subject: string;
	GameName: string;
	TagLine: string;
}[];

export type PlayerMMRResponse = {
	Version: number;
	/** Player UUID */
	Subject: string;
	NewPlayerExperienceFinished: boolean;
	QueueSkills: {
		[x: string]: {
			TotalGamesNeededForRating: number;
			TotalGamesNeededForLeaderboard: number;
			CurrentSeasonGamesNeededForRating: number;
			SeasonalInfoBySeasonID: {
				[x: string]: {
					/** Season ID */
					SeasonID: string;
					NumberOfWins: number;
					NumberOfWinsWithPlacements: number;
					NumberOfGames: number;
					Rank: number;
					CapstoneWins: number;
					LeaderboardRank: number;
					CompetitiveTier: number;
					RankedRating: number;
					WinsByTier: {
						[x: string]: number;
					} | null;
					GamesNeededForRating: number;
					TotalWinsNeededForRank: number;
				};
			};
		};
	};
	LatestCompetitiveUpdate: {
		/** Match ID */
		MatchID: string;
		/** Map ID */
		MapID: string;
		/** Season ID */
		SeasonID: string;
		MatchStartTime: number;
		TierAfterUpdate: number;
		TierBeforeUpdate: number;
		RankedRatingAfterUpdate: number;
		RankedRatingBeforeUpdate: number;
		RankedRatingEarned: number;
		RankedRatingPerformanceBonus: number;
		CompetitiveMovement: "MOVEMENT_UNKNOWN";
		AFKPenalty: number;
	};
	IsLeaderboardAnonymized: boolean;
	IsActRankBadgeHidden: boolean;
};

export type WalletResponse = {
	Balances: {
		[x: string]: number;
	};
};
