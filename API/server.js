// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var aggregator = require('./app/aggregators/temp_average_minute')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://mongo:27017/'); // connect to our database
mongoose.set('useNewUrlParser', true);

var Bear     = require('./app/models/bear');
var Temperature = require('./app/models/temperature')
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    console.log(mongoose.connection.readyState);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
        console.log(bear);

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

        

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        console.log("Getting Bears");
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// on routes that end in /temp
// ----------------------------------------------------
router.route('/temp')

    // process temperatures (accessed at POST http://localhost:8080/api/temp)
    .post(function(req, res) {
        var tempsToSend = aggregator.average_on_minute(req.body);
        console.log(tempsToSend);

        // save the temp and check for errors
        Temperature.collection.insert(tempsToSend, function (err, docs) {
            if (err){ 
                return console.error(err);
            } else {
              console.log("Multiple temperatures inserted to Temperatures collection");
              res.json({ message: 'Multiple temperatures inserted to Temperatures collection' });
            } 
        })
        

    })

    // get all the temperatures (accessed at GET http://localhost:8080/api/temp)
    .get(function(req, res) {
        console.log("Getting Temperatures");
        Temperature.find(function(err, temperatures) {
            if (err)
                res.send(err);

            res.json(temperatures);
        });
    });


    

    

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
