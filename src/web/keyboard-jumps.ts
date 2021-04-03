import { jumpHandler } from './handlers/jump-handler';
import { getSeatId } from './redux/actions/seats';

export function hookupKeyboardJumps():void {
    const [team1,team2,team3] = ["qwerty","asdfg","zxcvb"];
    const keysdown = { }
    document.addEventListener('keydown', e => {
        const { key } = e;
        if(!keysdown[key]) {
            let seatNum = team1.indexOf(key);
            if(seatNum >= 0) jumpHandler.jump(getSeatId(0,seatNum));
            seatNum = team2.indexOf(key);
            if(seatNum >= 0) jumpHandler.jump(getSeatId(1,seatNum));
            seatNum = team3.indexOf(key);
            if(seatNum >= 0) jumpHandler.jump(getSeatId(2,seatNum));
            keysdown[key] = true;
        }
    });
    document.addEventListener('keyup', e => {
        const { key } = e;
        delete keysdown[key];
        let seatNum = team1.indexOf(key);
        if(seatNum >= 0) jumpHandler.sit(getSeatId(0,seatNum));
        seatNum = team2.indexOf(key);
        if(seatNum >= 0) jumpHandler.sit(getSeatId(1,seatNum));
        seatNum = team3.indexOf(key);
        if(seatNum >= 0) jumpHandler.sit(getSeatId(2,seatNum));
    });
}