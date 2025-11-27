import { fetchPostSlugs } from './../../../../my-app/app/redux/feedPostslice';
import Post, { IPost } from "../models/postSchema"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express" 
import mongoose from "mongoose";
import { redisClient } from "../redis/redisClient"

interface AuthRequest extends Request{
    user?: {_id:string}
}

interface PostMinimal {
  slug: string;
  _id: any;
}

const createPost = async (req:AuthRequest, res:Response) => {
    const {
        description,
        imageArray,
        document,
        poll_description,
        pollOptions,
        isRepost,
        repostUserId,
        repostDescription
    } = req.body
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).send({
                success: false, message: 'Unauthorized'
            })
        }

        const newPostData: Partial<IPost> = { 
            user: new mongoose.Types.ObjectId(req.user._id),
            description: description
         }
        if (imageArray && imageArray.length > 0) {
            newPostData.imageArray = imageArray
        }
        if (document) {
            newPostData.document = document
        }

        if (poll_description && Array.isArray(pollOptions) && pollOptions.length > 0) {
            newPostData.poll = {
                poll_description,
                options: pollOptions.map((opt) => ({
                    optionText: opt,
                    votes: 0
                }))
            }
        }

        if (isRepost && repostUserId) {
            newPostData.repost = [
                {
                    user: new mongoose.Types.ObjectId(repostUserId),
                    repost_description: repostDescription || ''
                }
            ]
        }

        if (!newPostData.description) {
            return res.status(400).json({
                success: false,
                message: 'Cannot create an empty post',
            });
        }
        newPostData.slug=`slug-${uuidv4()}`
        const post = new Post(newPostData)
        await post.save()

        const keys = await redisClient.keys("posts:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log("Redis cache cleared after new post.");
        }

        await post.populate([
            { path: 'user', select: 'id email display_name photo_url' },
            { path: 'repost.user', select: 'id email display_name photo_url' }
        ])
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post,
        })

    } catch (error:any) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server error",
            error: error.message
        })
    }
}

const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 5;

const getPaginatedPosts=async(req:AuthRequest,res:Response)=>{
    try {        
        let limit=parseInt(req.query.limit as string)
        let page=parseInt(req.query.page as string)

        if(limit>MAX_LIMIT){
            limit=MAX_LIMIT
        }
        else if(isNaN(limit) || limit<=0){
            limit=DEFAULT_LIMIT
        }

        if(page<0 || isNaN(page)){
            page=1
        }

        const cacheKey = `posts:page=${page}&limit=${limit}`
        const isCached = await redisClient.get(cacheKey)
        if(isCached){
            console.log("Cache Hit")
            const cachedString = isCached.toString()
            const cachedData = JSON.parse(cachedString)
            return res.status(200).json(cachedData)
        }

        console.log("Cache Miss")
        const totalCount=await Post.countDocuments()        
        const skip=(page-1)*limit
        const totalPages=Math.ceil(totalCount/limit)

        const posts=await Post.find({})
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .select("slug _id")
            .lean<PostMinimal[]>()
            
            const responseData = {
                page_number: page,
                results: posts.map((post: PostMinimal) => ({
                    slug: post.slug,
                    id: post._id.toString(),
                })),
                count: posts.length,
                per_page: limit,
                total_pages: totalPages,
                current_page_number: page,
                links: {
                    next: page < totalPages ? `/posts?page=${page + 1}&limit=${limit}` : null,
                    previous: page > 1 ? `/posts?page=${page - 1}&limit=${limit}` : null,
                },
            }
        
        await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData))
        
        res.status(200).send(responseData)

    } catch (error:any) {
        res.status(500).send({
            message:"Internal server error",
            error:error
        })
        console.log(error)
    }
}

const getSinglePost = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug is missing" });
    }

    const cacheKey = `post:${slug}`;
    const redisPost = await redisClient.get(cacheKey);

    if (redisPost) {
        const cachedString = typeof redisPost === "string" ? redisPost: redisPost.toString();
        console.log("Cache Hit for single post");
        return res.status(200).json({
            success: true,
            result: { post: JSON.parse(cachedString) },
            cache: true,
        });
    }

    console.log("Single Post Cache Miss");

    const post = await Post.findOne({ slug }).populate([
      { path: "user", select: "id email display_name photo_url" },
      { path: "repost.user", select: "id email display_name photo_url" },
    ]);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await redisClient.setEx(cacheKey, 60, JSON.stringify(post));

    return res.status(200).json({
      success: true,
      result: { post },
      cache: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const editPost=async(req:AuthRequest,res:Response)=>{
    try {
        const {
            slug,
            description
        }=req.body
        const updatedPost=await Post.findOneAndUpdate(
            {slug:req.params.slug},
            { $set: { description } },
            { new: true }
        )
        if(!updatedPost){
            return res.status(404).send({
                message:"Post not founcd",
                success:false
            })
        }
        await redisClient.del(`post:${slug}`)
        return res.status(200).send({
            success:true,
            result:{
                post: updatedPost
            }
        })
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error
        })
    }
}

const addComment=async(req:AuthRequest,res:Response)=>{
    try {
        const { commentText}=req.body
        const slug=req.params.slug
        const updatedPost=await Post.findByIdAndUpdate(
            {slug},
            {
                $push:{
                    comments:{
                        text:commentText,
                        user:req.user._id,
                        createdAt:new Date()
                    }
                }
            },
            {
                new: true,
                lean: true,
                projection: {
                comments: { $slice: -1 }
                }
            }
        ).populate("comments.user"," photo_url display_name ")

        if (!updatedPost) {
        return res.status(404).send({
            success: false,
            message: "Post not found"
        })
        }

        res.status(200).send({
            success: true,
            message: "Comment Added",
            comment: updatedPost.comments[0]
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error
        })
    }
}

const getCommentsPaginated=async(req:AuthRequest,res:Response)=>{
    try {
        const slug=req.params.slug
        const page=Number(req.params.page) || 1
        const limit=5
        const skip=(page-1)*limit
        const post=await Post.findOne({slug})
        
        if(!post){
            return res.status(404).send({
                message:"Post not found",
                success:false
            })
        }

        const totalComments=post.comments.length
        const totalPages=Math.ceil(totalComments/limit)

        const paginatedComments = post.comments
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(skip, skip + limit);

        return res.status(200).send({
            message: "Comments fetched successfully",
            page,
            totalPages,
            totalComments,
            comments: paginatedComments,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error
        })
    }
}

const likePost=async(req:AuthRequest,res:Response)=>{
    try {
        const {
            slug,
            reactionType
        }=req.body
        const post=await Post.findOne({slug})
        const userId=req.user._id
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const existingLike=post.likes.find((like)=>
            like.user.toString()===userId.toString()
        )

        if(existingLike && existingLike.reactionType===reactionType){
            post.likes=post.likes.filter((like)=>
                like.user.toString() !== userId.toString()
            )

            await post.save()

            return res.status(200).send({
                message:"Reaction removed",
                likes:post.likes
            })
        }

        if(existingLike){
            existingLike.reactionType=reactionType  
            await post.save()

            return res.status(200).send({
                message: "Reaction updated",
                likes: post.likes,
            })
        }

        post.likes.push({
            user: userId,
            reactionType: reactionType,
        })

        await post.save()
        return res.status(200).send({
            message:"Reaction added",
            likes: post.likes,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error
        })
    }
}

export { createPost, getPaginatedPosts, getSinglePost, editPost, addComment, likePost, getCommentsPaginated }
