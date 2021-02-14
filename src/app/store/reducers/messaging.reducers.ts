import { CollectionReference, DocumentReference, QueryDocumentSnapshot } from "@angular/fire/firestore";
import { Action, createReducer, on } from '@ngrx/store';
import { message, messengerChatroom } from "src/app/services/messaging.service";

import * as MessagingActions from '../actions/messaging.actions';
import { newChatMembers } from "../selectors/messaging.selectors";

// defining the state shape
export interface MessengerState {
    chatrooms: messengerChatroom[],
    selectedChatroom: string,
    selectedChatroomMessageHistory: message[]
    allUsernames: string[],
    newChatroomMembers: string[]
}

export const initialMessengerState: MessengerState = {
    chatrooms: [],
    selectedChatroom: '',
    selectedChatroomMessageHistory: [],
    allUsernames: [],
    newChatroomMembers: []
}

export const messagingReducer = createReducer<MessengerState>(
    initialMessengerState,
    on(MessagingActions.getChatroomsSuccess, (state, action): MessengerState => {
        console.log('in reducer: ', action.messengerChatrooms)
        return {
            ...state,
            chatrooms: action.messengerChatrooms
        }
    }),
    on(MessagingActions.getChatroomHistorySuccess, (state, action): MessengerState => {
        return{
            ...state,
            selectedChatroomMessageHistory: action.result,
            selectedChatroom: action.selectedDoc
        }
    }),
    on(MessagingActions.getAllUsernamesSuccess, (state,action): MessengerState => {
        return {
            ...state,
            allUsernames:action.allUsers
        }
    }),
    on(MessagingActions.addMemberToNewChatroom, (state,action): MessengerState => {
        
        return {
            ...state,
            newChatroomMembers: action.user
        }
    })

);