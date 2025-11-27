import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addComment, createPost, editPost, getCommentsPaginated, getPaginatedPosts, getSinglePost, likePost } from "../controllers/postControllers";

const Router = express.Router()

Router.post('/createPost',protect,createPost)
Router.get('/getPosts',protect,getPaginatedPosts)
Router.get('/singlePost/:slug',protect,getSinglePost)
Router.put('/editPost/:slug',protect,editPost)
Router.post('/addComment/:slug',protect,addComment)
Router.get('/getComments/:slug',protect,getCommentsPaginated)
Router.post('/like/:slug',protect,likePost)

export default Router

https://devforum-gateway.onrender.com/api/posts/like/slug-63061ddb-dc82-4a26-81e8-7c8340811638
https://devforum-gateway.onrender.com/api/posts/getComments/slug-63061ddb-dc82-4a26-81e8-7c8340811638?page=1