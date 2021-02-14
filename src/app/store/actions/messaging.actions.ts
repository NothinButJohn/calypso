import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { message, messengerChatroom } from 'src/app/services/messaging.service';

export const getChatrooms = createAction(
    '[Messaging] get chatrooms',
)

export const getChatroomsSuccess = createAction(
    '[Messaging] get chatrooms success',
    props<{ messengerChatrooms: messengerChatroom[] }>()
)

export const getChatroomsError = createAction(
    '[Messaging] get chatrooms error',
    props<{ error }>()
)

export const getChatroomHistory = createAction(
    '[Messaging] get chatroom history',
    props<{ docId: string }>()
)

export const getChatroomHistorySuccess = createAction(
    '[Messaging] get chatroom history success',
    props<{ result: message[] }>()
)

