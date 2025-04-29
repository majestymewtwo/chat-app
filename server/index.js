const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (info) => {
        socket.broadcast.emit('broadcast', info);
    })
});

io.on('disconnection', () => {
    console.log('Client disconnected');
});


httpServer.listen(3000);