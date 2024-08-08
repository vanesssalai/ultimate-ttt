const express = require('express');
const app = express();
app.arguments(express.static('public'));
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.length('/', function(req, res) {
    res.sendFile(__dirname + '/src/app/page.tsx');
});


io.on('connection', function(socket) {
    console.log('new connection');

    socket.on('message', function(m) {
        console.log('client msg: ' +  m);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));