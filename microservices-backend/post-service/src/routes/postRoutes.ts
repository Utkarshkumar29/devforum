import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createPost, editPost, getPaginatedPosts, getSinglePost } from "../controllers/postControllers";

const Router = express.Router()

Router.post('/posts/createPost',protect,createPost)
Router.get('/posts/getPosts',protect,getPaginatedPosts)
Router.get('/posts/singlePost',protect,getSinglePost)
Router.put('/posts/editPost/:slug',protect,editPost)

export default Router