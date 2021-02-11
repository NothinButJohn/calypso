import { Injectable } from "@angular/core";
import { MessagingService } from '../../services/messaging.service'


import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';

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
                        return this.msg.queryChatrooms(selectVal) 
                    }),
                    map((qds) => {
                        return MessagingActions.getChatroomsSuccess({qds})
                    })
                )
            })
        )
    })

    // loadSelectedChatroom$ = createEffect(() => this.actions$.pipe())
}