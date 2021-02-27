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
    headerPicture: 'https://pbs.twimg.com/profile_banners/998174888832757760/1612320112/1080x360',
    profilePicture: 'https://i.pinimg.com/736x/9d/5f/be/9d5fbe153339d1feb7cc9af8acf14ac5.jpg',
    registration: '',
    username: 'ghosty',
    name: 'Asuna Sakura'
}

export const ProfileReducer = createReducer<ProfileState>(
    InitialProfileState,
    on(ProfileActions.LoadUserProfileSuccess, (state,action): ProfileState  => {
        return {
            ...action.profile.profile
        }
    }),
)