import * as React from 'react'
import { List } from 'immutable';
import { QuizzerId, Quizzer } from '../../../types';

interface QuizzerSelectProps {
    quizzerId: QuizzerId,
    quizzers: List<Quizzer>,
    showNone: boolean,
    setQuizzerId: (quizzerId:QuizzerId) => void
}

export const QuizzerSelect = (props:QuizzerSelectProps):JSX.Element => {
    const { quizzers, quizzerId, showNone, setQuizzerId } = props;
    const items = showNone ? quizzers.unshift({ id:'', abbrName:'--none--'} as Quizzer) : quizzers;
    return <React.Fragment>
        <select value={quizzerId} onChange={ evt => setQuizzerId(evt.target.value) }>
            { items.map(t => <option key={t.id} value={t.id}>{ t.abbrName }</option> ) }
        </select>
    </React.Fragment>
};