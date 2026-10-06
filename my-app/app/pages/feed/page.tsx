"use client";

import UploadFeed from "@/app/components/feed/UploadFeed";
import FeedPosts from "@/app/components/feed/FeedPosts";
import Navbar from "@/app/components/landingPage/navbar";

const Feed = () => {

  return (
    <div className=" flex flex-col gap-[24px] bg-[#000000] border border-[#1a1a1a] ">
    <Navbar/>
    <div className=" max-w-[1920px] flex justify-center items-center bg-[#000000] min-h-screen ">
        <div className=" flex flex-col gap-6 justify-center items-center max-w-[1350px] w-full h-full ">
          <UploadFeed/>
          <FeedPosts/>
        </div>  
    </div>
    </div>
  );
};

export default Feed;
