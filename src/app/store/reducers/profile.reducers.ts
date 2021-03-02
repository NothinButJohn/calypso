import { createReducer, on } from '@ngrx/store';
import { Profile } from "../models/profile.model";
import * as ProfileActions from '../actions/profile.actions';

export interface ProfileState {
    headerPicture: string,
    name: string,
    profilePicture: string,
    registration: string,
    username: string,
    bio: string
}

export const InitialProfileState: ProfileState = {
    headerPicture: 'https://pbs.twimg.com/profile_banners/998174888832757760/1612320112/1080x360',
    profilePicture: 'https://i.pinimg.com/736x/9d/5f/be/9d5fbe153339d1feb7cc9af8acf14ac5.jpg',
    registration: '',
    username: 'ghosty',
    name: 'Asuna Sakura',
    bio: "Yo what the fuck is up. My ambition is only make right decisions on my mission. Everything I said I'd do, I did.Don’t sell your soul for money son" 
    + "Means nothing when your dead. All I kept thinking about, over and over, was You can't live forever; you can't live forever. "
}

export const ProfileReducer = createReducer<ProfileState>(
    InitialProfileState,
    on(ProfileActions.LoadUserProfileSuccess, (state,action): ProfileState  => {
        return {
            ...action.profile.profile
        }
    }),
)