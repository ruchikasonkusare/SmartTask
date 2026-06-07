const express = require('express');
const router = express.Router();
const WorkSpace = require('../models/Workspace.js');
const { protect } = require('../middleware/protect.js');

const {
    createWorkspace,
    getSingleWorkspace,
    getWorkspaces,
    deleteSingleWorkspace,
    updateSingleWorkspace,
    inviteMember
} = require('../controllers/workspaceController.js');


router.post('/',protect,createWorkspace);
router.get('/',protect,getWorkspaces);
router.get('/:id',protect,getSingleWorkspace);
router.put('/:id',protect,updateSingleWorkspace);
router.delete('/:id',protect,deleteSingleWorkspace);
router.post('/:id/invite',protect,inviteMember);


module.exports = router