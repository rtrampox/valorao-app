export type StorefrontResponse = {
    FeaturedBundle: {
        Bundle: {
            /** UUID */
            ID: string;
            /** UUID */
            DataAssetID: string;
            /** Currency ID */
            CurrencyID: string;
            Items: {
                Item: {
                    /** Item Type ID */
                    ItemTypeID: string;
                    /** Item ID */
                    ItemID: string;
                    Amount: number;
                };
                BasePrice: number;
                /** Currency ID */
                CurrencyID: string;
                DiscountPercent: number;
                DiscountedPrice: number;
                IsPromoItem: boolean;
            }[];
            ItemOffers: {
                /** UUID */
                BundleItemOfferID: string;
                Offer: {
                    OfferID: string;
                    IsDirectPurchase: boolean;
                    /** Date in ISO 8601 format */
                    StartDate: string;
                    Cost: {
                        [x: string]: number;
                    };
                    Rewards: {
                        /** Item Type ID */
                        ItemTypeID: string;
                        /** Item ID */
                        ItemID: string;
                        Quantity: number;
                    }[];
                };
                DiscountPercent: number;
                DiscountedCost: {
                    [x: string]: number;
                };
            }[] | null;
            TotalBaseCost: {
                [x: string]: number;
            } | null;
            TotalDiscountedCost: {
                [x: string]: number;
            } | null;
            TotalDiscountPercent: number;
            DurationRemainingInSeconds: number;
            WholesaleOnly: boolean;
        };
        Bundles: {
            /** UUID */
            ID: string;
            /** UUID */
            DataAssetID: string;
            /** Currency ID */
            CurrencyID: string;
            Items: {
                Item: {
                    /** Item Type ID */
                    ItemTypeID: string;
                    /** Item ID */
                    ItemID: string;
                    Amount: number;
                };
                BasePrice: number;
                /** Currency ID */
                CurrencyID: string;
                DiscountPercent: number;
                DiscountedPrice: number;
                IsPromoItem: boolean;
            }[];
            ItemOffers: {
                /** UUID */
                BundleItemOfferID: string;
                Offer: {
                    OfferID: string;
                    IsDirectPurchase: boolean;
                    /** Date in ISO 8601 format */
                    StartDate: string;
                    Cost: {
                        [x: string]: number;
                    };
                    Rewards: {
                        /** Item Type ID */
                        ItemTypeID: string;
                        /** Item ID */
                        ItemID: string;
                        Quantity: number;
                    }[];
                };
                DiscountPercent: number;
                DiscountedCost: {
                    [x: string]: number;
                };
            }[] | null;
            TotalBaseCost: {
                [x: string]: number;
            } | null;
            TotalDiscountedCost: {
                [x: string]: number;
            } | null;
            TotalDiscountPercent: number;
            DurationRemainingInSeconds: number;
            WholesaleOnly: boolean;
        }[];
        BundleRemainingDurationInSeconds: number;
    };
    SkinsPanelLayout: {
        SingleItemOffers: string[];
        SingleItemStoreOffers: {
            OfferID: string;
            IsDirectPurchase: boolean;
            /** Date in ISO 8601 format */
            StartDate: string;
            Cost: {
                [x: string]: number;
            };
            Rewards: {
                /** Item Type ID */
                ItemTypeID: string;
                /** Item ID */
                ItemID: string;
                Quantity: number;
            }[];
        }[];
        SingleItemOffersRemainingDurationInSeconds: number;
    };
    UpgradeCurrencyStore: {
        UpgradeCurrencyOffers: {
            /** UUID */
            OfferID: string;
            /** Item ID */
            StorefrontItemID: string;
            Offer: {
                OfferID: string;
                IsDirectPurchase: boolean;
                /** Date in ISO 8601 format */
                StartDate: string;
                Cost: {
                    [x: string]: number;
                };
                Rewards: {
                    /** Item Type ID */
                    ItemTypeID: string;
                    /** Item ID */
                    ItemID: string;
                    Quantity: number;
                }[];
            };
            DiscountedPercent: number;
        }[];
    };
    AccessoryStore: {
        AccessoryStoreOffers: {
            Offer: {
                OfferID: string;
                IsDirectPurchase: boolean;
                /** Date in ISO 8601 format */
                StartDate: string;
                Cost: {
                    [x: string]: number;
                };
                Rewards: {
                    /** Item Type ID */
                    ItemTypeID: string;
                    /** Item ID */
                    ItemID: string;
                    Quantity: number;
                }[];
            };
            /** UUID */
            ContractID: string;
        }[];
        AccessoryStoreRemainingDurationInSeconds: number;
        /** UUID */
        StorefrontID: string;
    };
    /** Night market */
    BonusStore?: {
        BonusStoreOffers: {
            /** UUID */
            BonusOfferID: string;
            Offer: {
                OfferID: string;
                IsDirectPurchase: boolean;
                /** Date in ISO 8601 format */
                StartDate: string;
                Cost: {
                    [x: string]: number;
                };
                Rewards: {
                    /** Item Type ID */
                    ItemTypeID: string;
                    /** Item ID */
                    ItemID: string;
                    Quantity: number;
                }[];
            };
            DiscountPercent: number;
            DiscountCosts: {
                [x: string]: number;
            };
            IsSeen: boolean;
        }[];
        BonusStoreRemainingDurationInSeconds: number;
    } | undefined;
};

export type Storefront = {
    weapon: {
        uuid: string;
        assetPath: string;
        displayIcon: string;
        displayName: string;
        levelItem: string | null;
        streamedVideo: string | null;
    };
    cost: number;
    item: {
        OfferID: string;
        IsDirectPurchase: boolean;
        StartDate: string;
        Cost: {
            [x: string]: number;
        };
        Rewards: {
            ItemTypeID: string;
            ItemID: string;
            Quantity: number;
        }[];
    };
}

export type CachedStorefront = {
    response: Storefront[];
    expiry: number;
}
