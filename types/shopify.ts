export interface ShopifyProductImage {
  url: string;
  altText: string | null;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  url: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyProductImage | null;
  collections: ShopifyCollection[];
}

export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        onlineStoreUrl: string | null;
        priceRange: {
          minVariantPrice: ShopifyMoney;
        };
        featuredImage: ShopifyProductImage | null;
        collections: {
          edges: Array<{ node: ShopifyCollection }>;
        };
      };
    }>;
  };
}

export interface ShopifyCollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}
