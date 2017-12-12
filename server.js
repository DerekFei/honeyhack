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
    lng: 133.52921,
    lat: 30.24231,
    timestamp: '2017-12-13 13:20:21'
},
{
    hid: 'H230493',
    title: 'Meat Loaf Black Belt',
    manager: 'Derek Hsu',
    username:'Kevin Fei',
    lng: 133.51233,
    lat: 30.11324,
    timestamp: '2017-12-13 13:20:21'
}];

var envData = [{
    id: '3343211',
    name: 'Asmb Line II',
    lng: 123.33333,
    lat: 23.44422,
    temp: 45,
    humi: 35,
    noise: 65,
    light: 3000,
    timestamp: '2017-12-13 13:20:21'
},
{
    id: '5313213',
    name: 'Prod Line B',
    lng: 133.33333,
    lat: 23.44422,
    temp: 25,
    humi: 39,
    noise: 35,
    light: 2000,
    timestamp: '2017-12-13 13:20:21'
}];

var warningData = [{
    id: 'H230493',
    msg: 'Kevin has been eating cookies for more than 30 min',
    timestamp: '2017-12-13 13:20:21'
},{
    id: '2939292',
    msg: 'Master Sensor Humidity Changes Rapidly',
    timestamp: '2017-12-13 13:20:21'
}];

var hisLoc = [];
var hisEnv = [];

let myVar = setInterval(function(){ edgeProcessor() }, 1000);

function envDeviationUnit() {

}

function locDeviationUnit() {

}

function envConnUnit() {

}

function locConnUnit() {

}


function edgeProcessor() {
    envDeviationUnit();
    locDeviationUnit();
    envConnUnit();
    locConnUnit();
}

function stopFunction() {
    clearInterval(myVar);
}

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

app.get('/api/getAllWarnings', (req, res) => {
    res.send(warningData);
});

app.get('/api/getDismissWarnings', (req, res) => {
    res.send(warningData);
});


app.post('/api/postUserLocation', (req, res) => {
    const data = req.query;
    console.log(data);
    //if the preivous data exist, push the previous data to the historical data
    for(var x=0; x<locationData.length; x++) 
    {      
        if(locationData[x].hid = data.hid){
            hisLoc.push(locationData[x]);
            locationData.splice(x, 1);
        }
    }   
    locationData.push(data);
    
    res.send('Thanks babe');
});


app.post('/api/postEnvData', (req, res) => {
    const data = {
        id: req.query.id,
        name: req.query.name,
        temp: req.query.temp,
        humi: req.query.humi,
        noise: req.query.noise,
        light: req.query.light,
        lng: req.query.lng,
        lat: req.query.lat
    };
    console.log(data);

    //if the preivous data exist, push the previous data to the historical data
    for(var x=0; x<envData.length; x++) 
    {      
        if(envData[x].hid = data.id){
            hisEnv.push(envData[x]);
            envData.splice(x, 1);
        }
    }     
    envData.push(data);

    res.send('Thanks babe');
});

app.get('/api/getHisLoc', (req, res) => {
    const hid = req.query.hid;
    var resultArray = [];
    for(var x=0; x<hisLoc.length; x++) 
    {      
        if(hisLoc[x].hid = hid){
            resultArray.push(hisLoc[x]);
        }
    }     

    res.send(resultArray);
});

app.get('/api/getHisEnv', (req, res) => {
    const id = req.query.id;
    var resultArray = [];
    for(var x=0; x<hisEnv.length; x++) 
    {      
        if(hisEnv[x].hid = hid){
            resultArray.push(hisEnv[x]);
        }
    }     
    res.send(resultArray);
});

app.delete('/api/delHisLoc', (req, res) => {
    const hid = req.query.hid;
    var resultArray = [];
    for(var x=0; x<hisLoc.length; x++) 
    {      
        if(hisLoc[x].hid = hid){
            hisLoc.splice(x, 1);
        }
    }     

    res.send('Thanks Babe');
});

app.delete('/api/delHisEnv', (req, res) => {
    const id = req.query.id;
    var resultArray = [];
    for(var x=0; x<hisEnv.length; x++) 
    {      
        if(hisEnv[x].hid = hid){
            hisEnv.splice(x, 1);
        }
    }     
    res.send('Thanks Babe');
});

app.patch('/api/reset', (req, res) => {
    hisLoc = [];
    hisEnv = [];
    locationData = [];
    envData = [];
    res.send('Nothing left');
});


app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`);
});