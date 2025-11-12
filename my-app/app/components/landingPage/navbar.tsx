import Link from "next/link";

const Navbar=()=>{
    return(
        <div className=" text-white max-w-[1980px] flex justify-center h-[100px] ">
            <div className=" max-w-[1300px] w-full flex justify-between items-center ">
                <span className=" font-medium text-[30px] ">DevForum</span>
            <div className=" flex gap-12 items-center ">
                <div className=" flex gap-8 text-[#8f8686] ">
                    <div>Home</div>
                    <div>About</div>
                    <div>Service</div>
                    <div>Contact</div>
                </div>
                <Link href={'/pages/login'} className=" cursor-pointer w-[165px] min-h-[60px] h-full bg-white rounded-4xl flex justify-center items-center text-black px-[42px] font-semibold ">Join Now</Link>
            </div>
            </div>
        </div>
    )
}

export default Navbar;