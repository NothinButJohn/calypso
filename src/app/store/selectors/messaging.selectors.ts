import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessengerState } from '../reducers/messaging.reducers';


const messengerFeatureSelector = createFeatureSelector<MessengerState>('messenger');

export const chatroomListSelector = createSelector(
    messengerFeatureSelector,
    (state: MessengerState):any => {
        return state?.chatrooms 
    }
)
