let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let boardSchema = new Schema({
    grid: [[String]],
    description: String,
    ships: [{
        name: String,
        amount: Number,
        position: [[{ x: Number, y: Number }]]
    }],
    total_ship: Number,
    full_ship: Number,
    number_shot_total: Number,
    number_shot_actual: Number,
    number_missing_total: Number,
    number_missing_actual: Number
})


let Board = mongoose.model('Board', boardSchema)

module.exports = Board