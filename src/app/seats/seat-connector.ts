import * as fs from 'fs';
import * as SerialPort from 'serialport';
import { SeatStatus } from '../../ipc-types';

/*  == HARDWARE EXPLANATION ==
    Each seat has a bit in a four digit hex number
    When standing the circut is open and the bit has the value 0
    When sitting the circut is closed and the bit has the value 1
    Seat chains not connected are all set to high bits
*/

interface Disposable { dispose:() => void }
export async function SeatHandler(onStatusChange:(seats:SeatStatus[])=>void, onBogo:(loops:number)=>void): Promise<Disposable> {
    const path = await getUsbPathViaNode();
    if(!path) {
        onBogo(-1); 
        console.log('failed to connect to jump seats');
        return;
    }
    const port = await connect(path);
    const readline = SerialPort.parsers.Readline;
    const parser = port.pipe(new readline({ delimiter: '\r\n' }))
    parser.on('data', (data:Buffer) => {
        const line = data.toString('utf8');
        if(line.startsWith('o=')) {
            updateStatuses(line,onStatusChange);
        } else {
            updateBogoLoops(line,onBogo);
        }
    })
    port.on("error", err => console.error(err));
    return { dispose: () => {
        parser.destroy();
        port.destroy();   
    }}
}

export async function getUsbPathViaNode(): Promise<string> {
    const pattern = /cu*usbmodem/;
    const readdir = path => new Promise<string[]>((res,rej) => fs.readdir(path, (err,data) => { if(err) rej(err); else res(data); }));
    const usbModem = (await readdir('/dev')).find(name => pattern.test(name));
    return usbModem && `/dev/${usbModem}`;
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
let prevStatusNum = 0;
function updateStatuses(data:string, onStatusChange:(seats:SeatStatus[])=>void) {
    const statusUpdate = dataRegex.exec(data)?.[1];
    const statusNum = parseInt(statusUpdate, 16);
    console.log({ statusUpdate, statusNum: statusNum.toString(16)})
    if(statusNum !== prevStatusNum) {
        prevStatusNum = statusNum;
        const statuses = getStatuses(statusNum);
        onStatusChange(statuses);
    }
}
function getStatuses(status:number):SeatStatus[] {
    const seatMapping = [
        0x4000, 0x2000, 0x1000, 0x0800, 0x0400,
        0x0200, 0x0100, 0x0080, 0x0040, 0x0020,
        0x0010, 0x0008, 0x0004, 0x0002, 0x0001
    ];

    return seatMapping.map((a,i) => ({
        id: `Team ${Math.floor(i/5)} - Seat ${i%5}`,
        jumped: !(a & status)
    }));
}

const bogoRegex = /BogoLoops ([0-9]{1,7})/
function updateBogoLoops(data:string, onBogo:(loops:number)=>void) {
    const bogoLoops = bogoRegex.exec(data)?.[1];
    try { onBogo(parseInt(bogoLoops)) }
    catch { onBogo(-1); }
}



// 7FFF - all disconnected

// Green
// 03FF - none
// 43FF - seat 1 down, 0x4000
// 23FF - seat 2 down, 0x2000
// 13FF - seat 3 down, 0x1000
// 0BFF - seat 4 down, 0x0800
// 07FF - seat 5 down, 0x0400

// Blue
// 7C1F - none
// 7E1F - seat 1 down, 0x0200
// 7D1F - seat 2 down, 0x0100
// 7C9F - seat 3 down, 0x0080
// 7C5F - seat 4 down, 0x0040
// 7C3F - seat 5 down, 0x0020

// Red (has seat order reversed...)
// 7FE0 - none (all up)
// 7FE1 - seat 1 down, 0x0001
// 7FE2 - seat 2 down, 0x0002
// 7FE4 - seat 3 down, 0x0004
// 7FE8 - seat 4 down, 0x0008
// 7FF0 - seat 5 down, 0x0010

// NOTE: seat down is a 1 (circuit closed)
// when disconnected all circuts closed (bits ON=1)