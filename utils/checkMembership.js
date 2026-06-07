const getMemberRole = (workspace,userId)=>{
    const member = workspace.members.find(
        m=>m.user.toString() === userId.toString()
    )
    return member ? member.role : null
}

const requireAdmin = (workspace,userId)=>{
    const role = getMemberRole(workspace,userId)
    if(role !== "admin" ){
        throw new Error("Only admin can perform this action.")
    }
    return role
}

const requireMember = (workspace,userId)=>{
    const role = getMemberRole(workspace,userId)
    if(!role){
        throw new Error("You are not a member of this workspace.")
    }
    return role
}

module.exports ={getMemberRole,requireAdmin,requireMember}