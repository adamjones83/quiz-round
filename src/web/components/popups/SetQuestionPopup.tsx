import * as React from 'react';
import { closePopup, setQuestion } from '../../redux/actions';
import { questionSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface SetQuestionPopupProps {
    question: number,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    question: questionSelector(state)
});

/** a popup that can be displayed to control a named timer - timeouts, challenges, appeals */
export const SetQuestionPopup = connect(mapStateToProps)((props:SetQuestionPopupProps) => {
    const { question, dispatch } = props;
    const [newQuestion,setNewQuestion] = React.useState(question);
    
    return <React.Fragment>
        <div>Question #:</div>
        <select value={newQuestion} onChange={evt=>setNewQuestion(parseInt(evt.target.value))}>
            { [...new Array(23)].map((_,i) => <option key={i} value={i+1}>{i+1}</option>)}
        </select>
        <button onClick={ () => {
            dispatch(setQuestion(newQuestion));
            dispatch(closePopup());
        } }>Ok</button>
        <button onClick={ () => dispatch(closePopup()) }>Cancel</button>
    </React.Fragment>
});