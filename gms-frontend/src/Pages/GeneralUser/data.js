import axios from "axios";

// const getMonthlyJoined =  async()=>{
//     try{
//         const response = await axios.get('http://localhost:4000/members/monthly-member',{withCredentials:true});
//         // console.log(response);
//         return response.data;

//     }catch(error){
//         console.error("Error Fetching Data: ",error);
//         throw error;
//     }
// }
 /////   chat GPT /////////////
const getMonthlyJoined = async (month, year) => {
    try {
        // Ensure month/year are numbers
        month = Number(month);
        year = Number(year);

        const response = await axios.get(`http://localhost:4000/members/monthly-member?month=${month}&year=${year}`,{ withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error Fetching Monthly Members:", error.response?.data || error.message);
        throw error;
    }
};


const threeDayExpire=async()=>{
    try{
        const response=await axios.get('http://localhost:4000/members/within-3-days-expiring',{withCredentials:true});
        return response.data;
    }catch(error){
        console.log('Error Fetching Data: ',error);
    }
}

const fourToSevenDayExpire = async()=>{
    try{
        const response=await axios.get('http://localhost:4000/members/within-4-7-days-expiring',{withCredentials:true});
        return response.data;
    }catch(error){
        console.log('Error Fetching Data: ',error);
    }
}
const expired = async()=>{
    try{
        const response=await axios.get('http://localhost:4000/members/expired-member',{withCredentials:true});
        return response.data;
    }catch(error){
        console.log('Error Fetching Data: ',error);
    }
}
const inActiveMembers = async()=>{
    try{
        const response=await axios.get('http://localhost:4000/members/inactive-member',{withCredentials:true});
        return response.data;
    }catch(error){
        console.log('Error Fetching Data: ',error);
    }
}
const morningBatch = async()=>{
    try{
        const response=await axios.get('http://localhost:4000/members/morning-batch',{withCredentials:true});
        return response.data;
    }catch(error){
        console.log('Error Fetching Data: ',error);
    }
}
const eveningBatch = async()=>{
    try{
        const response=await axios.get('http://localhost:4000/members/evening-batch',{withCredentials:true});
        return response.data;
    }catch(error){
        console.log('Error Fetching Data: ',error);
    }
}
export {getMonthlyJoined,threeDayExpire,fourToSevenDayExpire,expired,inActiveMembers,morningBatch,eveningBatch};