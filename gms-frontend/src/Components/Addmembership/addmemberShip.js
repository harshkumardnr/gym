import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRef } from "react";
const AddmemberShip = ({handleClose}) => {

    const [inputField, setInputField] = useState({ months: "", price: "" });
    const [membership, setMembership] = useState([]);
    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value })
    }

    const fetchMembership = async () => {
        await axios.get('http://localhost:4000/plans/get-membership', { withCredentials: true }).then((res) => {
            // console.log(res);
            setMembership(res.data.membership);
            toast.success(res.data.membership.length + " Membership Fetched");

        }).catch(err => {
            console.log(err);
            toast.error("Something Wrong Happend");
        })
    }
        ////stock/////
    // useEffect(() => {
    //     fetchMembership();
    // }, []);

    
        ////// ChatGPT////////
    const fetchedOnce = useRef(false);
    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;
        fetchMembership();
    }, []);

    const handleAddmembership=async()=>{
        await axios.post('http://localhost:4000/plans/add-membership',inputField,{ withCredentials:true}).then((response)=>{
            toast.success(response.data.message);
            // console.log(response);
            handleClose();
        }).catch(err=>{
            console.log(err);
            toast.error("Something Wrong Happend");
        })
    }

    return (
        <div className='text-black'>
            <div className="flex flex-wrap gap-5 items-center justify-center ">
                {
                    membership.map((item,index) => {
                    // membership.map((item) => {
                    
                        return (
                            <div key={item._id} className='text-lg bg-slate-900 text-white border-2 pl-2 pr-2 flex-col gap-3 justify-between pt-1 pb-1 rounded-xl font-semibold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
                                <div>{item.months} Month Membership</div>
                                <div>Rs {item.price}</div>
                            </div>
                        )
                    })
                }

            </div>
            <hr className='mt-10 mb-10' />
            <div className="flex gap-10 mb-10">

                <input value={inputField.months} onChange={(event) => { handleOnChange(event, "months") }} type='number' className='border-2 rounded-lg text-lg w-1/3 h-1/2 p-2 ' placeholder='Add no. of Months' />
                <input value={inputField.price} onChange={(event) => { handleOnChange(event, "price") }} type='number' className='border-2 rounded-lg text-lg w-1/3 h-1/2 p-2 ' placeholder='Add Price' />
                <div onClick={()=>{handleAddmembership()}} className='text-lg border-2 p-1 w-auto mt-0 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>Add +</div>

            </div>
            <ToastContainer />
        </div >
    )
}

export default AddmemberShip;