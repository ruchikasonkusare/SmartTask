const express = require('express');
const router = express.Router();
const Board = require('../models/Boarrd.js');
const { protect } = require('../middleware/protect.js');

const {
    createBoard,
    getBoardsbyWorkspace,
    getSingleBoard,
    updateBoard,
    deleteBoard
} = require('../controllers/boardController.js');


router.post('/',protect,createBoard);
router.get('/',protect,getBoardsbyWorkspace);
router.get('/:id',protect,getSingleBoard);
router.put('/:id',protect,updateBoard);
router.delete('/:id',protect,deleteBoard);

module.exports = router