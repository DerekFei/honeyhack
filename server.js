

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

var locationData = [{
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
}];

var envData = [{
    id: '3343211',
    name: 'Asmb Line II',
    lng: 123.33333,
    lat: 23.44422,
    temp: 45,
    humi: 35,
    noise: 65,
    light: 3000
},
{
    id: '5313213',
    name: 'Prod Line B',
    lng: 133.33333,
    lat: 23.44422,
    temp: 25,
    humi: 39,
    noise: 35,
    light: 2000
}];

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
    res.send(locationData);
});


app.get('/api/getAllEnv', (req, res) => {
    res.send(envData);
});


app.post('/api/postUserLocation', (req, res) => {
    const data = req.query;
    console.log(data);
    locationData.push(data);
    res.send('Thanks babe');
});


app.post('/api/postEnvData', (req, res) => {
    const data = req.query;
    console.log(data);
    locationData.push(data);
    res.send('Thanks babe');
});

app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`);
});