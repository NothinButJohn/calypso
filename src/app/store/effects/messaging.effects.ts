import { Injectable } from "@angular/core";
import { MessagingService, messengerChatroom } from '../../services/messaging.service'


import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, concatAll, withLatestFrom, concatMap, combineAll, mergeAll, exhaustMap } from 'rxjs/operators';

import * as MessagingActions from '../actions/messaging.actions'
import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { usernameSelector } from "../selectors/profile.selectors";
import { Action } from "rxjs/internal/scheduler/Action";
import { selectedChatroomId } from "../selectors/messaging.selectors";

@Injectable({
    providedIn: 'root'
})
export class MessagingEffects {
    constructor(
        private msg: MessagingService,
        private actions$: Actions,
        private store: Store
    ){}

    loadChatrooms$ = createEffect(() => {
        return this.actions$.pipe(
            ofType('[Messaging] get chatrooms'),
            withLatestFrom(this.store.select(usernameSelector)),
            map(([,currentUserUsername]) => {
                return this.msg.queryChatrooms(currentUserUsername).pipe(
                    map((messengerChatrooms: messengerChatroom[])=>{
                        console.log("within loadChatrooms$ effect, dispatching getChatroomsSuccess with:", messengerChatrooms)
                        return MessagingActions.getChatroomsSuccess({ messengerChatrooms }) 
                    })
                )
            }),concatAll()
        )
    })

    loadChatroomHistory$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MessagingActions.getChatroomHistory),
            switchMap(action => {
                return this.msg.queryChatroomHistory(action.docId).pipe(
                    map((messageHistory) => {
                        return MessagingActions.getChatroomHistorySuccess({result: messageHistory, selectedDoc: action.docId})
                    })
                )
            })
        )
    })

    sendMessage$ = createEffect(() => 
        this.actions$.pipe(
            ofType(MessagingActions.sendMessageToChatroom),
            withLatestFrom(this.store.select(selectedChatroomId)),
            map(([action, id]) => {
                this.msg.sendMessage(action.payload, id)
            })
        ), { dispatch: false }
    )
}