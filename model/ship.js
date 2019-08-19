let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let shipSchema = new Schema({
    name: String,
    amount: Number,
    size: Number
})

let Ship = mongoose.model('Ship', shipSchema)

module.exports = Ship