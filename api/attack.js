const express = require('express');
const router = express.Router();

let Board = require('../model/board');
let reset = require('../model/reset');

// End point atteacking ship

/*
    parameter : 
    {
        "coordination": {
		    "x": 2,
		    "y": 2
	    }
    }

    coordination has range between 0 - 9
*/
router.post('/', verifyInitial, async (req, res, next) => {

    if (req.unauthorization) {
        res.status(200).json({ message: '(the player needs to place all ship before start attacking' });
    } else {
        const coordination = req.body.coordination;
        let grid = req.grid;
        const result = grid[coordination.x][coordination.y]
        const doc = await Board.findOne();
        if (result == 'x') { // attack the sank ship 
            doc.doc.number_shot_actual += 1;
            const number_shot_total = doc.number_shot_total;
            const number_shot_actual = doc.number_shot_actual
            doc.save()
            .then(() => {
                if(number_shot_total <= number_shot_actual){
                    res.status(400).json({ err: "cannot attack the ship which has been sank" })
                }else{
                    res.status(200).json({message: 'game over'})
                }
            })
        } else if (result == '0') { // missing attack 
            doc.number_missing_actual += 1
            const number_missing_total = doc.number_missing_total;
            const number_missing_actual = doc.number_missing_actual;

            let message =number_missing_total <= number_missing_actual? 'game over': 'missing';
            doc.save().then(() => res.status(200).json({ message: message }));

        } else { // attack ship
            let data = findShip(req.ships, coordination)
            data.layout.forEach(element => {
                grid[element.x][element.y] = 'x';     
            });
            
            doc.grid = grid;
            doc.doc.number_shot_actual += 1;
            
            const number_shot_total = doc.number_shot_total;
            const number_shot_actual = doc.number_shot_actual
            
            doc.save()
            .then(() => {
                if(number_shot_total <= number_shot_actual){
                    res.status(200).json({message: `attack ${data.name} successfully`})
                }else{
                    res.status(200).json({message: 'game over'})
                }
            })
            .catch(err => res.status(400).json({err: err}))
            
        }
    }
});

function findShip(ships, coordination) {
    //console.log(ships);
    let data = {name: '', layout:[]};
    ships.forEach(element => {
        for (let index = 0; index < element.position.length; index++) {
            element.position[index].find(p => {
                if (p.x == coordination.x && p.y == coordination.y) {
                    //console.log(element.name)
                    data.name = element.name;
                    data.layout = element.position[index];
                    return element.name;
                }
            });
        }
    });

    return data
}

// verify the defender place all of the shipe on the board 
async function verifyInitial(req, res, next) {
    const doc = await Board.findOne()
    req.unauthorization = (doc.total_ship !== reset.full_ship);
    req.grid = doc.grid;
    req.ships = doc.ships;
    next();
}




module.exports = router;