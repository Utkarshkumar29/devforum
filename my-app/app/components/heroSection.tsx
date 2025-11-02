const HeroSection=()=>{
    return(
        <div className=" py-[100px] px-4 flex flex-col justify-center items-center max-w-[1980px] ">
            <div className=" border border-white p-2.5 max-w-[1050px] w-full flex justify-center items-center text-center rounded-[100px] rounded-bl-none ">
                <span className=" font-bold text-[110px] leading-[120px] font-rateway text-[##D9D9D9] ">Empowering<br/> Developers.</span>
            </div>
            <div className=" flex ">
                <div className=" bg-[#D9D9D9] text-black p-2.5 max-w-[850px] w-full flex justify-center items-center text-center rounded-[100px] rounded-bl-none  "><span className=" text-[110px] font-bold leading-[120px] ">Building the Future</span></div>
                <div className=" w-[200px] h-[200px] bg-[#7371EE] rounded-[100px] flex justify-center items-center "><span>😊</span></div>
            </div>
            <div className=" pt-[24px] pb-[35px] text-left w-full max-w-[1050px] ">
                <span className=" text-[#D9D9D9] text-[18px] leading-[28px] ">Connect with fellow developers, share your expertise, and unlock exciting career prospects in<br/> the ever-evolving tech industry. </span>
            </div>
            <div className=" flex max-w-[1050px] w-full items-start ">
                <div className=" bg-[#D9D9D9] min-w-[165px] h-[60px] text-black font-bold flex items-center justify-center rounded-[100px] px-[42px] py-[10px] whitespace-nowrap text-[18px] ">Join Community</div>
                <div className=" flex justify-center items-center min-w-[165px] h-[60px] font-bold px-[42px] py-[10px]">Explore Jobs Now</div>
            </div>
        </div>
    )
}

export default HeroSection;