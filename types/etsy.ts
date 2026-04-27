export interface EtsyPrice {
  amount: number;
  divisor: number;
  currency_code: string;
}

export interface EtsyListingImage {
  listing_image_id: number;
  listing_id: number;
  url_fullxfull: string;
  url_570xN: string;
  url_170x135: string;
  alt_text: string | null;
  rank: number;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  price: EtsyPrice;
  url: string;
  state: 'active' | 'inactive' | 'sold_out' | 'draft';
  quantity: number;
  tags: string[];
  shop_section_id: number | null;
  images?: EtsyListingImage[];
  primary_image?: EtsyListingImage;
}

export interface EtsyShopSection {
  shop_section_id: number;
  title: string;
  active_listing_count: number;
}

export interface EtsyListingsResponse {
  count: number;
  results: EtsyListing[];
}

export interface EtsySectionsResponse {
  count: number;
  results: EtsyShopSection[];
}
