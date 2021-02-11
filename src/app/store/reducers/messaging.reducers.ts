import { CollectionReference, DocumentReference, QueryDocumentSnapshot } from "@angular/fire/firestore";
import { Action, createReducer, on } from '@ngrx/store';

import * as MessagingActions from '../actions/messaging.actions';

// defining the state shape
export interface MessengerState {
    chatrooms: QueryDocumentSnapshot<unknown>[],
    selectedChatroom: DocumentReference<unknown>,
    selectedChatroomMessageHistory: CollectionReference<unknown>
    allUsernames: string[],
    newChatroomMembers: string[]
}

export const initialMessengerState: MessengerState = {
    chatrooms: [],
    selectedChatroom: null,
    selectedChatroomMessageHistory: null,
    allUsernames: [],
    newChatroomMembers: []
}

export const messagingReducer = createReducer<MessengerState>(
    initialMessengerState,
    on(MessagingActions.getChatroomsSuccess, (state, action): MessengerState => {
        return {
            ...state,
            chatrooms: action.qds,
        }
    }),
);