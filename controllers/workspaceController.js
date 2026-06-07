const express = require('express');

const Workspace = require('../models/Workspace.js');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const { requireMember, requireAdmin } = require('../utils/checkMembership.js');
const ErrorResponse = require('../utils/errorResponse.js');

const createWorkspace = asyncHandler(async(req,res)=>{
    const {name,description} = req.body;
    if(!name){
        throw new ErrorResponse('Workspace is required',400)
    };
    const workspace = await Workspace.create({
        name:name,
        description:description || '',
        owner:req.user._id,
        members:[
            {
                user:req.user._id,
                role:'admin'
            }
        ]
    })
    res.status(201).json({
        message:"Successfully created workspace."
    })

})


const getWorkspaces = asyncHandler(async(req,res)=>{

        const workspace = await Workspace.find(
            {'members.user':req.user._id}
        )
        .populate('owner','name email')
        .sort({createdAt:-1}).lean()

        res.status(200).json(workspace)

})

const getSingleWorkspace = asyncHandler(async(req,res) =>{

    const workspace =await Workspace.findById(req.params.id)
    .populate('owner','name email')
    .populate('member.user','name email avatar')
    .populate('board','name colors createdAt')
    .lean()
    if (!workspace){
        return res.status(404).json({message:"Workspace not found."})
    }
    requireMember(workspace,req.user._id)
    return res.status(200).json(workspace)

})


const updateSingleWorkspace = asyncHandler(async(req,res) =>{

    const {name,description}=req.body
    const workspace = await Workspace.findById(req.params.id)
    if(!workspace){
        throw new ErrorResponse('Workspace not found',404)
    }
    requireAdmin(workspace,req.user._id)
    workspace.name = name || workspace.name
    workspace.description = description || workspace.description
    
    await workspace.save()
    
    return res.status(200).json(workspace)

})



const deleteSingleWorkspace = asyncHandler(async(req,res) =>{
        const workspace = await Workspace.findById(req.params.id)

        if (!workspace){
            throw new ErrorResponse('Workspace not found',404)
        }

        if(workspace.owner.toString() != req.user._id.toString()){
            throw new ErrorResponse('Only owner can delete workspace.',403)
        }

        await workspace.deleteOne()

        return res.status(200).json({
            message:"Workspace deleted successfully."
        })
    }
)


const inviteMember = asyncHandler(async(req,res) =>{
        const {email,role} = req.body
        const workspace = await Workspace.findById(req.params.id)

        if(!workspace){
            throw new ErrorResponse('Workspace not found',404)
        }
        requireAdmin(workspace,req.user._id)

        const userToInvite = await User.findOne({email})

        if (!userToInvite){
            throw new ErrorResponse('User not found',404)
        }

        const alreadyMember = workspace.members.some(
          m => m.user.toString() === userToInvite._id.toString()
        )
    
        if (alreadyMember) {
            throw new ErrorResponse('User is already a member',400)
        }

        workspace.members.push({
            user:userToInvite._id,
            role:role || 'member'
        })

        await workspace.save()

        return res.status(200).json({
            message:"Member invited successfully."
        })

})



module.exports ={
    createWorkspace,
    getWorkspaces,
    updateSingleWorkspace,
    deleteSingleWorkspace,
    inviteMember,
    getSingleWorkspace
}