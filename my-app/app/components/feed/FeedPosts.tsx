"use client";

import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostSlugs,
  fetchPostDetails,
  nextPage,
} from "../../redux/feedPostslice";
import FeedLoader from "../../components/loaders/FeedLoader";
import FeedPost from "./FeedPost";
import type { RootState } from "../../redux/store";

const FeedPosts = () => {
  const dispatch = useDispatch();

  const { posts, postDetails, page, limit, hasMore, loading } =
    useSelector((state: RootState) => state.posts);

  // Load initial posts
  useEffect(() => {
    dispatch(fetchPostSlugs({ page: 1, limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load next pages
  useEffect(() => {
    if (page !== 1) {
      dispatch(fetchPostSlugs({ page, limit }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Fetch details for each slug
  useEffect(() => {
    if (!posts || posts.length === 0) return;

    posts.forEach((p) => {
      if (!postDetails?.[p.slug]) {
        dispatch(fetchPostDetails({ slug: p.slug }));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, postDetails]);

  const loadMorePosts = () => {
    if (hasMore) {
      dispatch(nextPage());
    }
  };

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col w-full max-w-[700px] mx-auto"
    >
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={
          <div className="text-center">
            <FeedLoader />
          </div>
        }
        endMessage={<p className="text-center py-2">No more posts</p>}
      >
        <div className="flex gap-4 flex-col">
          {posts.map((post) => {
            const fullPost = postDetails?.[post.slug];
            return <FeedPost post={fullPost} key={post.slug} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default FeedPosts;
