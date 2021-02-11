import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { LoginFail } from '../actions/auth.actions';
import { LoadUserProfile } from '../actions/profile.actions'


@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private fireAuth: FireAuthService
    ){}

    loadUserProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType('[Home] Login with Google'),
            switchMap(() => {
                return this.fireAuth.login().then((uid) => { return LoadUserProfile({uid}) })
            }),
            catchError((error) => of(LoginFail({error})))
        )
    })
}