"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("/api/posts/createPost");
    setPosts(res.data);
  };

  return (
    <div className="max-w-[800px] mx-auto mt-10 space-y-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-[#1E1E1E] rounded-2xl p-4">
          <p>{post.content}</p>
          {post.imageUrl && <img src={post.imageUrl} className="rounded-xl mt-3" />}
        </div>
      ))}
    </div>
  );
};

export default Feed;
