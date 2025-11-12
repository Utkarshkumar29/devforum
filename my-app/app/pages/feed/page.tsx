"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import UploadComponent from "@/app/components/landingPage/uploadcomponent";
import UploadFeed from "@/app/components/feed/UploadFeed";

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
    <div className=" max-w-[1920px] flex justify-center items-center ">
        <div className=" flex justify-center items-center max-w-[1350px] w-full h-full ">
          <UploadFeed/>
        </div>  
    </div>
  );
};

export default Feed;
