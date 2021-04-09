import * as React from "react";
import { connect } from 'react-redux';
import { PopupType } from "../../types";
import { showPopupSelector } from '../redux/selectors';
import { RoundState } from "../redux/reducer";
import { 
    AppealPopup,
    ChallengePopup,
    FoulPopup,
    JumpInfoPopup,
    LineupsPopup,
    RestartRoundPopup,
    ScoreViewPopup,
    SetQuestionPopup,
    SetRoundTitlePopup,
    TimeoutPopup
} from './popups';
import { EditQuizzersPopup } from "./popups/EditQuizzersPopup";

interface PopupProps {
    visible: boolean,
    children: JSX.Element
}

const popupChildrenByType:Record<PopupType, JSX.Element> = {
    "none": <div />,
    "restart-round": <RestartRoundPopup />,
    "set-round-title": <SetRoundTitlePopup />,
    "lineups": <LineupsPopup />,
    "scores": <ScoreViewPopup />,
    "timeout": <TimeoutPopup />,
    "jump": <JumpInfoPopup />,
    "foul": <FoulPopup />,
    "set-question": <SetQuestionPopup />,
    "challenge": <ChallengePopup />,
    "appeal": <AppealPopup />,
    "edit-quizzers": <EditQuizzersPopup />
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
