import * as React from "react";
import { connect } from "react-redux";
import { QuestionState, QuizzerId, TeamId } from "../../types";
import { answerInfoSelector, bonusInfoSelector, questionStateSelector, timeLeftSelector } from "../redux/selectors";
import { setQuestionState, nextQuestion } from '../redux/actions';
import { Popup } from "./Popup";
import { jumpHandler } from '../handlers';
import { getSingleAnswerUiActions, UiAction } from "../ui-actions";
import { Dispatch } from "redux";

interface JumpInfoPopupProps {
    answerInfo: ReturnType<typeof answerInfoSelector>,
    bonusInfo: ReturnType<typeof bonusInfoSelector>,
    questionState: QuestionState,
    timeLeft: number,
    dispatch:Dispatch
}
const mapStateToProps = state => ({
    answerInfo: answerInfoSelector(state),
    bonusInfo: bonusInfoSelector(state),
    questionState: questionStateSelector(state),
    timeLeft: timeLeftSelector(state)
});

export const JumpInfoPopup = connect(mapStateToProps)((props:JumpInfoPopupProps)=> {
    const { answerInfo, bonusInfo, questionState, timeLeft, dispatch } = props;
    const isBonus = questionState === 'bonus';
    const info = isBonus ? bonusInfo.toArray() : answerInfo.toArray();
    const isSingle = info.length === 1;
    const isVisible = ['answer','bonus'].includes(questionState);
    const uiActions = !isSingle ? [] : getSingleAnswerUiActions(dispatch, info[0].teamId, info[0].quizzerId, isBonus, timeLeft > 0);
    
    return <Popup visible={['answer','bonus'].includes(questionState)}>
        { 
            !isVisible ? <div /> :
            isSingle ? singleAnswererPopup({
                teamColor: info[0].color,
                quizzerName: info[0].name,
                timeLeft,
                uiActions
             }) :
                multiAnswererPopup({ close: ()=> { 
                    if(isBonus) nextQuestion(); 
                    setQuestionState('before'); 
                    jumpHandler.clear(); 
                } })
        }
    </Popup>
});

interface SingleAnswerPopupProps { 
    teamColor: string, 
    timeLeft: number,
    quizzerName: string, 
    uiActions: UiAction[]
}
const singleAnswererPopup = (props:SingleAnswerPopupProps) => {
    return <div className={'jump-popup flex-column'} style={ { color: props.teamColor }}>
        <div style={{flex:1}}>{ props.timeLeft }</div>
        <div style={{flex:1}}>{ props.quizzerName }</div>
        <div style={{flex:1}}>
            { props.uiActions.map(a => <button onClick={ a.action }>{ a.name }</button>) }
        </div>
    </div>
}

const multiAnswererPopup = (props:{ close:()=>void}) => <div className={'jump-popup flex-column'}>
    <div>Not Yet Implemented</div>
    <button onClick={ props.close }>OK</button>
</div>