"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    //const res = await axios.get("/api/posts/createPost");
    //setPosts(res.data);
  };

  return (
    <div className="max-w-[800px] mx-auto mt-10 space-y-6">
      Feed
    </div>
  );
};

export default Feed;
