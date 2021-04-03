import * as React from "react";
import { connect } from 'react-redux';
import { PopupType } from "../../types";
import { showPopupSelector } from '../redux/selectors';
import { RoundState } from "../redux/reducer";
import { LineupsPopup } from "./popups/LineupsPopup";
import { ScoreViewPopup } from './popups/ScoreViewPopup'
import { JumpInfoPopup } from './popups/JumpInfoPopup';
import { TimerPopup } from './popups/TimerPopup';

interface PopupProps {
    visible: boolean,
    children: JSX.Element
}

const popupChildrenByType:Record<PopupType, JSX.Element> = {
    "none": <div />,
    "lineups": <LineupsPopup />,
    "scores": <ScoreViewPopup />,
    "timer": <TimerPopup />,
    "jump": <JumpInfoPopup />
};

function mapStateToProps(state:RoundState) {
    return {
        visible: showPopupSelector(state) !== 'none',
        children: popupChildrenByType[showPopupSelector(state)] ?? <div />
    }
}

export const Popup = connect(mapStateToProps)((props: PopupProps) => {
    return <div className={ props.visible ? 'popup-outer visible' : 'popup-outer' }>
        <div className={ 'popup-inner' }>{ props.children }</div>
    </div>;
});
