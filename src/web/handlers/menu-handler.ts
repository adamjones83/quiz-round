import { Dispatch } from "redux";
import { menuEvents } from '../../ipc-events';
import { MenuEventType } from "../../ipc-types";
import { PopupType } from "../../types";
import { showPopup } from '../redux/actions';
import { enableSound, disableSound } from '../handlers';

const menuPopups: Partial<Record<MenuEventType, PopupType>> = {
    "restart-round": "restart-round",
    "set-round-title": "set-round-title",
    "pick-lineups": "lineups",
    "show-scores": "scores",
    "set-question": "set-question",
    "timeout": "timeout",
    "foul": "foul",
    "challenge": "challenge",
    "appeal": "appeal",
    "edit-quizzers": "edit-quizzers"
};

function handleMenuActions(dispatch: Dispatch) {
    (window['MENU'] as typeof menuEvents).addHandler(type => {
        let popup:PopupType;
        switch(type) {
            case 'bonus-handling-auto':
                console.log('BONUS HANDLING - AUTO');
                break;
            case 'bonus-handling-manual':
                console.log('BONUS HANDLING - MANUAL');
                break;
            case 'sound-enabled':
                enableSound();
                break;
            case 'sound-disabled':
                disableSound();
                break;
            default:
                popup = menuPopups[type];
                if(popup) dispatch(showPopup(popup));
                else console.warn('Unrecognized menu event - ' + type);
                break;
        }
    });
}

export function initMenuHandler(dispatch: Dispatch):void {
    handleMenuActions(dispatch);
}