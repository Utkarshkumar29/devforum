export interface ILike {
  user: string;
  reactionType: string;
}

export interface IComment {
  text: string;
  user: string;
  createdAt: string | Date;
}

export interface IRepost {
  user: string;
  repost_description?: string;
}

export interface IPollOption {
  _id?: string;
  optionText: string;
  votes: number;
}

export interface IPoll {
  poll_description?: string;
  options: IPollOption[];
  voters: string[];
}

export interface IPost {
  slug: string;
  user: string;
  description: string;
  imageArray?: string[];
  video?: string;
  likes: ILike[];
  comments: IComment[];
  repost?: IRepost[];
  document?: string;
  poll?: IPoll;
  createdAt: string | Date;
  updatedAt: string | Date;
  schedule_time?: string | Date;
  published_at?: string | Date;
}
