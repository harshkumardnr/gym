const Member = require('../Modals/member');
const Membership = require('../Modals/membership');

exports.getAllMember = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const members = await Member.find({ gym: req.gym._id });
        const totalMember = members.length;

        const limitedMembers = await Member.find({ gym: req.gym._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            message: members.length ? "Fetched Members Successfully" : "No any Member Registered yet",
            members: limitedMembers,
            totalMembers: totalMember
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
}

function addMonthsToDate(months,joiningDate){
    // get Current year, month and day
    let today=joiningDate;
    const currentYear=today.getFullYear();
    const currentMonth = today.getMonth();    // Months are 0 indexed
    const currentDay=today.getDate();   

    //calculate the new month and year
    const futureMonth=currentMonth +months;
    const futureYear=currentYear + Math.floor(futureMonth/12);

    // calculate the correct future month (modulus for month)
    const adjustedMonth=futureMonth % 12;

    //set the date to the first of the future month
    const futureDate= new Date(futureYear,adjustedMonth,1);

    //get the last date of the future month
    const lastDayOfFutureMonth = new Date (futureYear,adjustedMonth + 1,0).getDate();

    //Adjust the day if current exceeds the no of days in the new month
    const adjustedDay=Math.min(currentDay, lastDayOfFutureMonth);

    //set the final adjusted day
    futureDate.setDate(adjustedDay);

    return futureDate;

}
exports.registerMember = async (req, res) => {
    try {
        const { name, mobileNo, address, membership, batch,occupation,fatherName,goal,bodyWeight,profilePic, joiningDate } = req.body;
        const member = await Member.findOne({ gym: req.gym._id, mobileNo });
        if (member) {
            return res.status(409).json({ error: "Already registered with this Mobile No" });
        }
        const memberShip = await Membership.findOne({ _id: membership, gym: req.gym._id });
        const membershipMonth = memberShip.months;

        if (memberShip) {
            let jngDate = new Date(joiningDate);
            const nextBillDate = addMonthsToDate(membershipMonth, jngDate);
            let newmember = new Member({ name, mobileNo, address,occupation,fatherName,bodyWeight, goal,membership,batch, gym: req.gym._id, profilePic,lastPayment: jngDate, nextBillDate });
            await newmember.save();
            res.status(200).json({ message: "Member Registered Successfully", newmember,member });


        } else {
            return res.status(400).json({ error: "No such Member are there." })
        }



    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
}

exports.searchMember=async(req,res)=>{
    try{
        const {searchTerm}=req.query;
        const member = await Member.find({gym:req.gym._id,
            $or:[{name:{$regex:'^' + searchTerm,$options:'i'}},
            {mobileNo:{$regex:'^' + searchTerm,$options:'i'}}
        ]

        });
        res.status(200).json({
            message:member.length ? "Fetched Member Successfully" : "No such Member Registered yet",
            members:member,
            totalMembers:member.length
        })

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

                //////////  stock ///////////////
// exports.monthlyMember =async(req,res)=>{
//     try{
//         const now =new Date();
//         //get the first date of the current month (e.g.,   2025-12-20 00:00:00)
//         const startOfMonth=new Date(now.getFullYear(),now.getMonth(),1);

//         //get the last day of the current month (e.g., 2025-)
//         const endOfMonth=new Date(now.getFullYear(),now.getMonth() + 1, 0, 23, 59, 59, 999);

//         const member = await Member.find({gym:req.gym._id,
//             createdAt: {
//                 $gte : startOfMonth,   // Greater than or equal to the first day of the month
//                 $lte : endOfMonth      // Less than or equal to the last day of the month
//             }
//         }).sort({createdAt : -1});

//         res.status(200).json({
//             message:member.length?"Fetched Member Successfully" : "No such Member Registered yet",
//             members:member,
//             totalMembers:member.length
//         })

//     }catch(err){
//         console.log(err);
//         res.status(500).json({error:"Server Error"});
//     }
// }

                /////////////  chat GPT /////////////
exports.monthlyMember = async (req, res) => {
    try {
        // Get month and year from query parameters
        let { month, year } = req.query;

        // Convert to numbers (important!)
        month = month ? parseInt(month) : null;
        year = year ? parseInt(year) : null;

        let startOfMonth, endOfMonth;

        if (month && year) {
            // Make sure month is between 1-12
            if (month < 1 || month > 12) {
                return res.status(400).json({ error: "Invalid month" });
            }
            startOfMonth = new Date(year, month - 1, 1);
            endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        } else {
            // Default to current month
            const now = new Date();
            startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        const members = await Member.find({
            gym: req.gym._id,
            lastPayment: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ lastPayment: -1 });

        res.status(200).json({
            message: members.length ? "Fetched Members Successfully" : "No members registered in this month",
            members,
            totalMembers: members.length
        });
    } catch (err) {
        console.error("Monthly Member Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
};



exports.expiringWithin3Days = async(req,res)=>{
    try{
        const today = new Date();
        const nextThreeDays=new Date();
        nextThreeDays.setDate(today.getDate()+3);
        const member= await Member.find({gym:req.gym._id,
            nextBillDate:{
                $gte : today,            //Greater than or equal to today
                $lte : nextThreeDays   //Less than or equal to 3 days from today
            }
        });

        res.status(200).json({
            message:member.length?"Fetched Member Successfully" : "No such Member Expiring within 3 days",
            members:member,
            totalMembers:member.length
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server error"});
    }
}

exports.expiringWithin4To7Days=async(req,res)=>{
    try{
        const today=new Date();
        const next4Days=new Date();
        next4Days.setDate(today.getDate()+4);

        const next7Days = new Date();
        next7Days.setDate(today.getDate()+7);

        const member= await Member.find({gym:req.gym._id,
            nextBillDate:{
                $gte : next4Days,            // 4 days later from today
                $lte : next7Days   //Less than or equal to 7 days from today
            }
        });

        res.status(200).json({
            message:member.length?"Fetched Member Successfully" : "No such Member Expiring within 4-7 days",
            members:member,
            totalMembers:member.length
        })


    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}


exports.expiredMember =async(req,res)=>{
    try{
        const today=new Date();
        const member=await Member.find({gym:req.gym._id,status:"Active",
            nextBillDate :{
                $lt: today,
            }
        });

        res.status(200).json({
            message:member.length?"Fetched Member Successfully" : "No such Member has been Expired.",
            members:member,
            totalMembers:member.length
        })

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}


exports.inActiveMember=async(req,res)=>{
    try{
        const member=await Member.find({gym:req.gym._id,status:"Pending"});
        res.status(200).json({
            message:member.length?"Fetched Member Successfully" : "No such Member is Pending.",
            members:member,
            totalMembers:member.length
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

exports.morningBatch=async(req,res)=>{
    try{
        const member=await Member.find({gym:req.gym._id,batch:"Morning"});
        res.status(200).json({
            message:member.length?"Fetched Member Successfully" : "No such Member is Pending.",
            members:member,
            totalMembers:member.length
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}
exports.eveningBatch=async(req,res)=>{
    try{
        const member=await Member.find({gym:req.gym._id,batch:"Evening"});
        res.status(200).json({
            message:member.length?"Fetched Member Successfully" : "No such Member is Pending.",
            members:member,
            totalMembers:member.length
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

exports.getMemberDetails= async(req,res)=>{
    try{
        const {id} =req.params;
        const member=await Member.findOne({_id:id,gym:req.gym._id});
        if(!member){
            return res.status(400).json({error:"No such Member"});
        }
        res.status(200).json({message:"Member Data Fetched",member:member});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

exports.changeStatus =async(req,res)=>{
    try{
        const {id} =req.params;
        const {status} =req.body;
        const member=await Member.findOne({_id:id,gym:req.gym._id});
        if(!member){
            return res.status(400).json({error:"No such Member"});
        }
        member.status=status;
        await member.save();
        res.status(200).json({
            message:"Status Changed Successfully"
        });

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

exports.updateMemberPlan =async(req,res)=>{
    try{
        const {membership} =req.body;
        const {id} =req.params;
        const memberShip= await Membership.findOne({gym:req.gym._id,_id:membership});
        if(memberShip){
            let getMonth=memberShip.months;
            let today=new Date();
            let nextBillDate=addMonthsToDate(getMonth,today);
            const member=await Member.findOne({gym:req.gym._id,_id:id});
            if(!member){
                return res.status(409).json({error:"No such Member are there"})
            }
            member.membership = membership;
            member.nextBillDate=nextBillDate;
            member.lastPayment=today;
            await member.save();
            res.status(200).json({message:"Member renewed Successfully",member});

        }else{
            res.status(400).json({error:"No such Membership are there"});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}
exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        await Member.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Member deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete member"
        });
    }
};
   

exports.updateMember= async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                mobileNo: req.body.mobileNo,
                address: req.body.address,
                batch: req.body.batch,
                bodyWeight: req.body.bodyWeight,
                goal: req.body.goal,
                profilePic: req.body.profilePic,
            },
            { new: true }
        );

        res.status(200).json({
            message: "Member updated successfully",
            member
        });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
