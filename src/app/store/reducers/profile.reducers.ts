import { createReducer, on } from '@ngrx/store';
import { Profile } from "../models/profile.model";
import * as ProfileActions from '../actions/profile.actions';

export interface ProfileState {
    headerPicture: string,
    name: string,
    profilePicture: string,
    registration: string,
    username: string
}

export const InitialProfileState: ProfileState = {
    headerPicture: '',
    profilePicture: '',
    registration: '',
    username: '',
    name: ''
}

export const ProfileReducer = createReducer<ProfileState>(
    InitialProfileState,
    on(ProfileActions.LoadUserProfileSuccess, (state,action): ProfileState  => {
        return {
            ...action.profile
        }
    }),
)