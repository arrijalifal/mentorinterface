import { SerialPort } from 'serialport';
import { ReadlineParser } from 'serialport';

let serialPort: SerialPort | null = null;

export function getSerialConnection(): SerialPort {
    if (!serialPort || !serialPort.isOpen) {
        serialPort = new SerialPort({
            path: 'COM3',
            baudRate: 9600,
            autoOpen: false,
        });

        serialPort.open((err) => {
            if (err) {
                console.error("Gagal membuka port: ", err.message);
            }
            else {
                console.log("Serial port dibuka");
            }
        });

        const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));
        parser.on('data', (data: string) => {
            console.log('Data dari serial', data);
        })
    }
    return serialPort;
}

export function closeSerialConnection(): void {
    if (serialPort && serialPort.isOpen) {
        serialPort.close((err) => {
            if (err) {
                console.log("Gagal menutup serial. ", err.message);
            } else {
                console.log("Serial ditutup");
            }
        })
    } 
}