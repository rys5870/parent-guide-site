export interface Section {
  icon?: string;
  title?: string;
  content: string;
}

export interface Article {
  _id:string;
  title: string;
 category: {
    _id: string;
    category: string;
   
  };
  isPublished?:boolean;
 isFavorite:boolean;
  image: string;
  date?: Date;
  sections: Section[];
}
export type ArticleInput = {
  title: string;
  image: string;
  categoryId: string;
  sections: Section[];
};

export type ArticleSummary = {
  _id: string;
  title: string;
  image: string;
  category: {
    _id: string;
    category: string;
  };
};
