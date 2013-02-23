var WebSocketServer = require('ws').Server
    feeds = require('./feeds').fetch();

wss = new WebSocketServer({port: 8081});
var WebSocket;

wss.on('connection', function(ws) {
    var x, ln;
    WebSocket = ws;
    for(x = 0, ln = feeds.length; x < ln; x += 1){
        emitPrice(parseInt(x, 10), feeds[x]['name'], getRandomInteger(100, 600), feeds[x]['currency']);
    }
});

function emitPrice(id, name, currentLevel, currency){
    var change = getRandomInteger(-1000, 1000) / 100;
    var newLevel = parseFloat(currentLevel + change);
    var message = {
        'level': newLevel.toFixed(2),
        'id': id,
        'name' : name,
        'currency': currency,
        'timestamp': new Date().getTime()
    };
    var json = JSON.stringify(message);
    WebSocket.send(json);
    var wait = getRandomInteger(5000, 8000);
    setTimeout(function(){
        emitPrice(id, name, newLevel);
    }, wait);
}

function getRandomInteger (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
