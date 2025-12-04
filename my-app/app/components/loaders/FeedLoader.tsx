import ContentLoader from "react-content-loader";

const FeedLoader = ({ }) => {
  
  return (
    <div className={` bg-[#23253c]  rounded-2xl border border-[#4c4b75] mb-3 overflow-hidden max-w-[700px] max-h-[679px] w-[700px] h-[679px]`}>
      <ContentLoader
        viewBox="0 0 400 490"
        backgroundColor={"#303048"}
        foregroundColor={`#303048`}
      >
        <circle cx="20" cy="20" r="7" />
        <rect x="35" y="14" rx="2" ry="2" width="180" height="12" />
        <rect x="0" y="40" width="400" height="0.5" />
        {/* Profile picture */}
        <circle cx="30" cy="65" r="16" />

        {/* Name and meta info */}
        <rect x="60" y="50" rx="2" ry="2" width="50" height="10" />
        <rect x="60" y="65" rx="2" ry="2" width="200" height="10" />
        <rect x="60" y="80" rx="2" ry="2" width="20" height="10" />

        {/* Post text */}

        <rect x="15" y="110" rx="2" ry="2" width="370" height="12" />
        <rect x="15" y="130" rx="2" ry="2" width="330" height="12" />

        {/* Post image */}
        <rect x="15" y="160" rx="10" ry="10" width="370" height="205" />

        {/* Footer icons */}
        

      </ContentLoader>     
    </div>
  );
};

export default FeedLoader;
