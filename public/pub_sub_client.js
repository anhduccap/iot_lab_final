const mqtt = require("mqtt");

// exports.clientSub = (topic) => {
//     options = {
//         // Clean session
//       clean: true,
//       connectTimeout: 4000,
//       // Auth
//       clientId: 'NodeJS_Client_2',
//       username: 'anhduccap',
//       password: 'Duc_password1205',
//     };
    
//     const client = mqtt.connect("http://192.168.0.106:1883", options);
    
//     client.on("connect",() => {
//         client.subscribe(topic);
//         console.log("Client subscribed ");
//     });
    
//     client.on("message",function(topic, message){
//         console.log(message.toString());
//     });
// }

// exports.clientPub = (topic, message) => {
    
// }

let options = {
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    encoding: 'utf8',
    clean: true,
    connectTimeout: 4000,
    clientId: 'NodeJS_Client_1',
    username: 'uitiot-project',
    password: 'IxsgePPpgwQASeeX',
};

const client = mqtt.connect('http://uitiot-project.cloud.shiftr.io:1883', options);

client.on("connect",() => {
    client.publish('sensor/led1', 'on');
    client.end();
});
