import * as React from 'react';
import { answerInfoSelector, bonusInfoSelector, questionStateSelector, timeLeftSelector } from '../../redux/selectors';
import { getSingleAnswerUiActions } from '../../ui-actions';
import { jumpHandler } from '../../handlers';
import { closePopup, nextQuestion, setQuestionState } from '../../redux/actions';
import { QuestionState } from '../../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

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
    const info = props.questionState === 'bonus' ? props.bonusInfo : props.answerInfo;
    return info.size ? singleAnswererPopup(getSingleAnswerProps(props)) : 
        multiAnswererPopup(getMultipleAnswerProps(props))
});

function getSingleAnswerProps(props:JumpInfoPopupProps) {
    const bonus = props.questionState === 'bonus';
    const info = (bonus ? props.bonusInfo : props.answerInfo).get(0);
    return {
        teamColor: info.color,
        quizzerName: info.name,
        timeLeft: props.timeLeft,
        uiActions: getSingleAnswerUiActions(props.dispatch, info.teamId, info.quizzerId, bonus, props.timeLeft > 0)
    }
}
const singleAnswererPopup = (props:ReturnType<typeof getSingleAnswerProps>) => {
    return <div className={'jump-popup flex-column'} style={ { color: props.teamColor }}>
        <div style={{flex:1}}>{ props.timeLeft }</div>
        <div style={{flex:1}}>{ props.quizzerName }</div>
        <div style={{flex:1}}>
            { props.uiActions.map(a => <button key={ a.name } onClick={ a.action }>{ a.name }</button>) }
        </div>
    </div>
}

function getMultipleAnswerProps(props:JumpInfoPopupProps) {
    const bonus = props.questionState === 'bonus';
    return {
        close: ()=> { 
            if(bonus) nextQuestion(); 
            setQuestionState('before'); 
            jumpHandler.clear(); 
            props.dispatch(closePopup());
        }
    }
}
const multiAnswererPopup = (props:ReturnType<typeof getMultipleAnswerProps>) => <div className={'jump-popup flex-column'}>
    <div>Not Yet Implemented</div>
    <button onClick={ props.close }>OK</button>
</div>
