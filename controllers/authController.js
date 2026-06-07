const express = require('express');

const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const generateTokens = (id) =>{
    return jwt.sign({id},process.env.JWT_KEY,{expiresIn:'7d'})
}

const registerUser = async(req,res)=>{
    try{
        const {name, email, password}= req.body;

        if (!name || !email || !password){
            return res.status(400).json({message:"All fields are required."})
        };

        const userExists= await User.findOne({email});
        if ( userExists ){
            return res.status(400).json({message:"User already exists."});
        }

        const hashedpassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedpassword,
        });

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateTokens(user._id)
        });

    }
    catch(error){
        console.error("REGISTER ERROR:", error);  
        res.status(500).json({message:error.message});
    };
}

const loginUser = async(req,res)=>{
    try{
        const {email ,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({message:'User not found.'});
        }

        const matchpassword = await bcrypt.compare(password,user.password);
        if (!matchpassword){
            return res.status(400).json({message:'Invalid email or password.'});
        }

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateTokens(user._id)
        })
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

module.exports = {registerUser, loginUser};