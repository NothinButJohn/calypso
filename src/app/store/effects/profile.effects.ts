import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProfileService } from 'src/app/services/profile.service';
import { LoadUserProfile, LoadUserProfileSuccess } from '../actions/profile.actions';
import { Profile } from '../models/profile.model';


@Injectable()
export class ProfileEffects {
    constructor(
        private actions$: Actions, 
        private profileService: ProfileService){}

    loadProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LoadUserProfile),
            switchMap((action) => this.profileService.queryUserProfile(action.uid).pipe(
                map((response)=> {
                    let profile = response.data()
                    return LoadUserProfileSuccess({profile})
                })
            ))
        )
    })
}