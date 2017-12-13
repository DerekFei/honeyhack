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
var math = require('mathjs');
//const Client = require('mongodb').MongoClient;

//Mongodb defuat server url
//const url = 'mongodb://localhost:27017/local';
var limdu = require('limdu');
var trainningData = require('./traningData.js');
var dangerLevelClassifier = new limdu.classifiers.NeuralNetwork();
console.log('training data');
dangerLevelClassifier.trainBatch(trainningData);
console.log('training finished');
console.log(dangerLevelClassifier.classify({  lng: 33.74000, lat: -84.384110, temp:60, humi:40, noise: 40, light: 900}));  // 0.99 - almost white


const app = express();
const PORT = process.env.PORT || 3500;

var locationData = [{
    hid: 'H230493',
    title: 'Meat Loaf Black Belt',
    manager: 'Derek Hsu',
    username:'Kevin Fei',
    lng: -84.384000,
    lat: 33.774000,
    safetyScore: '0.8520636359429048',
    timestamp: '1513145771047'
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
    timestamp: '1513145771047'
},
{
    id: '7007',
    name: 'Prod Line B',
    lng: 133.33333,
    lat: 23.44422,
    temp: 25,
    humi: 39,
    noise: 35,
    light: 2000,
    timestamp: '1513145771047'
}];

var warningData = [{
    warningId: 'H231513145771047dan',
    id: 'H230493',
    type: 'danger',
    msg: 'Kevin has been eating cookies for more than 30 min',
    timestamp: '1513145771047'
},{
    warningId: '2931513145771047temp',
    id: '2939292',
    type: 'temp',
    msg: 'Master Sensor Humidity Changes Rapidly',
    timestamp: '1513145771047'
}];

var hisLoc = {};
var hisEnv = {};

var tempstd={};
var humistd={};
var noisestd={};
var lightstd={};

let myVar = setInterval(function(){ edgeProcessor() }, 1000);

function envDeviationUnit() {
    for(var x=0; x<hisEnv.length; x++) {      
        
    }   
    Object.keys(hisEnv).forEach(function(key) {
        var tempArray = [];
        var humiArray = [];
        var noiseArray = [];
        var lightArray = [];

        for(var x=0; x<hisEnv[key].length; x++) {      
            tempArray.push(hisEnv[key][x].temp);
            humiArray.push(hisEnv[key][x].humi);
            noiseArray.push(hisEnv[key][x].noise);
            lightArray.push(hisEnv[key][x].light);
        }

        //std only calculate the last 20 values as the buffer window 
        if(tempArray.length > 20){
            tempstd[key]= math.std(tempArray.slice(tempArray.length - 20, -1));
        } else {
            tempstd[key]= math.std(tempArray);
        }

        if(humiArray.length > 20){
            humistd[key]= math.std(humiArray.slice(humiArray.length - 20, -1));
        } else {
            humistd[key]= math.std(humiArray);
        }

        if(noiseArray.length > 20){
            noisestd[key]= math.std(noiseArray.slice(noiseArray.length - 20, -1));
        } else {
            noisestd[key]= math.std(noiseArray);
        }

        if(lightArray.length > 20){
            lightstd[key]= math.std(lightArray.slice(lightArray.length - 20, -1));
        } else {
            lightstd[key]= math.std(lightArray);
        }

        console.log(tempstd[key]);
    })
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
    console.log(locationData);
    res.send(locationData);
});


app.get('/api/getAllEnv', (req, res) => {
    res.send(envData);
});

app.get('/api/getAllWarnings', (req, res) => {
    res.send(warningData);
});

app.get('/api/postAllWarnings', (req, res) => {
   warningData = [{
        warningId: 'H231513145771047dan',
        id: 'H230493',
        type: 'danger',
        msg: 'Kevin has been eating cookies for more than 30 min',
        timestamp: '1513145771047'
    },{
        warningId: '2931513145771047temp',
        id: '2939292',
        type: 'temp',
        msg: 'Master Sensor Humidity Changes Rapidly',
        timestamp: '1513145771047'
    }];
    res.send('reset the warnings');
});

app.use('/api/dismissWarning', (req, res) => {
    if(!req.query.warningId){
        res.send('must provide a warning Id');
    }
    for( var x = 0; x<warningData.length;x++){
        if(warningData[x].warningId == req.query.warningId){
            warningData.splice(x, 1);
            res.send('dismissed the warning' + req.query.warningId);
        }
    }
    res.send('cannot find the warning id' + req.query.warningId);
});


app.post('/api/postUserLocation', (req, res) => {
    const data = req.query;
    console.log(data);
    //if the preivous data exist, push the previous data to the historical data
    for(var x=0; x<locationData.length; x++) 
    {      
        if(locationData[x].hid = data.hid){
            if(hisLoc[locationData[x].hid]){
                if(hisLoc[locationData[x].hid].length >= 600){
                    hisEnv.shift();
                }
            }else{
                hisLoc[locationData[x].hid] = [];
            }

            hisLoc[locationData[x].hid].push(locationData[x]);
            locationData.splice(x, 1);
        }
    }
    data.safetyScore = dangerLevelClassifier.classify({ lng: data.lng, lat: data.lat, temp: envData[7007].temp , humi: envData[7007].humi, noise: envData[7007].noise , light: envData[7007].light})[0];
    locationData.push(data);
    
    res.send('Thanks babe');
});


app.get('/api/postEnvData', (req, res) => {
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
        if(envData[x].id == data.id){
            const difftemp = Math.abs(data.temp - envData[x].temp);
            const diffhumi = Math.abs(data.humi - envData[x].humi);
            const diffnoise = Math.abs(data.noise - envData[x].noise);
            const difflight = Math.abs(data.light - envData[x].light);
            console.log(difftemp + 'diff');
            console.log(tempstd[envData[x].id] + ' tempstd');
            if(Math.abs(difftemp - tempstd[envData[x].id] ) > 5) {
                var currtime =  new Date().getTime();
                var isDuplicated = false;
                for( var y=0; y<warningData.length; y++){
                    if(warningData[y].id == envData[x].id && warningData[y].type == 'temp' && (currtime - warningData[y].timestamp) < 120000 ){
                        isDuplicated = true;
                        console.log('set is Duplicated to true');
                    }
                }
                console.log(isDuplicated);
                if (!isDuplicated) {
                    warningData.push({
                        warningId: envData[x].id + currtime + 'temp',
                        id: envData[x].id,
                        type: 'temp',
                        msg: 'Sensor ' + envData[x].name +' has rapid change on temperature.',
                        timestamp: currtime
                    });
                }
            }

            if(Math.abs(diffhumi - humistd[envData[x].id] ) > 5) {
                var currtime =  new Date().getTime();
                var isDuplicated = false;
                for( var y=0; y<warningData.length; y++){
                    if(warningData[y].id == envData[x].id && warningData[y].type == 'humi' && (currtime - warningData[y].timestamp) < 120000 ){
                        isDuplicated = true;
                    }
                }
                if (!isDuplicated) {
                    warningData.push({
                        warningId: envData[x].id + currtime + 'humi',
                        id: envData[x].id,
                        type: 'humi',
                        msg: 'Sensor ' + envData[x].name +' has rapid change on humidity.',
                        timestamp: currtime
                    });
                }

            }

            if(Math.abs(diffnoise - noisestd[envData[x].id] ) > 25) {
                var currtime =  new Date().getTime();
                var isDuplicated = false;
                for( var y=0; y<warningData.length; y++){
                    if(warningData[y].id == envData[x].id && warningData[y].type == 'noise' && (currtime - warningData[y].timestamp) < 120000 ){
                        isDuplicated = true;
                    }
                }
                if (!isDuplicated) {
                    warningData.push({
                        warningId: envData[x].id + currtime + 'noise',
                        id: envData[x].id,
                        type: 'noise',
                        msg: 'Sensor ' + envData[x].name +' has rapid change on noise level.',
                        timestamp: currtime
                    });
                }

            }

            if(Math.abs(difflight - lightstd[envData[x].id] ) > 500) {
                var currtime =  new Date().getTime();
                var isDuplicated = false;
                for( var y=0; y<warningData.length; y++){
                    if(warningData[y].id == envData[x].id && warningData[y].type == 'light' && (currtime - warningData[y].timestamp) < 120000 ){
                        isDuplicated = true;
                    }
                }
                if (!isDuplicated) {
                    warningData.push({
                        warningId: envData[x].id + currtime + 'light',
                        id: envData[x].id,
                        type: 'light',
                        msg: 'Sensor ' + envData[x].name +' has rapid change on lighting.',
                        timestamp: currtime
                    });
                }

            }

            if(hisEnv[envData[x].id]){
                if(hisEnv[envData[x].id].length >= 600){
                    hisEnv.shift();
                }
            }else{
                hisEnv[envData[x].id] = [];
            }

            //hisEnv.push(envData[x]);
            hisEnv[envData[x].id].push(envData[x]);
            envData.splice(x, 1);
            console.log('herher');
            console.log(envData);
        }
    }     
    envData.push(data);

    res.send('Thanks babe');
});

app.get('/api/getHisLoc', (req, res) => {
    const hid = req.query.hid;
    if(!req.query.hid){
        res.send(hisLoc);
    }

    res.send(hisLoc[req.query.hid]);
});

app.get('/api/getHisEnv', (req, res) => {
    const id = req.query.id;
    if(!req.query.id){
        res.send(hisEnv);
    }
    res.send(hisEnv[req.query.id]);
});

app.delete('/api/delHisLoc', (req, res) => {
    const hid = req.query.hid;
    delete hisLoc.hid;
    res.send('Thanks Babe');
});

app.delete('/api/delHisEnv', (req, res) => {
    const id = req.query.id;  
    delete hisEnv.id;
    res.send('Thanks Babe');
});

app.patch('/api/reset', (req, res) => {
    hisLoc = {};
    hisEnv = {};
    locationData = [];
    envData = [];
    res.send('Nothing left');
});


app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`);
});