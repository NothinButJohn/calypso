import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../reducers/auth.reducers";

const authFeatureSelector = createFeatureSelector<AuthState>('auth');

export const currentUserUIDSelector = createSelector(
    authFeatureSelector,
    (state: AuthState):any => {
        return state.uid
    }
)

