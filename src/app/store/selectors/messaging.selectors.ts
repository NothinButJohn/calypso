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

export const allUsersSelector = createSelector(
    messengerFeatureSelector,
    (state: MessengerState): any => {
        return state.allUsernames
    }
)

export const newChatMembers = createSelector(
    messengerFeatureSelector,
    (state: MessengerState): any => {
        return state.newChatroomMembers
    }
)

export const getChatroomSelector = createSelector(
    messengerFeatureSelector,
    (state: MessengerState, props): any => {
        let index = state.chatrooms.findIndex((chatroom) => chatroom.docId == props.docId)
        console.log('inside getchatroom selector; propid: ' ,props.docId, state[index], index)
        return state.chatrooms[index]
    }
)
