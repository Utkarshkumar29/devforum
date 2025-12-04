"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import UploadComponent from "@/app/components/landingPage/uploadcomponent";
import UploadFeed from "@/app/components/feed/UploadFeed";
import FeedPosts from "@/app/components/feed/FeedPosts";

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
    <div className=" max-w-[1920px] flex justify-center items-center bg-[#1d1a2d] min-h-screen ">
        <div className=" flex flex-col gap-6 justify-center items-center max-w-[1350px] w-full h-full ">
          <UploadFeed/>
          <FeedPosts/>
        </div>  
    </div>
  );
};

export default Feed;
