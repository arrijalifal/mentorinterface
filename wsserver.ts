import { WebSocketServer } from 'ws';
import { SerialPort } from 'serialport';

const port = 3001;

const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(`Data diterima = ${data}`);
    });
});


console.log(`listening to ${port}`);