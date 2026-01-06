import React, { useState, useEffect, useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ErrorIcon from '@mui/icons-material/Error';
import ReportIcon from '@mui/icons-material/Report';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard = () => {
    const [accordianDashboard, setAccordianDashboard] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (accordianDashboard && ref.current && !ref.current.contains(e.target)) {
                setAccordianDashboard(false);
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }

    }, [accordianDashboard]);


    const handleOnClickMenu = (value)=>{
        sessionStorage.setItem('func',value);
    }

    return (
        <div className='w-3/4 text-black p-5 relative'>
            <div className='wfull bg-slate-900 flex justify-between text-white item-center p-3 rounded-lg'>
                <MenuIcon sx={{ cursor: "pointer" }} onClick={() => { setAccordianDashboard(prev => !prev) }} />
                <img className='w-8 h-8 rounded-3xl border-2 ' src='https://png.pngtree.com/png-vector/20240126/ourlarge/pngtree-user-account-access-png-image_11552516.png' alt='imageeee' />
            </div>

            {
                accordianDashboard &&
                <div ref={ref} className='absolute p-3 bg-slate-900 text-white rounded-xl font-extralight'>
                    <div>Welcome to Our Gym Management System.</div>
                    <p>Feel free to ask any querries.</p>
                </div>
            }

            <div className='mt-5  pt-3 bg-slate-100 bg-opacity-50 grid gap-5 grid-cols-4 w-full pb-5 overflow-x-auto h-[80%]'>

                {/* Member Card */}
                <Link to={'/member'} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <GroupIcon sx={{ color: "green", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Joined Members</p>
                    </div>
                </Link>
                {/* Member Card */}
                <Link to={'/specific/morning-batch'} onClick={()=>handleOnClickMenu("morningBatch")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <PersonIcon sx={{ color: "green", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Morning Batch</p>
                    </div>
                </Link>

                {/* Member Card */}
                <Link to={'/specific/evening-batch'} onClick={()=>handleOnClickMenu("eveningBatch")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <PersonIcon sx={{ color: "green", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Evening Batch</p>
                    </div>
                </Link>

                {/* Member Card */}
                <Link to={'/specific/monthly'} onClick={()=>handleOnClickMenu("monthlyJoined")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <SignalCellularAltIcon sx={{ color: "purple", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Monthly Joined</p>
                    </div>
                </Link>

                {/* Member Card */}
                <Link to={'/specific/expire-within-3-days'} onClick={()=>handleOnClickMenu("threeDayExpire")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <AccessAlarmIcon sx={{ color: "red", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Expired within 3 days</p>
                    </div>
                </Link>

                {/* Member Card */}
                <Link to={'/specific/with-in-4-7-days'} onClick={()=>handleOnClickMenu("fourToSevenDayExpire")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <AccessAlarmIcon sx={{ color: "red", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Expiring within 4-7 days</p>
                    </div>
                </Link>

                {/* Member Card */}
                <Link to={'/specific/expired'}onClick={()=>handleOnClickMenu("expired")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <ErrorIcon sx={{ color: "red", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Expired</p>
                    </div>
                </Link>

                {/* Member Card */}
                <Link to={'/specific/inactive-members'} onClick={()=>handleOnClickMenu("inactiveMembers")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
                    <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                    <div className='py-7 px-5 flex-col justify-center item-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
                        <ReportIcon sx={{ color: "brown", fontSize: "50px" }} />
                        <p className='text-xl my-3 font-semibold font-mono'>Inactive Members</p>
                    </div>
                </Link>

                

            </div>

            <div className='md:bottom-4 p-4 w-3/4 mb-4 mb:mb-0 absolute bg-black text-white mt-20 rounded-xl text-xl'>
                Contact Developer for Technical Error at +917870690044
            </div>
        </div>
    )
}

export default Dashboard;