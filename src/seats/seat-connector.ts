import * as SerialPort from 'serialport';
import { ReadLine } from '@serialport/parser-readline'

/*  == HARDWARE EXPLANATION ==
    Each seat has a bit in a four digit hex number
    When standing the circut is open and the bit has the value 0
    When sitting the circut is closed and the bit has the value 1
    Seat chains not connected are all set to high bits
*/

export async function SeatHandler() {
    const path = '/dev/usbmodem11301';
    const port = await connect(path);
    
    const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }))
    parser.on('data', (data:Buffer) => {
        const line = data.toString('utf8');
        if(line.startsWith('o=')) {
            const status = getSeatStatus(line);
            console.log('seated: ' + status
                .filter(a => !a.isJumped)
                .map(a=>a.seatNum)
                .join(', '));    
        } else {
            const bogo = getBogoLoops(line);
            console.log(`Bogo loops: ${currentBogoLoops}`);
        }
    })
    port.on("error", err => console.error(err));
}

function connect(path:string) {
    return new Promise<SerialPort>((res,rej) => {
        const port = new SerialPort(path,{
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1
        },err => {
            if(err) rej(err);
            else res(port);
        });
    })
}

const dataRegex = /^o=([0-9A-F]{1,4}) /;
let currentStatus:{ teamNum:number, seatNum:number, isJumped:boolean }[] = [];
function getSeatStatus(data:string) {
    const statusUpdate = dataRegex.exec(data)?.[1];
    const ffs = 'FFF'
    if(statusUpdate) {
        // ensures the update is a parsed 4 digit hex integer
        const seatBits = parseInt(ffs.substr(0,4-statusUpdate.length) + statusUpdate, 16);
        
        // put all 15 mask values here to calculate all seats statuses
        currentStatus = [0x40, 0x20, 0x10, 0x08, 0x04]
            .map((mask,seatNum) => ({
                teamNum: Math.floor(seatNum/5) + 1,
                seatNum: (seatNum % 5) + 1,
                isJumped: !(seatBits & mask)
            }));
    }
    return currentStatus;
};

const bogoRegex = /BogoLoops ([0-9]{1,7})/
let currentBogoLoops = -1;
function getBogoLoops(data:string) {
    const bogoLoops = bogoRegex.exec(data)?.[1];
    if(bogoLoops) {
        currentBogoLoops = parseInt(bogoLoops);
    }
    return currentBogoLoops;
}