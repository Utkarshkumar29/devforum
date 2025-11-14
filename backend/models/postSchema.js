const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
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
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };