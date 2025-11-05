import Image from "next/image";
import aboutSectionImg from "../../public/aboutSection.svg";

const CollaborationSection = () => {

    const testimonials=[
        {
            stars:4,
            review:"Incredible platform, seamless ",
            name:"Jelen Macllen",
            designation:"Software Engineer "
        },
        {
            stars:3.5,
            review:"I highly recommend DevForum! The platform is user-friendly, and the resources are invaluable. ",
            name:"David John",
            designation:"Web Developer "
        },
        {
            stars:4.5,
            review:"DevForum is a game-changer! I've made valuable connections and learned so much from others. ",
            name:"Sam Senthel",
            designation:"Data Scientist "
        }
    ]
    
    return (
        <div className=" max-w-[1920px] h-full flex justify-center items-center flex flex-col gap-20 py-[100px] ">
            <div className=" max-w-[1350px] h-full flex flex-col gap-10 ">
                <span className=" text-[42px] leading-[52px]  ">
                    Seamless Collaboration Tools
                </span>
                <div className=" grid grid-cols-2 gap-y-0 ">
                    <div className=" border border-white p-7 max-w-[1050px] w-fit flex justify-center items-center text-center rounded-[100px] rounded-bl-none ">
                        <span className=" font-bold text-[90px] leading-[100px] font-rateway text-[##D9D9D9] ">
                            Collaboration
                        </span>
                    </div>
                    <div className=" border border-white p-7 max-w-[1050px] w-fit flex justify-center items-center text-center rounded-[100px] rounded-bl-none ">
                        <span className=" font-bold text-[90px] leading-[100px] font-rateway text-[##D9D9D9] ">
                            Networking
                        </span>
                    </div>
                    <div className=" flex col-span-2 ">
                        <div className=" border border-white p-7 max-w-[500px] w-full flex justify-center items-center text-center rounded-[100px] rounded-bl-none ">
                            <span className=" font-bold text-[90px] leading-[100px] font-rateway text-[##D9D9D9] ">
                                Learning
                            </span>
                        </div>
                        <div className=" opacity-50 border border-white p-7 max-w-[1050px] w-fit flex justify-center items-center text-center rounded-[100px] rounded-bl-none ">
                            <span className=" font-bold text-[90px] leading-[100px] font-rateway text-[##D9D9D9] ">
                                Growth
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" max-w-[1350px] h-full flex flex-col gap-10 justify-center items-center ">
                <span className=" text-[55px] leading-[65px] ">Testimonials</span>
                <span className=" text-[18px] leading-[28px] text-center ">
                    See what our community members are saying about their<br/> experience with DevForum. 
                </span>
                <div className=" flex gap-20 ">
                    {testimonials && testimonials.map((item,index)=>{
                        const fullStars=Math.floor(item.stars)
                        const halfStars=item.stars%1!==0
                        const totalStars=5
                        return(
                            <div key={index} className="w-[370px] bg-[#71BC8F] flex flex-col gap-6 p-[30px] rounded-2xl ">
                                <div>
                                    {[...Array(totalStars)].map((_,i)=>{
                                    if(i<fullStars){
                                        return <i key={i} className="fa-solid fa-star text-amber-400"></i>
                                    } else if(i==fullStars && halfStars){
                                        return <i key={i} className="fa-solid fa-star-half-alt text-amber-400"></i>
                                    } else {
                                        return <i key={i} className="fa-solid fa-star"></i>
                                    }
                                })}
                                </div>
                                <span className=" text-[18px] leading-[28px] ">{item.review}</span>
                                <div className=" flex gap-6 border-t border-white pt-[30px] ">
                                    <Image src={aboutSectionImg} alt="Error" className=" w-[30px] h-[30px] "/>
                                    <div className=" flex flex-col ">
                                        <span className=" leading-[35px] font-bold text-[25px] ">{item.name}</span>
                                        <span className=" text-[18px] leading-[28px] font-bold text-[#ffffff9b] ">{item.designation}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default CollaborationSection;
