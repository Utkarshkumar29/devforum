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

const FeedPosts = () => {
  const dispatch = useDispatch();

  const { posts, postDetails, page, limit, hasMore, loading } =
    useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(fetchPostSlugs({ page: 1, limit }))
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
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMorePosts}
      hasMore={hasMore}
      loader={<p className="text-center py-2"><FeedLoader/></p>}
      endMessage={<p className="text-center py-2">No more posts</p>}
    >
      {posts.map((post) => {
        const fullPost = postDetails?.[post.slug];

        return (
          <div
            key={post.id}
            className="p-4 border-b border-gray-300 flex justify-between"
          > 
            <div className="flex-1">
              <h3 className="font-bold">{fullPost?.user?.display_name ?? post.slug}</h3>

              {/* Description */}
              <p className="opacity-80">
                {fullPost ? fullPost.description : "Loading post..."}
              </p>

              {/* Images */}
              {fullPost?.imageArray?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {fullPost.imageArray.map((img) => (
                    <img
                      key={img}
                      src={img}
                      alt="post media"
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Poll */}
              {fullPost?.poll && (
                <div className="mt-2">
                  <p className="font-semibold">{fullPost.poll.poll_description}</p>
                  {fullPost.poll.options.map((opt, idx) => (
                    <p key={idx}>• {opt.optionText} ({opt.votes})</p>
                  ))}
                </div>
              )}

              {/* Repost (example) */}
              {fullPost?.repost?.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Repost by {fullPost.repost[0]?.user?.display_name ?? "someone"}
                </div>
              )}
            </div>

            {/* EDIT button (only show when fullPost exists) */}
            <div className="ml-4 flex items-start">
              <button
                className="text-blue-600 underline"
                onClick={() =>
                  dispatch(
                    updatePost({
                      slug: post.slug,
                      updatedData: { description: "Updated description!" },
                    })
                  )
                }
              >
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </InfiniteScroll>
  );
};

export default FeedPosts;
