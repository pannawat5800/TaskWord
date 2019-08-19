const express = require('express');
const router = express.Router();
let mongoose = require('mongoose');
let Board = require('../model/board');



router.get('/', (req, res, next) =>{
    Board.findOne().then(result => 
        res.status(200).json(result)
    ).catch(error => res.status(400).json({err:error}))
})


module.exports = router;

