

/* This is an sample Express server with default MongoDB setup
You should not use the code directly from the endpoint that was
commented out. The commented out section is an sample to make
an mongoDB call from the nodeJS server, more method could be
fond on the mongoDB's website.*/

/* You should only use this server, if directly calling from
angular frontend gives you CORS error */

/* The default angular UI server is running on port 4200, and
this server is running on the port 3030 */

/* To run this server, you need to do npm install first
then use the command "node server.js" at the server.js's dir */
const fs = require('fs');
const bodyParser = require('body-parser');

const express = require('express');
//const Client = require('mongodb').MongoClient;

//Mongodb defuat server url
//const url = 'mongodb://localhost:27017/local';

const app = express();
const PORT = process.env.PORT || 3500;

//Disable https and redirect to the http
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect(`http://${req.hostname}${req.url}`);
    } 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/api/getAllLocations', (req, res) => {
    const dummy = [
        {
            hid: 'H230493',
            title: 'Meat Loaf Black Belt',
            manager: 'Derek Hsu',
            username:'Kevin Fei',
            lng: 133.5,
            lat: 30,
        },
        {
            hid: 'H230493',
            title: 'Meat Loaf Black Belt',
            manager: 'Derek Hsu',
            username:'Kevin Fei',
            lng: 133.5,
            lat: 30,
        }
    ]
    //console.log(bag);
    res.send(dummy);
});


app.post('/api/postUserLocation', (req, res) => {
    //console.log(bag);
    res.send('Thanks babe');
});

app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`);
});