import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import MemberCard from '../../Components/MemberCard/memberCard';
import { getMonthlyJoined, threeDayExpire, fourToSevenDayExpire, expired, inActiveMembers, morningBatch, eveningBatch } from './data';

const GeneralUser = () => {
    const [header, setHeader] = useState("");
    const [data, setData] = useState([]);


    ////// Chat GPT ////////////
    // ✅ Add this here
    const func = sessionStorage.getItem('func'); // current page function

    // Only set month/year state if on monthlyJoined page
    const [selectedMonth, setSelectedMonth] = useState(func === "monthlyJoined" ? new Date().getMonth() + 1 : null);
    const [selectedYear, setSelectedYear] = useState(func === "monthlyJoined" ? new Date().getFullYear() : null);

    const handleFetchByMonth = async () => {
        if (!selectedMonth || !selectedYear) return;
        setHeader(`Members Joined in ${selectedMonth}/${selectedYear}`);
        const datas = await getMonthlyJoined(selectedMonth, selectedYear);
        setData(datas.members);
    };

    useEffect(() => {
        const func = sessionStorage.getItem('func');
        functionCall(func);
    }, []);

    const functionCall = async (func) => {
        switch (func) {
            case "monthlyJoined":

                setHeader("Monthly Joined Members");
                var datas = await getMonthlyJoined();
                setData(datas.members);
                break;

            case "threeDayExpire":

                setHeader("Expire within 3 days Members");
                var datas = await threeDayExpire();
                setData(datas.members);
                break;

            case "fourToSevenDayExpire":

                setHeader("Expire in 4-7 days Members");
                var datas = await fourToSevenDayExpire();
                setData(datas.members);
                break;

            case "expired":

                setHeader("Expired Members");

                var datas = await expired();
                setData(datas.members);
                break;

            case "inactiveMembers":

                setHeader("Inactive Members");
                var datas = await inActiveMembers();
                setData(datas.members);
                break;

            case "morningBatch":

                setHeader("Morning Batch");
                var datas = await morningBatch();
                setData(datas.members);
                break;

            case "eveningBatch":

                setHeader("Evening Batch");
                var datas = await eveningBatch();
                setData(datas.members);
                break;

            default:
                break;
        }

    }

    return (
        <div className='text-black p-5  w-3/4 flex-col h-[100vh]'>
            <div className='border-2 bg-slate-900 flex justify-between w-full text-white rounded-lg p-3'>
                <Link to={'/dashboard'} className='border-2 pl-3 pr-3 pt-1 pb-1 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black'>
                    <ArrowBackIcon />Back to Dashboard
                </Link>
            </div>

            <div className='mt-3 mb-3 text-xl text-slate-900'>
                {header}
            </div>

            {/* ///////////// Chat GPT ////////////////// */}
           
            {func === "monthlyJoined" && (
                <div className='flex justify-end gap-2 mt-0 gap-4 items-enter'>
                    <div className='text-xl mt-2'>Search By Month & Year :</div>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className='border rounded px-1'
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className='w-20 border rounded px-1'
                    />

                    <button
                        onClick={handleFetchByMonth}
                        className='px-6 py-2 bg-blue-500 text-white rounded text-lg hover:bg-blue-600 transition'
                    >
                        Fetch
                    </button>
                </div>
            )}



            <div className='bg-slate-100 p-5 mt-1 mb-0 rounded-lg grid grid-cols-1 gap-2 md:grid-cols-3 overflow-x-auto h-[80%]'>
                {
                    data.map((item, index) => {
                        return (
                            <MemberCard key={item._id} item={item} />

                        );
                    })
                }

            </div>
        </div>
    )
}

export default GeneralUser;