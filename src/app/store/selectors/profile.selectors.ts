import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProfileState } from "../reducers/profile.reducers";


const profileFeatureSelector = createFeatureSelector<ProfileState>('profile');

export const usernameSelector = createSelector(
    profileFeatureSelector,
    (state: ProfileState):any => {
        return state?.username
    }
)
export const headerPictureSelector = createSelector(
    profileFeatureSelector,
    (state: ProfileState):any => {
        return state?.headerPicture
    }
)
export const profilePictureSelector = createSelector(
    profileFeatureSelector,
    (state: ProfileState):any => {
        return state?.profilePicture
    }
)
export const registeredNameSelector = createSelector(
    profileFeatureSelector,
    (state: ProfileState):any => {
        return state?.name
    }
)

