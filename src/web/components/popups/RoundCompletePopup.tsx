import { List } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Score } from '../../../types';
import { RoundState } from '../../redux/reducer'
import { scoresSelector } from '../../redux/selectors';

interface RoundCompletePopupProps {
    scores:List<Score>,
    dispatch:Dispatch
}

const mapStateToProps = (state:RoundState) => ({
    scores: scoresSelector(state)
});

export const RoundCompletePopup = connect(mapStateToProps)((props:RoundCompletePopupProps) => {
    const { scores, dispatch } = props;
    return <React.Fragment>
        <div />
    </React.Fragment>
});