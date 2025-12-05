const FrequentlySection=()=>{
    return(
        <div className=" max-w-[1920px] flex justify-center items-center ">
            <div className=" max-w-[1300px] w-full flex flex-col">
                <span className=" text-[55px] font-semibold leading-[65px] pb-[30px] ">Frequently Asked</span>
                <div className=" flex justify-between py-[30px] border-t border-gray-700">
                    <span className=" text-[20px] leading-[30px] font-semibold ">what is DevForum?</span>
                    <span className=" text-[16px] leading-[26px] ">DevForum is a community for developers to connect, share<br/> knowledge, find jobs, and grow their careers. </span>
                </div>
                <div className=" flex justify-between py-[30px] border-y border-gray-700">
                    <span className=" text-[20px] leading-[30px] font-semibold ">Is DevForum free?</span>
                    <span className=" text-[16px] leading-[26px] ">Yes, basic access is free. </span>
                </div>
                <div className=" flex justify-between py-[30px]">
                    <span className=" text-[20px] leading-[30px] font-semibold ">How do I? </span>
                    <span className=" text-[16px] leading-[26px] ">Simply click the &apos;Join&apos; button and follow instructions. </span>
                </div>
            </div>

        </div>
    )
}

export default FrequentlySection