import mongoose, { Document,Schema } from "mongoose"

export interface ILike{
  user:mongoose.Types.ObjectId
  reactionType:string
}

export interface IComment{
  text:string,
  user:mongoose.Types.ObjectId
  createdAt:Date
}

export interface IRepost{
  user:mongoose.Types.ObjectId
  repost_description?:string
}

export interface IPollOption{
  _id?:string
  optionText:string
  votes:number
}

export interface IPoll{
  poll_description?:string
  options: IPollOption[]
  voters: mongoose.Types.ObjectId[]
}

export interface IPost extends Document{
  slug:string
  user:mongoose.Types.ObjectId
  description:string
  imageArray?:string[]
  video?:string
  likes:ILike[]
  comments:IComment[]
  repost?:IRepost[]
  document?:string
  poll?:IPoll
  createdAt:Date
  updatedAt:Date
  schedule_time?:Date
  published_at?:Date
}


const postSchema = new mongoose.Schema<IPost>(
  {
    slug:{
      type:String,
      unique:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageArray: [
      {
        type: String,
      },
    ],
    video:{
      type: String
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reactionType: {
          type: String,
          default: 'like',
        },
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    repost: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        repost_description: {
          type: String,
        },
      },
    ],
    document: {
      type: String,
    },
    poll: {
      poll_description: {
        type: String,
      },
      options: [
        {
          optionText: {
            type: String,
          },
          votes: {
            type: Number,
            default: 0,
          },
        },
      ],
      voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
    },
    schedule_time:{
      type:Date,
      default: null
    },
    published_at:{
      type:Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", postSchema)