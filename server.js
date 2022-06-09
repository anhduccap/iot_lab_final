const express = require('express');
const app = express();
const mqtt = require("mqtt");
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

const UserModel = require('./models/user.model.js');
const SensorModel = require('./models/sensor.model.js');
const DeviceModel = require('./models/device.model.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.connect(
    process.env.MONGODB,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(err) {
            console.log(`Database connection error: ${err.message}`);
        } else {
            console.log('Connecting to mongoose successfully');
        }
    }
);

// io.attach(server, {
//     pingInterval: 10000,
//     pingTimeout: 5000,
//     cookie: false
//    });

io.on('connection', async (socket) => {
    console.log(`User ${socket.id} connected`);

    let options = {
        encoding: 'utf8',
        clean: true,
        connectTimeout: 4000,
        clientId: 'NodeJS_Client',
        username: process.env.MQTT_CLIENT_USERNAME,
        password: process.env.MQTT_CLIENT_PASSWORD,
    };
    
    const client = mqtt.connect(process.env.MQTT_SERVER, options);
    
    client.on("connect",() => {
        client.subscribe("sensor/led1");
        client.subscribe("sensor/led2");
        client.subscribe("sensor/temp");
        client.subscribe("sensor/hum");
        client.subscribe("sensor/lux");
        console.log("Subscribed broker");

        client.on("message", async(topic, message) => {
            //console.log(`Topic: ${topic} -> ${message}`);

            let data = '';
            
            if(topic === "sensor/led1" || topic === "sensor/led2") {
                console.log('Presed on led')
            }
            else if (topic === 'sensor/lux') {
                data = parseFloat(message.toString()).toFixed(2);
                const sensorData = new SensorModel({
                    id: 'BH1750_001',
                    device: '62a151d952eb4ca37aaae8de',
                    type: 'Light',
                    value: data,
                });
                sensorData.save((err) => {
                    if(err) console.log(`Save data error: ${err.message}`);
                    else {
                        console.log(`Save light data success`);
                        io.sockets.emit('Server-send-lux-data', data);
                    }
                });
            } else if (topic === 'sensor/temp') {
                data = parseFloat(message.toString()).toFixed(2);
                const sensorData = new SensorModel({
                    id: 'DHT11_001',
                    device: '62a151d952eb4ca37aaae8de',
                    type: 'Temperature',
                    value: data,
                });
                sensorData.save((err) => {
                    if(err) console.log(`Save data error: ${err.message}`);
                    else {
                        console.log(`Save temperature data success`);
                        io.sockets.emit('Server-send-temp-data', data);
                    }
                });
            } else if (topic === 'sensor/hum') {
                data = parseFloat(message.toString()).toFixed(2);
                const sensorData = new SensorModel({
                    id: 'DHT11_001',
                    device: '62a151d952eb4ca37aaae8de',
                    type: 'Humidity',
                    value: data,
                });
                sensorData.save((err) => {
                    if(err) console.log(`Save data error: ${err.message}`);
                    else {
                        console.log(`Save humidity data success`);
                        io.sockets.emit('Server-send-hum-data', data);
                    }
                });
            }
        });
    }); 

    socket.on('disconnect', function() {
        client.end();
        console.log(`User ${socket.id} disconnected`);
    });
});

// Navigate route
app.get('/', function(req, res){
  res.render('home');
});

app.post('/led1', (req, res) => {
    let message = '';
    if(parseInt(req.query.ledState, 10) === 1) {
        message = "1";
    } else {
        message = "0";
    }

    const sensorData = new SensorModel({
        id: 'LED1',
        device: '62a151d952eb4ca37aaae8de',
        type: 'Led',
        value: parseFloat(message),
    });
    sensorData.save((err) => {
        if(err) console.log(`Save data error: ${err.message}`);
        else {
            console.log(`Save led 1 state success`);
        }
    });

    let options = {
        encoding: 'utf8',
        clean: true,
        connectTimeout: 4000,
        clientId: 'NodeJS_Client',
        username: process.env.MQTT_CLIENT_USERNAME,
        password: process.env.MQTT_CLIENT_PASSWORD,
    };

    const client = mqtt.connect(process.env.MQTT_SERVER, options);

    client.on("connect",() => {
        client.publish("sensor/led1", message);
        client.end();
    });
    res.send(`Published: ${message}`);
});

app.post('/led2', (req, res) => {
    let message = '';
    if(parseInt(req.query.ledState, 10) === 1) {
        message = "1";
    } else {
        message = "0";
    }

    const sensorData = new SensorModel({
        id: 'LED2',
        device: '62a151d952eb4ca37aaae8de',
        type: 'Led',
        value: parseFloat(message),
    });
    sensorData.save((err) => {
        if(err) console.log(`Save data error: ${err.message}`);
        else {
            console.log(`Save led 2 state success`);
        }
    });

    let options = {
        encoding: 'utf8',
        clean: true,
        connectTimeout: 4000,
        clientId: 'NodeJS_Client',
        username: process.env.MQTT_CLIENT_USERNAME,
        password: process.env.MQTT_CLIENT_PASSWORD,
    };

    const client = mqtt.connect(process.env.MQTT_SERVER, options);

    client.on("connect",() => {
        client.publish("sensor/led2", message);
        client.end();
    });
    res.send(`Published: ${message}`);
});

app.get('/api/sensor', (req, res) => {
    let perPage = 10;
    
    if (req.query.page == null) {
        SensorModel.find()
        .sort({date_created: 'desc'})
        .populate('device')
        .exec((err, data) => {
            SensorModel.count().exec(function(err, count) {
                res.send({
                    data: data,
                    page: 0,
                    pages: Math.floor(count / perPage)
                });
            });
        });
    } else {
        let page = Math.max(0, req.query.page);
        SensorModel.find()
        .sort({date_created: 'desc'})
        .limit(perPage)
        .skip(page * perPage)
        .populate('device')
        .exec((err, data) => {
            SensorModel.count().exec(function(err, count) {
                res.send({
                    data: data,
                    page: page,
                    pages: Math.floor(count / perPage)
                });
            });
        });
    }
});

app.post('/api/device', async (req, res) => {
    const Device = new DeviceModel({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        ip: req.body.ip,
    });

    Device.save((err) => {
        if(err) res.send(`Creation error: ${err.message}`);
        else {
            res.send('Device was created successfully')
        }
    });
})

//mosquitto_pub -h 192.168.0.106 -p 1883 -u anhduccap -P Duc_password1205 -t control_led -m "led1 off"
