import * as React from "react";
import { jumpedSelector } from "../redux/selectors";

interface JumpInfoPopupProps {
    jumper:string
}
export const JumpInfoPopup = (props:JumpInfoPopupProps) => {
    return <div className={ 'popup-outer hidden' }>
        <div className={ 'popup-inner' }>
            <div>{ props.jumper }</div>
        </div>
    </div>;
};



/*
POPUPS:
- answering/bonus
- challenge/rebuttal/appeal
- timeout
*/