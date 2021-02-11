import { createAction, props } from '@ngrx/store';




export const getChatrooms = createAction(
    '[Messaging] get chatrooms',
    props<{}>()
)
export const getChatroomsSuccess = createAction(
    '[Messaging] get chatrooms success',
    props<{ qds }>()
)



export const selectChatroom = createAction(
    '[Messaging] select chatroom',
    props<{}>()
)
export const openDialog = createAction(
    '[Messaging] open dialog',
    props<{}>()
)
export const createChatroom = createAction(
    '[Messaging] create chatroom',
    props<{}>()
)
export const closeDialog = createAction(
    '[Messaging] close dialog',
    props<{}>()
)