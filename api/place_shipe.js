const express = require('express');
const router = express.Router();
let mongoose = require('mongoose');

let Board = require('../model/board');
let Shipe = require('../model/ship');


/*
    parameter require :
    {
        "ship": "Battleship",
        "coordination": {
            "x": 2,
            "y": 2
        },
	    "direction":"vertical"
    }
*/

router.post('/', shipSelect, verifyIsIlligal, async (req, res, next) => {
    let board = req.board;
    const body = req.body;
    if (req.illegal) {
        res.status(400).json({ message: 'the ship placement does not allow' });
    } else if (req.ship.amount <= board.ships.find(data => data.name === body.ship).amount) {
        res.status(400).json({ err: `${req.ship.name} run out of` });
    }
    else {

        const ship = req.ship;
        if (req.body.direction === 'horizontal') {
            for (let index = body.coordination.x; index < (body.coordination.x + ship.size); index++) {
                board.grid[index][body.coordination.y] = '1';
            }
            let index = board.ships.findIndex(data => data.name === body.ship);
            let arr = Array.from({ length: ship.size }, (v, k) => {
                let position = { x: (body.coordination.x + k), y: body.coordination.y };
                k = k + 1;
                return position
            });
            //console.log(arr)
            board.ships[index].position.push(arr)
            board.ships[index].amount += 1;
            board.total += 1
        } else {
            for (let index = body.coordination.y; index < (body.coordination.y + ship.size); index++) {
                board.grid[body.coordination.x][index] = '1';
            }
            let index = board.ships.findIndex(data => data.name === body.ship);
            let arr = Array.from({ length: ship.size }, (v, k) => {
                let position = { x: body.coordination.x, y: (body.coordination.y + k) };
                k = k + 1;
                return position
            });
            board.ships[index].position.push(arr)
            board.ships[index].amount += 1;
            board.total_ship += 1
        }
        const doc = await Board.findOne();
        doc.grid = board.grid;
        doc.ships = board.ships;
        doc.total_ship = board.total_ship;
        doc.save().then(() => res.status(200).send('place'));
    }
})

function shipSelect(req, res, next) {
    let body = req.body;
    //const ship = await Board.findOne().where("name").equals(req.);

    Shipe.findOne().where('name').equals(body.ship).then(data => {
        //console.log(data)
        req.ship = data

        next();
    })
}


// check the  ship is close to others or not.
// if it closes, it will set to be illegate
function verifyIsIlligal(req, res, next) {
    const body = req.body;
    const ship = req.ship;

    // square 8  position to check 
    const square_nom = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ]
    Board.findOne().then(data => {
        //console.log(ship);
        let grid = data.grid;
        req.board = data;

        if (body.direction === 'horizontal') {
            let isOutOfBound = (body.coordination.x + ship.size) >= 10;
            if (isOutOfBound) {
                req.illegal = true;
            } else {
                for (let index = body.coordination.x; index < (body.coordination.x + ship.size); index++) {
                    // check square  if it out of boundary , it will not check
                    square_nom.forEach(position => {
                        let x = index + position.x; let y = body.coordination.y + position.y
                        let xOut = x < 0 || x >= 10 ? true : false;
                        let yOut = y < 0 || y >= 10 ? true : false;
                    
                        if (!(xOut || yOut)) {
                            if (grid[x][y] !== '0') {
                                req.illegal = true
                            }
                        }
                    })
                }
            }
        } else if (body.direction === 'vertical') {
            let isOutOfBound = body.coordination.y < 0 || body.coordination.y >= 10 || (body.coordination.y + ship.size) >= 10;
            if (isOutOfBound) {
                req.illegal = true;
            } else {
                for (let index = body.coordination.y; index < (body.coordination.y + ship.size); index++) {
                     // check square  if it out of boundary , it will not check
                    square_nom.forEach(position => {
                        let x = body.coordination.x + position.x; let y = index + position.y;
                        let xOut = x < 0 || x >= 10 ? true : false;
                        let yOut = y < 0 || y >= 10 ? true : false;
                        //let outOfBound = (xOut || yOut) ? 'out' : 'dose not out';
                        //console.log(`x: ${x}, y: ${y}, resultX: ${outOfBound}`)
                        if (!(xOut || yOut) && grid[x][y] !== '0') {
                            req.illegal = true
                        }
                    });
                }
            }
        }
        next();
    })
}

module.exports = router;



