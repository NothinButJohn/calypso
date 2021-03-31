import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatAll, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { MetaThoughtService } from 'src/app/services/meta-thought.service';
import { ProfileService } from 'src/app/services/profile.service';
import { CreateNewMetaThought, CreateNewMetaThought2, LoadCurrentUserMetaThoughts, LoadCurrentUserMetaThoughtsSuccess, LoadUserProfile, LoadUserProfileSuccess, SettleAuthorProfileReferences } from '../actions/profile.actions';
import { MetaThought, Thought } from '../models/meta-thoughts.model';
import { Profile } from '../models/profile.model';
import { currentUserUIDSelector } from '../selectors/auth.selectors';
import { usernameSelector } from '../selectors/profile.selectors';


@Injectable()
export class ProfileEffects {
    constructor(
        private actions$: Actions, 
        private profileService: ProfileService,
        private store: Store,
        private mts: MetaThoughtService){}

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

    loadCurrentUserMetaThoughts$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LoadCurrentUserMetaThoughts),
            withLatestFrom(this.store.select(currentUserUIDSelector)),
            switchMap(([action, uid]) => {
                console.log('going into service...', uid)
                return this.mts.getAllMetaThoughtsByCurrentUser(uid).pipe(
                    map((allMetaThoughtDocsArray) => {
                        console.log('dispatching...',allMetaThoughtDocsArray)
                        return SettleAuthorProfileReferences({metaThoughtDocs: allMetaThoughtDocsArray})
                    })
                )
            })
        )
    })
    loadAuthorProfiles$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(SettleAuthorProfileReferences),
            switchMap((action) => {
                        return this.mts.loadAuthorProfiles(action.metaThoughtDocs).pipe(
                            map((res) => {
                                console.log('[profile.effects]::loadAuthorProfiles$ Response from meta-thought service: ', res)
                                return LoadCurrentUserMetaThoughtsSuccess({metaThoughtDocs: res})
                            })
                        )
                    
                
            })
        )
    })

    createMetaThought$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CreateNewMetaThought),
            withLatestFrom(this.store.select(currentUserUIDSelector)),
            withLatestFrom(this.store.select(usernameSelector)),
            switchMap( ([[action, uid], username]) => {
                let newThought: Thought<MetaThought>
                
                    let r = this.mts.uploadMedia2(action.fileInput, uid).pipe(
                        switchMap(val => {
                            val[0].then((r)=> {
                                console.log(r)
                            })
                            console.log(val)
                            let mediaArray = []
                            let payload = action.thought
                            newThought = new Thought(payload, username, mediaArray)
                            console.log('[new-thought-dialog|profile.effects]createThought()', newThought)
                            return this.mts.createNewThought(newThought, uid, username).then(
                                (response) => {
                                    if(response == false){
                                        throw new Error('metathought creation failed in service')
                                    }else {
                                        return LoadCurrentUserMetaThoughts()
                                    }
                                }
                            )
                        })
                    )
                    return r
            })
        )
    })
    createMetaThought$2 = createEffect(() => {
        return this.actions$.pipe(
            ofType(CreateNewMetaThought2),
            withLatestFrom(this.store.select(currentUserUIDSelector)),
            withLatestFrom(this.store.select(usernameSelector)),
            switchMap( ([[action, uid], username]) => {
                let newThought: Thought<MetaThought>
                
                    return this.mts.uploadMedia3(action.fileInput, uid).pipe(
                        switchMap(val => {
                            let mediaArray = val
                            let payload = action.thought
                            newThought = new Thought(payload, username, mediaArray)
                            console.log('[new-thought-dialog|profile.effects]createThought()', newThought)
                            return this.mts.createNewThought(newThought, uid, username).then(
                                (response) => {
                                    if(response == false){
                                        throw new Error('metathought creation failed in service')
                                    }else {
                                        return LoadCurrentUserMetaThoughts()
                                    }
                                }
                            )
                        })
                    )
                    // return r
            })
        )
    })
}