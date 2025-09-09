export interface podcast {
  _id: string;
  title: string;
  imageUrl: string;
  type: string;
  url: string;
  publishedAt: Date;
  playCount: number;
  isPublished:boolean;
  isFavorite:boolean;
}
