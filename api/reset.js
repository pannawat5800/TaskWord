const express = require('express');
const router = express.Router();
let mongoose = require('mongoose');

let reset = require('../model/reset');
let Board = require('../model/board');


router.post('/', async (req, res, next) =>{
    const doc = await Board.findOne();
    doc.grid = reset.grid;
    doc.ships = reset.ships;
    doc.total_ship = reset.total_ship;
    doc.number_shot_actual = reset.number_shot_actual;
    doc.number_missing_actual = reset.number_missing_actual;
    doc.save().then(() => res.status(200).json({message: 'reset successfully'}));
})


module.exports = router;