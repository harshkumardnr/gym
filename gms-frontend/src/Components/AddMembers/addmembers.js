import React, { useState, useEffect } from "react";
import axios from "axios";
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { ToastContainer, toast } from "react-toastify";
const Addmembers = () => {
    const [inputField, setInputField] = useState({ name: "", mobileNo: "", address: "", membership: "", batch: "Morning", occupation: "", fatherName: "", bodyWeight: "", goal: "Cutting", profilePic: "https://image.freepik.com/free-icon/unknown-user-symbol_318-54178.jpg", joiningDate: "" });

    const [imageLoader, setImageLoader] = useState(false);
    const [membershipList, setMembershipList] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value })
    }


    const uploadImage = async (event) => {
        setImageLoader(true);
        console.log("image uploading");
        const files = event.target.files;
        const data = new FormData();
        data.append('file', files[0]);

        // cloud name: dyw2qac6r

        data.append('upload_preset', 'GYM_MANAGEMENT');

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dyw2qac6r/image/upload", data);
            console.log(response);
            const imageUrl = response.data.url;
            setImageLoader(false);
            setInputField({ ...inputField, profilePic: imageUrl });


        } catch (err) {
            console.log(err);
            setImageLoader(false);
        }
    }

    const fetchMembership = async () => {
        await axios.get('http://localhost:4000/plans/get-membership', { withCredentials: true }).then((response) => {
            setMembershipList(response.data.membership);
            console.log(response);
            if (response.data.membership.length === 0) {
                return toast.error("No any Membership added yet", {
                    className: "text-lg"
                })
            } else {
                let a = response.data.membership[0]._id;
                setSelectedOption(a);
                setInputField({ ...inputField, membership: a });
            }

        }).catch(err => {
            console.log(err);
            toast.error("Something Wrong Happend");
        })
    }
    useEffect(() => {
        console.log(inputField);
        fetchMembership();
    }, [])

    const handleOnChangeSelect = (event) => {
        let value = event.target.value;
        setSelectedOption(value);
        setInputField({ ...inputField, membership: value });
    }
    const handleRegisterButton = async () => {
        await axios.post('http://localhost:4000/members/register-member', inputField, { withCredentials: true }).then((res) => {
            toast.success("Added Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch(err => {
            console.log(err);
            toast.error("Something Wrong Happend");
        })
    }
    return (
        <div className='text-black w-full'>
            {/* <div className='grid gap-5 grid-cols-3 text-lg'> */}
            <div className="grid gap-x-5 gap-y-6 grid-cols-3 text-lg">


                <input value={inputField.name} onChange={(event) => { handleOnChange(event, "name") }} placeholder='Name of the Joinee' type='text' className='border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 border-md h-12' />
                <input value={inputField.occupation} onChange={(e) => handleOnChange(e, "occupation")} placeholder="Joinee Occupation" type="text" className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 h-12" />
                <input value={inputField.fatherName} onChange={(e) => handleOnChange(e, "fatherName")} placeholder="Father's Name" type="text" className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 h-12" />
                <input value={inputField.bodyWeight} onChange={(e) => handleOnChange(e, "bodyWeight")} placeholder="Body Weight (kg)" type="number" className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 h-12" />
                <input value={inputField.mobileNo} onChange={(event) => { handleOnChange(event, "mobileNo") }} placeholder='Mobile Number' type='text' className='border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 border-md h-12' />
                <select value={inputField.goal} onChange={(e) => handleOnChange(e, "goal")} className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 h-12">
                    <option value="Cutting">Cutting</option>
                    <option value="Bulking">Bulking</option>
                    <option value="Fatloss">Fatloss</option>
                </select>
                <input value={inputField.address} onChange={(event) => { handleOnChange(event, "address") }} placeholder='Enter Address' type='text' className='border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 border-md h-12' />
                <input value={inputField.joiningDate} onChange={(event) => { handleOnChange(event, "joiningDate") }} type='date' data-date="" data-date-format="DD MMMM YYYY" className='border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 border-md h-12' />
                <select value={inputField.batch} onChange={(e) => handleOnChange(e, "batch")} className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 border-md h-12">
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                </select>
                <select value={selectedOption} onChange={handleOnChangeSelect} className='border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 border-md h-12 placeholder:text-gray'>
                    {
                        membershipList.map((item, index) => {
                            return (
                                <option key={index} value={item._id}>{item.months} Months Membership: {item.price}</option>
                            );
                        })
                    }
                </select>
                <input type='file' onChange={(e) => uploadImage(e)} />

                {/* <div className='w-[100px] h-[100px]'> */}
                <div className='w-[160px] h-[160px]'>

                    <img src={inputField.profilePic} alt='? Upload pic' className='w-auto h-full justify-center rounded-full' />
                    {
                        imageLoader && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                            <LinearProgress color="secondary" />
                        </Stack>
                    }
                </div>

                {/* <div onClick={() => handleRegisterButton()} className='p-3 border-2 mt-5 w-28 text-lg h-14 text-center mx-auto bg-slate-900 text-white rounded-xl hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
                    Register
                </div> */}
                <div className="col-span-3 flex justify-center mt-5">
                    <button
                        onClick={handleRegisterButton}
                        className="w-32 h-14 text-lg bg-slate-900 text-white rounded-xl hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    >
                        Register
                    </button>
                </div>



            </div>
            <ToastContainer />
        </div>
    )
}

export default Addmembers;