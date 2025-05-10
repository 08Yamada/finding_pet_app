import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req,res)=>{
    const {username, email, pass} = req.body;

    // HASH THE PASSWORD

    const hashedPassword = await bcrypt.hash(pass, 10);

    //db operations
    // console.log(req.body)
    console.log(hashedPassword)

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
        data:{
            username,
            email,
            password: hashedPassword,
        },
    });
    const {password, ...others} = newUser
    console.log(newUser)
    res.json(others)
};
export const login = (req,res)=>{
    //db operations
};
export const logout = (req,res)=>{
    //db operations
};