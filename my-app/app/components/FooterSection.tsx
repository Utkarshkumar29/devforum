const FooterSection=()=>{
    return(
        <div className=" max-w-[1920px] flex justify-center items-center ">
            <div className=" max-w-[1350px] flex flex-col justify-center items-center ">
                <div className=" flex flex-col justify-center items-center gap-4 ">
                    <span className=" text-[90px] leading-[90px] font-bold ">DevForum</span>
                    <span className=" text-[18px] leading-[28px] ">Join DevForum, connect, and build the future of tech together. </span>
                    <span className=" bg-[#71BC8F] w-[200px] h-[60px] text-white py-[10px] px-[42px] font-bold whitespace-nowrap flex justify-center items-center rounded-[100px] ">Subscribe now!</span>
                </div>

                <div className=" grid grid-cols-4 gap-20 pt-[100px] pb-[50px] ">
                    <div className=" flex flex-col gap-4 ">
                        <span className=" text-white font-bold text-[18px] leading-[28px] ">Company</span>
                        <div className=" flex gap-2 text-[#D9D9D9] flex-col ">
                            <span>home</span>
                            <span>Service</span>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-4 ">
                        <span className=" text-white font-bold text-[18px] leading-[28px] ">Terms & Policies</span>
                        <div className=" flex gap-2 text-[#D9D9D9] flex-col ">
                            <span>Privacy Policy</span>
                            <span>Terms & collaboration</span>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-4 ">
                        <span className=" text-white font-bold text-[18px] leading-[28px] ">Follow US</span>
                        <div className=" flex gap-2 text-[#D9D9D9] flex-col ">
                            <span>Instagram</span>
                            <span>Linkedin</span>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-4 ">
                        <span className=" text-white font-bold text-[18px] leading-[28px] ">Contact US</span>
                        <div className=" flex gap-2 text-[#D9D9D9] flex-col ">
                            <span>123 Developer Avenue, Tech City, CA <br/> +1-555-DEV-FORUM </span>
                            <span>support@devforum.com </span>
                        </div>
                    </div>
                </div>

                <div className=" pb-[50px] ">© 2025 DevForum. All rights reserved. </div>
            </div>
        </div>
    )
}

export default FooterSection