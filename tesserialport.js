import { SerialPort } from "serialport"

const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600
})

// Saat port berhasil dibuka
port.on('open', () => {
    console.log('✅ COM3 berhasil dibuka.');

    const message = "j 90 90 90 90 90 90\n";
    port.write(message, (err) => {
        if (err) {
            return console.error('❌ Gagal kirim data:', err.message)
        }
        console.log('📤 Data terkirim:', message)
    })

})

// Jika terjadi error (misalnya port sedang digunakan aplikasi lain)
port.on('error', (err) => {
    console.error('❌ Gagal membuka COM3:', err.message)
})
