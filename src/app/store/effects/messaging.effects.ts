import { Injectable } from "@angular/core";
import { MessagingService } from '../../services/messaging.service'


import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, concatAll, withLatestFrom, concatMap, combineAll, mergeAll, exhaustMap } from 'rxjs/operators';

import * as MessagingActions from '../actions/messaging.actions'
import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { usernameSelector } from "../selectors/profile.selectors";

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
            switchMap(() => {
                return this.store.select(usernameSelector).pipe(
                     map((selectVal) => {
                        console.log(selectVal)
                        return this.msg.queryChatrooms(selectVal).pipe(
                            map((messengerChatroomArray)=>{
                                console.log(messengerChatroomArray)
                                return MessagingActions.getChatroomsSuccess({docs: messengerChatroomArray}) 
                            })
                        )
                    }),
                    mergeAll()
                )
            }),
            catchError((error) => of(MessagingActions.getChatroomsError({error}))) 
        )
    })

    // loadSelectedChatroom$ = createEffect(() => this.actions$.pipe())
}