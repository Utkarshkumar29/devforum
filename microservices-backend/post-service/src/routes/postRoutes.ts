import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createPost, editPost, getPaginatedPosts, getSinglePost } from "../controllers/postControllers";

const Router = express.Router()

Router.post('/createPost',protect,createPost)
Router.get('/getPosts',protect,getPaginatedPosts)
Router.get('/singlePost/:slug',protect,getSinglePost)
Router.put('/editPost/:slug',protect,editPost)

export default Router