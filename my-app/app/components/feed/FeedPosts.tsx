"use client";

import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPostSlugs,
  fetchPostDetails,
  updatePost,
  nextPage,
} from "../../redux/feedPostslice";
import FeedLoader from "../../components/loaders/FeedLoader";
import FeedPost from "./FeedPost";

const FeedPosts = () => {
  const dispatch = useDispatch();

  const { posts, postDetails, page, limit, hasMore, loading } =
    useSelector((state) => state.posts)

  useEffect(() => {
    console.log("runnug1")
    dispatch(fetchPostSlugs({ page: 1, limit }))
    console.log("runnug2")
  }, [])

  useEffect(() => {
    if (page !== 1) {
      dispatch(fetchPostSlugs({ page, limit }));
    }
  }, [page])

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    posts.forEach((p) => {
      if (!postDetails?.[p.slug]) {
        dispatch(fetchPostDetails({ slug: p.slug }));
      }
    })    
  }, [posts, postDetails])

  const loadMorePosts = () => {
    if (hasMore) {
      dispatch(nextPage());
    }
  }

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col w-full max-w-[700px] mx-auto" 
    >
      <InfiniteScroll
      dataLength={posts.length}
      next={loadMorePosts}
      hasMore={hasMore}
      loader={<div className="text-center"><FeedLoader/></div>}
      endMessage={<p className="text-center py-2">No more posts</p>}
    >
      <div className=" flex gap-4 flex-col ">
      {posts.map((post,index) => {
        const fullPost = postDetails?.[post.slug];

        return (
          <FeedPost post={fullPost} key={index} />
        )
      })}
      </div>
    </InfiniteScroll>
    </div>
  );
};

export default FeedPosts;
