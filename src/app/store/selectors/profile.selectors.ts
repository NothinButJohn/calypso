import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProfileState } from "../reducers/profile.reducers";


const profileFeatureSelector = createFeatureSelector<ProfileState>('profile');

export const usernameSelector = createSelector(
    profileFeatureSelector,
    (state: ProfileState):any => {
        return state?.username
    }
)

