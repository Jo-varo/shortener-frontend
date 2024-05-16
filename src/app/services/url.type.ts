export interface ShortURLResponse {
  slug: string;
}

export interface URLListResponse {
  id:           number;
  original_url: string;
  slug:         string;
}

export interface SingleURLResponse {
  id:           number;
  original_url: string;
  slug:         string;
}

export interface DeletedURLResponse {
  message: string;
}
