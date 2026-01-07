import React, { useEffect, useRef } from 'react';
import { ArrowBackIos } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

const MemberDetail = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Pending");
    const [renew, setRenew] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [membership, setMembership] = useState([]);
    const [planMember, setPlanMember] = useState("");
    const effectRan = useRef(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateForm, setUpdateForm] = useState({ name: "", mobileNo: "", address: "" });




    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;
        fetchData();
        fetchMembership();
    }, []);
    const fetchMembership = async () => {
        axios.get('http://localhost:4000/plans/get-membership', { withCredentials: true }).then((response) => {
            setMembership(response.data.membership);
            setPlanMember(response.data.membership[0]._id);

        }).catch(err => {
            console.log(err);
            toast.error("Something Wrong Happend");
        })
    }


    const fetchData = async () => {
        await axios.get(`http://localhost:4000/members/get-member/${id}`, { withCredentials: true }).then((response) => {
            console.log(response);
            setData(response.data.member);
            setStatus(response.data.member.status);
            toast.success(response.data.message);
        }).catch(err => {
            console.log(err);
            toast.error("Something went Worng");
        })
    }
    const handleSwitchBtn = async () => {
        let statuss = status === "Active" ? "Pending" : "Active";
        await axios.post(`http://localhost:4000/members/change-status/${id}`, { status: statuss }, { withCredentials: true }).then((response) => {
            toast.success("Status Changed");
        }).catch(err => {
            console.log(err);
            toast.error("Something Went Wrong");
        })
        setStatus(statuss);
    }
    const isDateInPast = (inputDate) => {
        /// Stock ////
        // const today = new Date(inputDate);  // get the current date
        // const givenDate = new Date(inputDate); // convert a input to a date object
        // return givenDate < today; // check if the given date is before today

        //// ChatGPT/////
        if (!inputDate) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        const billDateStr = new Date(inputDate).toISOString().split('T')[0];

        return billDateStr < todayStr;
    };

    const handleOnChangeSelect = (event) => {
        let value = event.target.value;
        setPlanMember(value);
    }

    const handleRenewSaveBtn = async () => {
        await axios.put(`http://localhost:4000/members/update-member-plan/${id}`, { membership: planMember }, { withCredentials: true }).then((response) => {
            setData(response.data.member);
            toast.success(response.data.message);
        }).catch(err => {
            toast.error("Something Went Wrong");
            console.log(err);
        })
    }


    const handleDeleteMember = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this member?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:4000/members/delete-member/${id}`, { withCredentials: true }
            );

            toast.success(response.data.message);

            // Redirect after delete
            navigate(-1);
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete member");
        }
    };

    ///////////////////// update member contents/////////////
    // const handleOpenUpdate = () => {
    //     setUpdateForm({
    //         name: data?.name || "",
    //         mobileNo: data?.mobileNo || "",
    //         address: data?.address || "",
    //         batch: data?.batch || "",
    //         bodyWeight: data?.bodyWeight || "",
    //         goal: data?.goal || "",
    //         profilePic: data?.profilePic || ""
    //     });
    //     setShowUpdate(true);
    // };
    const handleOpenUpdate = () => {
        setShowUpdate(prev => {
            // If opening modal, initialize form
            if (!prev) {
                setUpdateForm({
                    name: data?.name || "",
                    mobileNo: data?.mobileNo || "",
                    address: data?.address || "",
                    batch: data?.batch || "",
                    bodyWeight: data?.bodyWeight || "",
                    goal: data?.goal || "",
                    profilePic: data?.profilePic || ""
                });
            }
            return !prev; // toggle open/close
        });
    };



    const [loaderImage, setLoaderImage] = useState(false);
    const uploadImage = async (event) => {
        setLoaderImage(true);

        const files = event.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'GYM_MANAGEMENT');

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dyw2qac6r/image/upload", data);

            const imageUrl = response.data.secure_url;

            // 🔥 THIS IS THE FIX
            setUpdateForm(prev => ({
                ...prev,
                profilePic: imageUrl
            }));

            setLoaderImage(false);
        } catch (err) {
            console.log(err);
            setLoaderImage(false);
        }
    };


    const handleUpdateChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
    };

    const handleUpdateSave = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/members/update-member/${id}`, updateForm, { withCredentials: true });
            setData(response.data.member);
            toast.success("Member updated successfully");
            setShowUpdate(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update member");
        }
    };



    return (
        <div className='w-3/4 text-black  p-5 h-[100vh] overflow-x-auto'>
            <div onClick={() => { navigate(-1) }} className='border-2 w-fit text-xl font-sans text-white items-center p-2 rounded-lg cursor-pointer rounded-xl bg-slate-900 '>
                <ArrowBackIos /> Go Back
            </div>

            <div className='mt-2 p-2 '>
                <div className='w-[100%] h-fit flex '>
                    {/* w-1/3 mx-auto */}
                    <div className='w-1/3  mx-auto'>
                        {/* w-full */}
                        <img src={data?.profilePic} alt='profile pic' className='max-w-[270px] mx-auto rounded-lg' />
                    </div>
                    {/* mt-5 */}
                    <div className='w-2/3  text-xl grid grid-cols-2 p-5'>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Name : {data?.name}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Occopation : {data?.occupation}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Father's Name : {data?.fatherName}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Body-Weight : {data?.bodyWeight}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Mobile No.: {data?.mobileNo}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Body-Goal : {data?.goal}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Address : {data?.address}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Batch : {data?.batch}</div>


                        <div className='mt-1 mb-2 text-2xl font-semibold'>Joined Date : {data?.lastPayment.slice(0, 10).split('-').reverse().join('-')}</div>
                        <div className='mt-1 mb-2 text-2xl font-bold '>Next Bill Date : {data?.nextBillDate.slice(0, 10).split('-').reverse().join('-')}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Updated Date : {data?.createdAt.slice(0, 10).split('-').reverse().join('-')}</div>
                        <div className='mt-1 mb-2 flex gap-2 text-2xl font-semibold'>Status : <Switch onColor='#6366F1' checked={status === "Active"} onChange={() => { handleSwitchBtn() }} /></div>

                        <div onClick={handleOpenUpdate} className="mt-3  mr-5 rounded-lg p-3 border-2 border-blue-600 text-center w-full  cursor-pointer hover:bg-blue-600 hover:text-white font-semibold">
                            Update Member
                        </div>

                        <div onClick={handleDeleteMember} className="mt-3 ml-5 rounded-lg p-3 border-2 border-red-600 text-center w-full  cursor-pointer hover:bg-red-600 hover:text-white font-semibold">
                            Delete Member
                        </div>

                    </div>
                </div>
                <div>
                    <div className='w-1/3'>
                        {
                            isDateInPast(data?.nextBillDate) && <div onClick={() => { setRenew(prev => !prev) }} className={`mt-3 w-1/3 rounded-lg p-3 border-2 border-slate-900 text-center w-full  cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white ${renew && status === "Active" ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : null} `}>Renew</div>
                        }
                    </div>
                    <div className='ml-20 w-2/4'>
                        {
                            renew && status === "Active" ? (<div className='rounded-lg p-3 mt-5 mb-5 h-fit bg-slate-300 w-[100%]'>
                                <div className='w-full'>
                                    <div className='my-5'>
                                        <div>Membership</div>

                                        <select value={planMember} onChange={handleOnChangeSelect} className='w-full border-2 p-2 rounded-lg'>
                                            {
                                                membership.map((item, index) => {
                                                    return (
                                                        <option key={item._id} value={item._id}>{item.months} Month Membership : {item.price} </option>
                                                    )
                                                })
                                            }

                                        </select>

                                        <div className={`mt-4 rounded-lg p-3 border-2 border-slate-900 text-center w-1/2 mx-auto cursor-pointer hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`} onClick={() => { handleRenewSaveBtn() }}>Save</div>
                                    </div>
                                </div>
                            </div>) : null
                        }
                    </div>
                </div>

            </div>
            {/*
            {
                showUpdate && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        {/* <div className="bg-white rounded-lg p-6 w-[95%] max-w-4xl"> 
                        <div className="bg-white rounded-lg p-6 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto">



                            {/* <div className="bg-white rounded-lg p-6 w-[90%] md:w-[400px]"> 
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold mb-4">Update Member</h2>
                                Name :
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={updateForm.name}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded mb-3"
                                />
                                Mobile No:
                                <input
                                    type="text"
                                    name="mobileNo"
                                    placeholder="Mobile Number"
                                    value={updateForm.mobileNo}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded mb-3"
                                />
                                Address:
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={updateForm.address}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded mb-3"
                                />
                                Batch:
                                <select
                                    name="batch"
                                    value={updateForm.batch}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded mb-3"
                                >
                                    <option value="">Select Batch</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </select>

                                Body Weight
                                <input
                                    type="number"
                                    name="bodyWeight"
                                    placeholder="Body Weight"
                                    value={updateForm.bodyWeight}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded mb-3"
                                />
                                Goal:
                                <select
                                    name="goal"
                                    value={updateForm.goal}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded mb-3"
                                >
                                    <option value="">Select Goal</option>
                                    <option value="Cutting">Cutting</option>
                                    <option value="Bulking">Bulking</option>
                                </select>
                                Profile Pic:
                                <input type="file" onChange={(e) => { uploadImage(e) }} className="w-full mb-10 p-2 rounded-lg" />
                                {updateForm.profilePic && (
                                    <img
                                        src={updateForm.profilePic}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded mb-3"
                                    />
                                )}

                                {
                                    loaderImage && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                                        <LinearProgress color="secondary" />
                                    </Stack>
                                }

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => setShowUpdate(false)}
                                        className="px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleUpdateSave}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } 
            */}
            {showUpdate && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={() => setShowUpdate(false)} // Optional: click outside to close
                >
                    <div
                        className="bg-white rounded-lg p-6 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
                    >
                        {/* Header: Title + Close Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Update Member</h2>
                            <button
                                onClick={() => setShowUpdate(false)}
                                className="text-xl font-bold text-gray-500 hover:text-black"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form Fields */}
                        <form>
                            <div className="mb-4">
                                <label className="block font-semibold mb-1" htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    value={updateForm.name}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1" htmlFor="mobileNo">Mobile No:</label>
                                <input
                                    type="text"
                                    id="mobileNo"
                                    name="mobileNo"
                                    placeholder="Mobile Number"
                                    value={updateForm.mobileNo}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1" htmlFor="address">Address:</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={updateForm.address}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1" htmlFor="batch">Batch:</label>
                                <select
                                    id="batch"
                                    name="batch"
                                    value={updateForm.batch}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded"
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1" htmlFor="bodyWeight">Body Weight:</label>
                                <input
                                    type="number"
                                    id="bodyWeight"
                                    name="bodyWeight"
                                    placeholder="Body Weight"
                                    value={updateForm.bodyWeight}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1" htmlFor="goal">Goal:</label>
                                <select
                                    id="goal"
                                    name="goal"
                                    value={updateForm.goal}
                                    onChange={handleUpdateChange}
                                    className="w-full border-2 p-2 rounded"
                                >
                                    <option value="Cutting">Cutting</option>
                                    <option value="Bulking">Bulking</option>
                                    <option value="Fatloss">Fat Loss</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block font-semibold mb-1" htmlFor="profilePic">Profile Pic:</label>
                                <input
                                    type="file"
                                    id="profilePic"
                                    onChange={uploadImage}
                                    className="w-full p-2 rounded border-2"
                                />

                                {updateForm.profilePic && (
                                    <img
                                        src={updateForm.profilePic}
                                        alt="Preview"
                                        className="w-40 h-40 object-cover rounded mt-3"
                                    />
                                )}
                                <br/>
                                {loaderImage && (
                                    <Stack sx={{ width: '19%', color: 'grey.500' }} spacing={2}>
                                        <LinearProgress color="secondary" />
                                    </Stack>
                                )}


                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdate(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-150"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUpdateSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <ToastContainer />
        </div>
    )
}

export default MemberDetail;