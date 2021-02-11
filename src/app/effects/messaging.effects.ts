import { Injectable } from "@angular/core";
import { MessagingService } from '../services/messaging.service'


import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';

import * as MessagingActions from '../actions/messaging.actions'

@Injectable()
export class MessagingEffects {
    constructor(
        private msg: MessagingService,
        private actions$: Actions
    ){}

    loadChatrooms$ = createEffect(() => this.actions$.pipe(
        ofType('[Messaging] get chatrooms'),
        switchMap(() => this.msg.queryChatroomsOnce().pipe(
            map((qds) => {
                return MessagingActions.getChatroomsSuccess({ qds })
            })
        ))
    ))

    loadSelectedChatroom$ = createEffect(() => )

}