import { JumpHandler } from './actions/jump-handler';

export function hookupKeyboardJumps(getState) {
    const jumpHandler = getState().get('jumpHandler') as JumpHandler;
    const [team1,team2,team3] = ["qwerty","asdfg","zxcvb"];
    const keysdown = { }
    document.addEventListener('keydown', e => {
        const { key } = e;
        if(!keysdown[key]) {
            let seatNum = team1.indexOf(key);
            if(seatNum >= 0) jumpHandler.jump(`Team 0 - Seat ${seatNum}`);
            seatNum = team2.indexOf(key);
            if(seatNum >= 0) jumpHandler.jump(`Team 1 - Seat ${seatNum}`);
            seatNum = team3.indexOf(key);
            if(seatNum >= 0) jumpHandler.jump(`Team 2 - Seat ${seatNum}`);
            keysdown[key] = true;
        }
    });
    document.addEventListener('keyup', e => {
        const { key } = e;
        delete keysdown[key];
        let seatNum = team1.indexOf(key);
        if(seatNum >= 0) jumpHandler.sit(`Team 0 - Seat ${seatNum}`);
        seatNum = team2.indexOf(key);
        if(seatNum >= 0) jumpHandler.sit(`Team 1 - Seat ${seatNum}`);
        seatNum = team3.indexOf(key);
        if(seatNum >= 0) jumpHandler.sit(`Team 2 - Seat ${seatNum}`);
    });
}