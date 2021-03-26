import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { QuestionState } from "../data/types";
import { answerInfoSelector, bonusInfoSelector, jumpHandlerSelector, questionStateSelector, timeLeftSelector } from "../redux/selectors";
import { JumpHandler, setQuestionState, answered, bonusAnswered, AnsweredInfo, answering, nextQuestion } from '../redux/actions';
import { Popup } from "./Popup";

interface JumpInfoPopupProps {
    answerInfo: ReturnType<typeof answerInfoSelector>,
    bonusInfo: ReturnType<typeof bonusInfoSelector>,
    questionState: QuestionState,
    timeLeft: number,
    dispatch: Dispatch,
    jumpHandler: JumpHandler
}
const mapStateToProps = state => ({
    answerInfo: answerInfoSelector(state),
    bonusInfo: bonusInfoSelector(state),
    questionState: questionStateSelector(state),
    timeLeft: timeLeftSelector(state),
    jumpHandler: jumpHandlerSelector(state)
});
function getAnsweredInfos(info:{ teamId:string, quizzerId:string }[], correct:boolean) {
    return info.map(a => ({...a, correct })) as AnsweredInfo[];
}
function getUiActions(dispatch:Dispatch, jumpHandler:JumpHandler, isBonus:boolean, info:{ teamId:string, quizzerId:string }[]) {
    return isBonus ? [
        { name: 'Correct', click: () => { dispatch(bonusAnswered(getAnsweredInfos(info, true))); jumpHandler.clear(); } },
        { name: 'Error', click: () => { dispatch(bonusAnswered(getAnsweredInfos(info, false))); jumpHandler.clear(); } },
        { name: 'Cancel', click: () => { dispatch(setQuestionState('before')); jumpHandler.clear(); } }
    ] : [
        { name: 'Correct', click: () => { dispatch(answered(getAnsweredInfos(info, true))); jumpHandler.clear(); } },
        { name: 'Error', click: () => { dispatch(answered(getAnsweredInfos(info, false))); } },
        { name: 'Cancel', click: () => { dispatch(setQuestionState('before')); jumpHandler.clear(); } }
    ];
}
export const JumpInfoPopup = connect(mapStateToProps, dispatch => ({dispatch}))((props:JumpInfoPopupProps) => {
    const { answerInfo, bonusInfo, questionState, timeLeft, dispatch, jumpHandler } = props;
    const isBonus = questionState === 'bonus';
    const info = isBonus ? bonusInfo.toArray() : answerInfo.toArray();
    const isSingle = info.length === 1;
    const isVisible = ['answer','bonus'].includes(questionState)
    return <Popup visible={['answer','bonus'].includes(questionState)}>
        { 
            !isVisible ? <div /> :
            isSingle ? singleAnswererPopup({
                teamColor: info[0].color,
                quizzerName: info[0].name,
                uiActions: getUiActions(dispatch, jumpHandler, isBonus, info),
                timeLeft
             }) :
                multiAnswererPopup({ close: ()=> { 
                    if(isBonus) dispatch(nextQuestion()); 
                    dispatch(setQuestionState('before')); 
                    jumpHandler.clear(); 
                } })
        }
    </Popup>
});

const singleAnswererPopup = (props:{
    teamColor: string;
    timeLeft: number;
    quizzerName: string;
    uiActions: { name:string, click:()=>void }[]
}) => <div className={'jump-popup flex-column'} style={ { color: props.teamColor }}>
    <div style={{flex:1}}>{ props.timeLeft }</div>
    <div style={{flex:1}}>{ props.quizzerName }</div>
    <div style={{flex:1}}>
        { props.uiActions.map(a => <button key={a.name} onClick={a.click}>{a.name}</button>) }
    </div>
</div>

const multiAnswererPopup = (props:{ close:()=>void}) => <div className={'jump-popup flex-column'}>
    <div>Not Yet Implemented</div>
    <button onClick={ props.close }>OK</button>
</div>