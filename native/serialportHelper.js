import {SerialPort} from 'serialport';

let port = null;

function openSerial(path, baudRate) {
  if (port) {
    port.close();
  }

  port = new SerialPort({path, baudRate});

  port.on('data', (data) => {
    console.log('Data dari serial:', data.toString());
  });

  return {message: 'Port opened'};
}

module.exports = { openSerial };