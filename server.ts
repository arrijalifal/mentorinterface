import {ReadlineParser} from '@serialport/parser-readline';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import type {Request, Response} from 'express';
import http from 'http';
import { SerialPort } from 'serialport';
import {WebSocket, WebSocketServer} from 'ws';

import {closeSerialConnection, getSerialConnection} from './lib/serialConnection.ts';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
const wss = new WebSocketServer({server});

const SERIAL_PORT = 'COM3';
const BAUD_RATE = 9600
const PORT = 5000;

let port: SerialPort | null = null
let isConnected = false;


function initSerialConnection() {
  if (port && port.isOpen) return;

  port = new SerialPort({
    path: SERIAL_PORT,
    baudRate: BAUD_RATE,
    autoOpen: false
  });
  
  port.open((err) => {
    if (err) {
      console.error('[Serial] Gagal membuka port:', err.message);
      isConnected = false;
      broadcastStatus();
    } else {
      console.log('[Serial] Port terbuka');
      isConnected = true;
      broadcastStatus();
      const parser = port!.pipe(new ReadlineParser({delimiter: '\n'}));
      parser.on('data', (data: string) => {
        // console.log('[Serial] Data diterima:', data);
        broadcastMessage({type: 'serial_data', data});
      });

      port!.on('close', () => {
        console.log('[Serial] Port ditutup');
        isConnected = false;
        broadcastStatus();
      });

      port!.on('error', (err) => {
        console.error('[Serial] Error:', err.message);
        isConnected = false;
        broadcastStatus();
      });
    }
  });

  port.on('close', () => {
    console.log('[Serial] Port ditutup');
    isConnected = false;
    broadcastStatus();
  });

  port.on('error', (err) => {
    console.error('[Serial] Error:', err.message);
    isConnected = false;
    broadcastStatus();
  });
}

function watchSerialPort() {
  setInterval(async () => {
    if (!isConnected) {
      try {
        const ports = await SerialPort.list();
        const com3Available = ports.some((p) => p.path === SERIAL_PORT);
        if (com3Available) {
          console.log('[Watcher] COM3 terdeteksi, mencoba koneksi...');
          initSerialConnection();
        }
      } catch (err) {
        console.error('[Watcher] Gagal mengecek port:', err);
      }
    }
  }, 1000);
}

function broadcastMessage(message: any) {
  const json = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

function broadcastStatus() {
  broadcastMessage({type: 'status', connected: isConnected});
}

wss.on('connection', (ws) => {
  console.log('[WebSocket] Client terhubung');
  ws.send(JSON.stringify({ type: 'status', connected: isConnected }));
  ws.on('message', (message) => {
    const command = message.toString();
    if (port) port.write(command + '\n', (err) => {
      if (err) {
        console.log("Error pada pengiriman: ", err);
      }
      else {
        broadcastMessage(
            {type: 'message', data: 'Berhasil mengirimkan perintah'})
      }
    })
  })
});

app.get('/', (_, res) => {
  res.send('WebSocket + Serial Server running');
});


app.post('/joint_control', async (req: Request, res: Response) => {
  try {
    const {
      joint1, joint2, joint3, joint4, joint5, joint6
    }: {
      joint1: number
      joint2: number;
      joint3: number;
      joint4: number;
      joint5: number;
      joint6: number;
    } = req.body;

    const command = `j ${joint1} ${joint2} ${joint3} ${joint4} ${joint5} ${joint6}`;

    const port = getSerialConnection();
    if (port.isOpen) {
      port.write(command + '\n', (err) => {
        if (err) {
          return res.json({ error: "Serial communication error", err });
        }
        else {
          return res.json({ command })
        }
      });
    } else {
      return res.json({ error: "Serial port not available" })
    }

  } catch (e: any) {
    return res.json({ error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server berjalan di port http://localhost:${PORT}`);
  initSerialConnection();
  watchSerialPort();  // selalu cek COM3
})