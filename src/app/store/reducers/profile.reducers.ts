import { createReducer, on } from '@ngrx/store';
import { Profile } from "../models/profile.model";
import * as ProfileActions from '../actions/profile.actions';

export interface ProfileState {
    headerPicture: string,
    name: string,
    profilePicture: string,
    registration: string,
    username: string,
    bio: string,
    metathoughts?: any
}

export const InitialProfileState: ProfileState = {
    headerPicture: '',
    profilePicture: '',
    registration: '',
    username: '',
    name: '',
    bio: "",
    metathoughts: []
}

export const ProfileReducer = createReducer<ProfileState>(
    InitialProfileState,
    on(ProfileActions.LoadUserProfileSuccess, (state,action): ProfileState  => {
        return {
            ...state,
            ...action.profile.profile
        }
    }),
    on(ProfileActions.LoadCurrentUserMetaThoughtsSuccess, (state, action): ProfileState => {
        return {
            ...state,
            metathoughts: action.metaThoughtDocs
        }
    })
)