import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessengerState } from '../reducers/messaging.reducers';


const messengerFeatureSelector = createFeatureSelector<MessengerState>('messenger');

export const chatroomsSelector = createSelector(
    messengerFeatureSelector,
    (state: MessengerState):any => {
        return state.chatrooms 
    }
)
