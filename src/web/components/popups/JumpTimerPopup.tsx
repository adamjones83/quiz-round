import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { closePopup } from '../../redux/actions';
import { RoundState } from '../../redux/reducer';
import { timeLeftSelector } from '../../redux/selectors';
import { timerHandler } from '../../handlers';

interface JumpTimerPopupProps {
    timeLeft: number;
    dispatch:Dispatch
}

function mapStateToProps(state:RoundState) {
    return {
        timeLeft: timeLeftSelector(state)
    }
}

export const JumpTimerPopup = connect(mapStateToProps)((props:JumpTimerPopupProps) => {
    const { timeLeft, dispatch } = props;
    return <React.Fragment>
        <div>{timeLeft}</div>
        <button onClick={ () => timerHandler.resetTimer() }>Reset</button>
        <button onClick={ () => dispatch(closePopup()) }>Cancel</button>
    </React.Fragment>
});