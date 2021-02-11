import { createReducer, on } from '@ngrx/store';
import { Profile } from "../models/profile.model";
import * as ProfileActions from '../actions/profile.actions';


export const InitialProfileState: Profile = {
    headerPicture: '',
    profilePicture: '',
    registration: '',
    username: '',
    name: ''
}

export const ProfileReducer = createReducer<Profile>(
    InitialProfileState,
    on(ProfileActions.LoadUserProfileSuccess, (state,action): Profile  => {
        return {
            ...action.profile
        }
    }),
)