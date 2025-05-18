import {SerialPort} from 'serialport';

let port: SerialPort|null = null;

export async function openSerial(path: string, baudRate: number) {
  if (port) {
    port.close();
  }

  port = new SerialPort({path, baudRate});

  port.on('data', (data) => {
    console.log('Data dari serial:', data.toString());
  });

  return {message: 'Port opened'};
}