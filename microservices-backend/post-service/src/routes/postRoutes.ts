import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addComment, createPost, editPost, getCommentsPaginated, getPaginatedPosts, getSinglePost, likePost, votePoll } from "../controllers/postControllers";

const Router = express.Router()

Router.post('/createPost',protect,createPost)
Router.get('/getPosts',protect,getPaginatedPosts)
Router.get('/singlePost/:slug',protect,getSinglePost)
Router.put('/editPost/:slug',protect,editPost)
Router.post('/addComment/:slug',protect,addComment)
Router.get('/getComments/:slug',protect,getCommentsPaginated)
Router.post('/like/:slug',protect,likePost)
Router.post('/vote/:slug',protect,votePoll)

export default Router