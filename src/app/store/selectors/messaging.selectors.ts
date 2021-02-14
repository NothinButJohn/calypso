import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessengerState } from '../reducers/messaging.reducers';


const messengerFeatureSelector = createFeatureSelector<MessengerState>('messenger');

export const chatroomsSelector = createSelector(
    messengerFeatureSelector,
    (state: MessengerState):any => {
        return state.chatrooms 
    }
)

export const selectedChatroomId = createSelector(
    messengerFeatureSelector,
    (state: MessengerState):any => {
        return state.selectedChatroom
    }
)

export const selectedChatroomHistorySelector = createSelector(
    messengerFeatureSelector,
    (state: MessengerState):any => {
        return state.selectedChatroomMessageHistory
    }
)
