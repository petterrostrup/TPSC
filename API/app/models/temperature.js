// app/models/Temperature.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TemperatureSchema   = new Schema({
    time: Date,
    value: Number
});

module.exports = mongoose.model('Temperature', TemperatureSchema);
