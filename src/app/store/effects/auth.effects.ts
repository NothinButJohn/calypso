import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { googleLogin, googleLoginSuccess, LoginFail } from '../actions/auth.actions';
import { LoadUserProfile } from '../actions/profile.actions'


@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private fireAuth: FireAuthService
    ){}

    loadUserProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(googleLogin),
            switchMap(() => {
                console.log("inside auth effecct")
                return this.fireAuth.login().then((uid) => { 
                    LoadUserProfile({uid})
                    return googleLoginSuccess({uid})
                })
            }),
            catchError((error) => of(LoginFail({error})))
        )
    })
}