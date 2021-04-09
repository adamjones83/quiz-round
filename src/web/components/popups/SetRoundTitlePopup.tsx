import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { closePopup, setRoundTitle } from '../../redux/actions';
import { RoundState } from '../../redux/reducer';
import { titleSelector } from '../../redux/selectors';



interface SetRoundTitlePopupProps {
    title:string,
    dispatch:Dispatch
}

const mapStateToProps = (state:RoundState) => ({
    title: titleSelector(state)
});

export const SetRoundTitlePopup = connect(mapStateToProps)((props:SetRoundTitlePopupProps) => {
    const oldTitle = props.title;
    const { dispatch } = props;
    const [title,setTitle] = React.useState(oldTitle);
    return <React.Fragment>
        <label htmlFor='title'> Title
            <input type='text' id='title' name='title'
                value={title} onChange={ evt => setTitle(evt.target.value) } />
        </label>
        <button onClick={ () => { dispatch(setRoundTitle(title)); dispatch(closePopup()); } }>Ok</button>
        <button onClick={ () => { dispatch(closePopup()); } }>Cancel</button>
    </React.Fragment>
})