const express = require('express');
const app = express();
const mqtt = require("mqtt");

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
   });

let options = {
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    encoding: 'utf8',
    clean: true,
    connectTimeout: 4000,
    clientId: 'NodeJS_Client_1',
    username: 'anhduccap',
    password: 'Duc_password1205',
};

const client = mqtt.connect("http://192.168.43.203:1883", options);

client.on("connect",() => {
    client.subscribe("sensor");
});

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    client.on("message",function(topic, message){
        socket.emit('Sensor-send-data', message.toString());
    });

    socket.on('Sensor-send-data', (data)=>{
        console.log(data);
        socket.broadcast.emit('Server-send-sensor-data', data);
    });

    socket.on('disconnect', function() {
        console.log(`User ${socket.id} disconnected`);
    });
});

app.get('/', function(req, res){
  res.render('home');
});

app.post('/led1', (req, res) => {
    let message = '';
    if(parseInt(req.query.ledState, 10) === 1) {
        message = "led1 on";
    } else {
        message = "led1 off";
    }

    console.log(message);

    let options = {
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        encoding: 'utf8',
        clean: true,
        connectTimeout: 4000,
        clientId: 'NodeJS_Client_1',
        username: 'anhduccap',
        password: 'Duc_password1205',
    };

    const client = mqtt.connect("http://192.168.43.203:1883", options);

    client.on("connect",() => {
        client.publish("control_led", message);
        client.end();
    });
    res.send(`Published: ${message}`);
});

app.post('/led2', (req, res) => {
    let message = '';
    if(parseInt(req.query.ledState, 10) === 1) {
        message = "led2 on";
    } else {
        message = "led2 off";
    }

    console.log(message);

    let options = {
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        encoding: 'utf8',
        clean: true,
        connectTimeout: 4000,
        clientId: 'NodeJS_Client_1',
        username: 'anhduccap',
        password: 'Duc_password1205',
    };

    const client = mqtt.connect("http://192.168.43.203:1883", options);

    client.on("connect",() => {
        client.publish("control_led", message);
        client.end();
    });
    res.send(`Published: ${message}`);
});

//mosquitto_pub -h 192.168.0.106 -p 1883 -u anhduccap -P Duc_password1205 -t control_led -m "led1 off"
