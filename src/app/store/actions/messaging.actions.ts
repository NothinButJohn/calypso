import { createAction, props } from '@ngrx/store';
import { messengerChatroom } from 'src/app/services/messaging.service';

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

