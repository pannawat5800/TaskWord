const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

let currentStateApi = require('./api/current_state');
let placeShipeApi = require('./api/place_shipe');
let attackApi = require('./api/attack');
let resetApi = require('./api/reset');

// End point import
let mongoose = require('mongoose');
let Board = require('./model/board');
let Ship = require('./model/ship');
let initial = require('./model/reset');

mongoose.connect('mongodb://localhost:27017/TakeWorldBattleShip').then(result => {
    console.log('connection is Success');
    // inject shipe infomation 
    Ship.create([
        { name: 'Battleship', size: 4, amount: 1 },
        { name: 'Cruisers', size: 3, amount: 2 },
        { name: 'Destroyers', size: 2, amount: 3 },
        { name: 'Submarines', size: 1, amount: 4 }
    ])
}).catch(err => console.log(err));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// game start
app.get('/', (req, res) => {
    Board.create(initial)
        .then(() => res.status(200).send("game star"))
        .catch(error => res.status(400).json({ error: error }))
});


app.use('/api', currentStateApi)
app.use('/api/ship', placeShipeApi);
app.use('/api/attack', attackApi);
app.use('/api/reset', resetApi)




app.listen(port, () => console.log(`Start Game: ${port}!`));

