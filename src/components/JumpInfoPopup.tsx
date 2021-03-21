import * as React from "react";
import { connect } from "react-redux";
import { jumpedInfoSelector, timeLeftSelector } from "../redux/selectors";

interface JumpInfoPopupProps {
    info: ReturnType<typeof jumpedInfoSelector>,
    timeLeft: number
}
const mapStateToProps = state => ({
    info: jumpedInfoSelector(state),
    timeLeft: timeLeftSelector(state)
});
export const JumpInfoPopup = connect(mapStateToProps)((props:JumpInfoPopupProps) => {
    const { info, timeLeft } = props;
    const classNames = ['popup-outer'];
    if(false) classNames.push('visible');
    return <div className={ classNames.join(' ') }>
        <div className={ 'popup-inner' }>
            {
                info.map(a => <div key={a.seatId}>{ `${a.name} (${a.teamName}-${a.color})` }</div>)
            }
        </div>
    </div>;
});



/*
POPUPS:
- answering/bonus
- challenge/rebuttal/appeal
- timeout
*/