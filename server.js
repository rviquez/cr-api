// =======================
// get the packages we need ============
// =======================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require("request");
const cors = require('cors');

const config = require('./config'); // get our config file
// var User = require('./app/models/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
let port = process.env.PORT || 8080; // used to create, sign, and verify tokens
// mongoose.connect(config.database); // connect to database
// app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors())

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------

// get an instance of the router for api routes
const apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
// apiRoutes.post('/authenticate', function (req, res) {

//     // find the user
//     User.findOne({
//         name: req.body.name
//     }, function (err, user) {

//         if (err) throw err;

//         if (!user) {
//             res.json({
//                 success: false,
//                 message: 'Authentication failed. User not found.'
//             });
//         } else if (user) {

//             // check if password matches
//             if (user.password != req.body.password) {
//                 res.json({
//                     success: false,
//                     message: 'Authentication failed. Wrong password.'
//                 });
//             } else {

//                 // if user is found and password is right
//                 // create a token with only our given payload
//                 // we don't want to pass in the entire user since that has the password
//                 const payload = {
//                     admin: user.admin
//                 };
//                 var token = jwt.sign(payload, app.get('superSecret'), {
//                     expiresIn: "1 day" // expires in 24 hours
//                 });

//                 // return the information including token as JSON
//                 res.json({
//                     success: true,
//                     message: 'Enjoy your token!',
//                     token: token
//                 });
//             }

//         }

//     });
// });

// // route middleware to verify a token
// apiRoutes.use(function (req, res, next) {

//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];

//     // decode token
//     if (token) {

//         // verifies secret and checks exp
//         jwt.verify(token, app.get('superSecret'), function (err, decoded) {
//             if (err) {
//                 return res.json({
//                     success: false,
//                     message: 'Failed to authenticate token.'
//                 });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });

//     } else {

//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });

//     }
// });


// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
    res.json({
        message: 'Welcome to the coolest API on earth!'
    });
});

// route to return all clan information by id (GET http://localhost:8080/api/clan/:id)
apiRoutes.get('/clan/:id', function (req, res) {
    let id = req.params.id;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'clan/' + id,
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return clan information by name (GET http://localhost:8080/api/clan/:name)
apiRoutes.get('/clan/search/:name', function (req, res) {
    let name = req.params.name;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'clan/search?name=' + name + '&max=10',
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return clan battle information (GET http://localhost:8080/api/clan/battles/:id)
apiRoutes.get('/clan/battles/:id/', function (req, res) {
    let id = req.params.id;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'clan/' + id + '/battles',
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return clan war information (GET http://localhost:8080/api/clan/war/:id)
apiRoutes.get('/clan/war/:id/:page', function (req, res) {
    let id = req.params.id;
    let page = req.params.page ? req.params.page : 1;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'clan/' + id + '/war?page=' + page,
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return clan war log information (GET http://localhost:8080/api/clan/warlog/:id)
apiRoutes.get('/clan/warlog/:id/:page', function (req, res) {
    let id = req.params.id;
    let page = req.params.page ? req.params.page : 1;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'clan/' + id + '/warlog?page=' + page,
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return top clans information (GET http://localhost:8080/api/clan/warlog/:id)
apiRoutes.get('/clans/top/:region', function (req, res) {
    let region = req.params.region;
    let url = region ? 'top/clans/' + region : 'top/clans/';
    
    let options = {
        method: 'GET',
        url: config.apiUrl+url,
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return player information (GET http://localhost:8080/api/player/:id)
apiRoutes.get('/player/:id', function (req, res) {
    let id = req.params.id;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'player/' + id,
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return player battle information (GET http://localhost:8080/api/player/:id/battles)
apiRoutes.get('/player/:id/battles', function (req, res) {
    let id = req.params.id;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'player/' + id + '/battles',
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// route to return player chests information (GET http://localhost:8080/api/player/:id/chests)
apiRoutes.get('/player/:id/chests', function (req, res) {
    let id = req.params.id;
    let options = {
        method: 'GET',
        url: config.apiUrl + 'player/' + id + '/chests',
        headers: {
            auth: config.auth
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);