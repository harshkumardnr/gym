import React from "react";
import Login from "../../Components/Login/login";
import Signup from "../../Components/Signup/signup";
// import GYM_BG from "./GYM_BG.jpg";



const Home = () => {
    return (
        <div className="w-full h-[100vh]">
            <div className="border-2 border-slate-800 bg-slate-800 text-white p-5 front-semibold text-xl">
                Welcome to Gym Management System
            </div>
            <div className='w-full  bg-cover flex justify-center h-[100%] bg-[url("https://img.freepik.com/premium-photo/wellequipped-fitness-gym-with-modern-exercise-machines-healthy-lifestyle_875722-33144.jpg?w=2000")]'>
            {/* <div className='w-full  bg-cover flex justify-center h-[100%]' style={{ backgroundImage: `url(${GYM_BG})` }}> */}
                <div className='w-full lg:flex gap-32'>

                    <Login/>
                    <Signup/>
                    
                </div>
            </div>
        </div>
    )
}
export default Home;