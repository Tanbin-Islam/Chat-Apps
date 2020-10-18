var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


users = [];
connections = [];

// var port = 3000;
// server.listen(port);
// console.log('listening on port:' + port);

server.listen(process.env.PORT || 8080);
console.log('server running...');

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected:sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', function(){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //add Images
    socket.on('user image', function (data) {
      socket.broadcast.emit('addimage', socket.username, data);
    });

    //add files
    socket.on('other file', function (data) {
      socket.broadcast.emit('otherformat', socket.username, data);
    });

    // send message
    socket.on('send message', function (data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //new users
    socket.on('new user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    function updateUsernames(){
      io.sockets.emit('get users', users);
    }

});
