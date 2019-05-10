// app/models/temperature.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TemperatureSchema   = new Schema({
    sensor: String,
    time: Date,
    temp: Number
});

module.exports = mongoose.model('Temperature', TemperatureSchema);
