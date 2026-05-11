export type Review = {
  id: string;
  product_handle: string;
  author_name: string;
  rating: number;
  body: string;
  verified_purchase: boolean;
  approved: boolean;
  token_used: string | null;
  photo_url: string | null;
  created_at: string;
};
