import * as React from 'react';
import { answerInfoSelector, bonusInfoSelector, questionStateSelector, timeLeftSelector } from '../../redux/selectors';
import { jumpHandler, timerHandler } from '../../handlers';
import { addAnswered, closePopup, nextQuestion, setQuestionState } from '../../redux/actions';
import { QuestionState, QuizzerId, TeamId } from '../../../types';
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
        dispatch: props.dispatch,
        teamColor: info.color,
        quizzerName: info.name,
        timeLeft: props.timeLeft,
        teamId: info.teamId, 
        quizzerId: info.quizzerId,
        bonus
    };
}

function answered(dispatch: Dispatch, teamId: TeamId, quizzerId: QuizzerId, bonus: boolean, correct: boolean) {
    // add score, set question, set question state, clear jump handler
    dispatch(addAnswered(teamId, quizzerId, correct, bonus));
    if (correct || bonus) {
        dispatch(nextQuestion());
        dispatch(setQuestionState('before'));
        timerHandler.clearTimer();
        jumpHandler.clear();
        dispatch(closePopup());
    }
    else dispatch(setQuestionState('bonus'));
}

const singleAnswererPopup = (props:ReturnType<typeof getSingleAnswerProps>) => {
    const { teamColor, quizzerName, timeLeft, teamId, quizzerId, bonus, dispatch } = props;
    return <div className={'jump-popup flex-column'} style={ { color: teamColor }}>
        <div style={{flex:1}}>{ timeLeft }</div>
        <div style={{flex:1}}>{ quizzerName }</div>
        <div style={{flex:1}}>
            { timeLeft === 0 ?
                <button onClick={ () => timerHandler.setTimer(30, 'jump-timer') }>Set</button> :
                <button onClick={ () => timerHandler.resetTimer() }>Reset</button>
            }
            <button onClick={ () => timerHandler.clearTimer() }>Clear</button>
            <button onClick={ () => answered(dispatch,teamId,quizzerId,bonus,true) }>Correct</button>
            <button onClick={ () => answered(dispatch,teamId,quizzerId,bonus,false) }>Error</button>
            <button onClick={ () => {
                timerHandler.clearTimer();
                jumpHandler.clear();
                dispatch(setQuestionState('before'));
                dispatch(closePopup());
            } }>Cancel</button>
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
