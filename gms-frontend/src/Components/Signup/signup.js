import React, { useState } from "react";
import './signup.css';
import Modal from "../Modal/modal";
import ForgotPassword from "../ForgotPassword/forgotPassword";
import axios from 'axios';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { toast, ToastContainer } from 'react-toastify';

const Signup = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputField, setInputField] = useState({ gymName: "", email: "", userName: "", password: "", profilePic: "https://wallpapercave.com/wp/wp2639536.jpg" });
    const [loaderImage, setLoaderImage] = useState(false);

    const handleClose = () => {
        setForgotPassword(prev => !prev);
    }
    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    }


    const uploadImage = async (event) => {
        setLoaderImage(true);
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
            setLoaderImage(false);
            setInputField({ ...inputField, profilePic: imageUrl })


        } catch (err) {
            console.log(err);
            setLoaderImage(false);
        }
    }

    const handleRegister = async () => {
        await axios.post("http://localhost:4000/auth/register", inputField).then((resp) => {
            console.log(resp)
            const successMsg = resp.data.message;
            toast.success(successMsg);
        }).catch(err => {
            const errorMessage = err.response.data.error;
            // console.log(errorMessage);
            toast.error(errorMessage);
        })
    }

    return (
        <div className="customSignup w-1/3 p-10 mt-20 ml-20 bg-gray-50 bg-opacity-50 h-[450px] overflow-y-auto">
            <div className='font-sans text-white text-center text-3xl'>Register your GYM</div>
            <input value={inputField.email} onChange={(event) => { handleOnChange(event, "email") }} type='text' className="w-full my-10 p-2 rounded-lg" placeholder="Enter Email:" />
            <input value={inputField.gymName} onChange={(event) => { handleOnChange(event, "gymName") }} type='text' className="w-full mb-10 p-2 rounded-lg" placeholder="Enter GYM Name:" />
            <input value={inputField.userName} onChange={(event) => { handleOnChange(event, "userName") }} type='text' className="w-full mb-10 p-2 rounded-lg" placeholder="Enter Username:" />
            <input value={inputField.password} onChange={(event) => { handleOnChange(event, "password") }} type='password' className="w-full mb-10 p-2 rounded-lg" placeholder="Enter Password:" />

            <input type="file" onChange={(e) => { uploadImage(e) }} className="w-full mb-10 p-2 rounded-lg" />

            {
                loaderImage && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                    <LinearProgress color="secondary" />
                </Stack>
            }
            <img src={inputField.profilePic} className="h-[200px] w-[250px] mb-10" alt="Gym Pic" />


            <div className='p-2 w-[80%] border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer' onClick={() => handleRegister()}>Register</div>
            <div className='p-2 w-[80%] mt-5 border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer' onClick={() => handleClose()}>Forgot Password</div>

            {
                forgotPassword && <Modal header="Forgot Password" handleClose={handleClose} content={<ForgotPassword />} />
            }
            <ToastContainer/>
        </div>
    )
}
export default Signup;