import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
                return from(this.fireAuth.login()).pipe(
                    map((uid) => {
                        return LoadUserProfile({uid})
                    })
                )
            }),
            catchError((error) => of(LoginFail({error})))
        )
    })
}