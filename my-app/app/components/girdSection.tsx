const GridSections = () => {
  const data = [
    {
      icon: "fa-solid fa-arrow-up-short-wide",
      heading: "Find Your Job",
      subheading:
        "Discover exciting opportunities tailored to your skills and experience.",
    },
    {
      icon: "fa-solid fa-circle-half-stroke",
      heading: "Share Your Posts ",
      subheading: "Engage with the community and showcase your expertise.",
    },
    {
      icon: "fa-solid fa-mobile",
      heading: "Read Articles ",
      subheading: "Stay updated with the latest trends and insights.",
    },
    {
      icon: "fa-solid fa-lock",
      heading: "Send Messages ",
      subheading: "Connect directly with other developers for collaboration.",
    },
    {
      icon: "fa-solid fa-calendar-days",
      heading: "Build Network ",
      subheading:
        "Expand your professional connections and find new opportunities. ",
    },
    {
      icon: "fa-solid fa-laptop",
      heading: "Edit Profile ",
      subheading: "Showcase your skills and experience to the community. ",
    },
    {
      icon: "fa-solid fa-arrows-up-down-left-right",
      heading: "Give Mentorship ",
      subheading:
        "Share your expertise and help others grow in their careers. ",
    },
    {
      icon: "fa-solid fa-searchengin",
      heading: "Get Mentored ",
      subheading:
        "Receive guidance from experienced developers in your field. ",
    },
  ];

  return (
    <div className="max-w-[1920px] flex items-center justify-center px-[16px] py-[50px]">
      <div className="max-w-[1300px] grid grid-cols-4 ">
        {data &&
          data.map((item, index) => {
            const isTopRow = index < 4; // first 4 cards
            const isBottomRow = index >= item.length - 4;
            return (
              <div
                key={index}
                className={` flex flex-col gap-4 border border-[#141414] w-[325px] h-auto p-[32px]  ${
                  isTopRow ? "border-t-0" : ""
                }
          ${isBottomRow ? "border-b-0" : ""}  `}
              >
                <i className={` text-2xl  ${item.icon} `}></i>
                <span className=" text-[18px] leading-[28px] font-semibold text-[#D9D9D9] ">
                  {item.heading}
                </span>
                <span className=" text-[16px] leading-[26px] text-[#D9D9D9] ">
                  {item.subheading}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GridSections;
