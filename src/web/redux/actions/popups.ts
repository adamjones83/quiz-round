import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { PopupType } from '../../../types';
import { Map } from 'immutable';
import { RoundState } from '../reducer';

export const showPopup = createAction<PopupType>('SHOW_POPUP');
export const closePopup = createAction('CLOSE_POPUP');

export function addAdminActions(builder:ActionReducerMapBuilder<Map<string,unknown>>):void {
    builder
        .addCase(showPopup, (state,{payload}) => (state as unknown as RoundState)
            .set('showPop', payload))
        .addCase(closePopup, state => state.set('showPopup', 'none'))
}