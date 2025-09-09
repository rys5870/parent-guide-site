import mongoose from "mongoose";

export const ConnectDB = async ()=>{
    await mongoose.connect("mongodb+srv://r0534107876:MHVO0DFIYQuUpiQc@cluster0.fm1kkkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("DB Conect");
    
}