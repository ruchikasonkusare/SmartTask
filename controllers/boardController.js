const express = require('express')
const Workspace = require('../models/Workspace.js');
const Board = require('../models/Board.js');
const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');
const { requireMember, requireAdmin } = require('../utils/checkMembership.js');
const ErrorResponse = require('../utils/errorResponse.js');


const createBoard = asyncHandler(async(req,res)=>{
    const {name,workspaceId,color}=req.body;
    if(!name){
        throw new ErrorResponse("Board name is required",400)
    }
    if(!workspaceId){
        throw new ErrorResponse("Workspace ID is required",400)
    }

    const workspace = Workspace.findById(workspaceId)
    if(!workspace){
        throw new ErrorResponse("Workspace not found",404)
    }

    requireMember(workspace,req.user._id);
    const board = Board.create({
        name,
        workspace:workspaceId,
        color:color || '#4f7cff',
        createdBy: req.user._id,
        columns:[
            {name:"Todo",order:0},
            {name:"In progess",order:1},
            {name:"Done",order:2}
        ]
    })

    await Workspace.updateOne(
        {_id:workspaceId},
        {
            $push:{boards:board._id}
        }
    )
    res.status(200).json({success:true,data:board})
})


const getBoardsbyWorkspace = asyncHandler(async(req,res)=>{
    const workspace = await Workspace.findById(req.params.workspaceId)
    if(!workspace){
        throw new ErrorResponse("Workspace not found",404)
    }
    requireMember(workspace,req.user._id)
    const board = Board.find({ workspace: req.params.workspaceId })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean()

    res.status(200).json({success: true, count: boards.length, data: boards})

})


const getSingleBoard = asyncHandler(async(req,res)=>{
    const board = await Board.findById(req.params.boardId)
    .populate("createdBy","name email")
    .populate("workspace","name members")
    if(!board){
        throw new ErrorResponse("Board not found",404)
    }

    const workspace = await Board.findById(board.workspace._id)
    if(!workspace){
        throw new ErrorResponse("Workspace not found",404)
    }

    requireMember(workspace,req.user._id)
    res.status(200).json({success: true, data: boards})

})


const updateBoard = asyncHandler(async(req,res)=>{
    const {name,color}=req.body;
    const board = await Board.findById(req.params.boardId)
    if(!board){
        throw new ErrorResponse("Board not found",404)
    }
        const workspace = await Board.findById(board.workspace._id)
    if(!workspace){
        throw new ErrorResponse("Workspace not found",404)
    }

    requireAdmin(workspace,req.user._id)

    const updatedData = await Board.findByIdAndUpdate(req.params.id,{
        name: name || board.name,
        color: color || board.color
    },{ new: true, runValidators: true })
    res.status(200).json({success: true, data: updatedData})
})

const deleteBoard = asyncHandler(async(req,res)=>{
    const board = await Board.findById(req.params.boardId)
    if(!board){
        throw new ErrorResponse("Board not found",404)
    }
    const workspace = await Board.findById(board.workspace._id)
    if(!workspace){
        throw new ErrorResponse("Workspace not found",404)
    }

    requireAdmin(workspace,req.user._id)

    await Workspace.updateOne(
        {workspaceId:board.workspace._id},
        {
            $pull:{boards:board._id}
        }
    )
    await Board.deleteOne();

    res.status(200).json({success: true, message:'Board deleted'})
})


module.exports = { 
createBoard,
getBoardsbyWorkspace,
getSingleBoard,
updateBoard,
deleteBoard
}