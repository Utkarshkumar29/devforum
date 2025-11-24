"use client";

import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, updatePost } from "@/redux/postSlice";
import { nextPage } from "@/redux/postSlice";

const FeedPosts = () => {
  const dispatch = useDispatch();

  const {
    posts,
    page,
    limit,
    hasMore,
    loading
  } = useSelector((state) => state.posts);

  // Load first page
  useEffect(() => {
    dispatch(fetchPost({ page: 1, limit }));
  }, [dispatch, limit]);

  // Load next page on scroll
  useEffect(() => {
    if (page !== 1) {
      dispatch(fetchPost({ page, limit }));
    }
  }, [page, limit, dispatch]);

  const loadMorePosts = () => {
    if (hasMore) {
      dispatch(nextPage());
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMorePosts}
      hasMore={hasMore}
      loader={<p className="text-center py-2">Loading more...</p>}
      endMessage={<p className="text-center py-2">No more posts</p>}
    >
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border-b border-gray-300 flex justify-between"
        >
          <div>
            <h3 className="font-bold">{post.slug}</h3>
            <p className="opacity-80">{post.description}</p>
          </div>

          {/* EDIT button */}
          <button
            className="text-blue-600 underline"
            onClick={() =>
              dispatch(
                updatePost({
                  slug: post.slug,
                  updatedData: {
                    description: "Updated description!",
                  },
                })
              )
            }
          >
            Edit
          </button>
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default FeedPosts;
