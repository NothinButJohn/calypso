import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions'


export interface AuthState {
    authenticated: boolean,
    uid: string
}
export const initialAuthState: AuthState = {
    authenticated: false,
    uid: ''
}

export const AuthReducer = createReducer<AuthState>(
    initialAuthState,
    on(AuthActions.googleLoginSuccess, (state, action):AuthState => {
        return {
            authenticated: true,
            uid: action.uid
        }
    })
)

