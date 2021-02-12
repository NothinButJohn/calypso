import { createAction, props } from '@ngrx/store';

export const getChatrooms = createAction(
    '[Messaging] get chatrooms',
)

export const getChatroomsSuccess = createAction(
    '[Messaging] get chatrooms success',
    props<{ qds }>()
)

export const getChatroomsError = createAction(
    '[Messaging] get chatrooms error',
    props<{ error }>()
)



// export const selectChatroom = createAction(
//     '[Messaging] select chatroom',
//     props<{ docRef }>()
// )


// export const openDialog = createAction(
//     '[Messaging] open dialog',
//     props<{}>()
// )
// export const createChatroom = createAction(
//     '[Messaging] create chatroom',
//     props<{}>()
// )
// export const closeDialog = createAction(
//     '[Messaging] close dialog',
//     props<{}>()
// )