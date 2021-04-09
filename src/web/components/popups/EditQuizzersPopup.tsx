import { List } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Quizzer } from '../../../types';
import { closePopup } from '../../redux/actions';
import { RoundState } from '../../redux/reducer';
import { quizzersSelector } from '../../redux/selectors';


interface EditQuizzersPopupProps {
    quizzers: List<Quizzer>,
    dispatch:Dispatch
}

const mapStateToProps = (state:RoundState) => ({
    quizzers: quizzersSelector(state).toList()
});

export const EditQuizzersPopup = connect(mapStateToProps)((props:EditQuizzersPopupProps) => {
    const { quizzers, dispatch } = props;
    const [name,setName] = React.useState('');
    const [abbrName,setAbbrName] = React.useState('');
    const [teamName,setTeamName] = React.useState('');

    return <React.Fragment>
        <table className='edit-quizzers'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Abbr Name</th>
                    <th>Team</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                { quizzers.map(a => <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.abbrName}</td>
                    <td>{a.teamName}</td>
                    <td><a onClick={ () => deleteQuizzer(a.id) }>delete</a></td>
                </tr>)}
            </tbody>
        </table>
        <div>
            <label htmlFor='name'>Name
                <input type='text' name='name' id='name' value={name} onChange={ evt => setName(evt.target.value) } />
            </label>
            <label htmlFor='abbrName'>Abbr Name
                <input type='text' name='abbrName' id='abbrName' value={abbrName} onChange={ evt => setAbbrName(evt.target.value) } />
            </label>
            <label htmlFor='teamName'>Team Name
                <input type='text' name='teamName' id='teamName' value={teamName} onChange={ evt => setTeamName(evt.target.value) } />
            </label>
            <button onClick={ () => saveQuizzer(name,abbrName,teamName) }>Add</button>
            <button onClick={ () => dispatch(closePopup()) }>Done</button>
        </div>
    </React.Fragment>
});

function saveQuizzer(name:string,abbrName:string,teamName:string) {
    console.log('add quizzer', { name, abbrName, teamName});
}
function deleteQuizzer(quizzerId:string) {
    console.log(`delete quizzer - ${quizzerId}`);
}