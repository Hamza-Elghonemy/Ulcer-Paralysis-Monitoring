const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
const express = require('express')
const cors = require('cors');

const app = express()
app.use(cors());

let arduino_Data;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

const port = new SerialPort('COM3', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

parser.on('data', function (data) {
    arduino_Data=data.toString().split(',');
    console.log(arduino_Data);
});



app.get('/api/arduino', (req, res) => {
  res.json({ data: arduino_Data });
});
app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})