import { createAction, props } from '@ngrx/store';
import { User } from './user.model';


export const AUTH_ERROR             = '[Auth] Error';


// user actions describe possible transitions 

export const getUser = createAction(
    '[Auth] Get user',
    props<{payload?: any}>()
)
export const authenticated = createAction(
    '[Auth] Authenticated',
    props<{payload?: any}>()
)
export const notAuthenticated = createAction(
    '[Auth] Not Authenticated',
    props<{payload?: any}>()
)
export const googleLogin = createAction(
    '[Auth] Google login attempt',
    props<{payload?: any}>()
)
export const logout = createAction(
    '[Auth] Logout',
    props<{payload?: any}>()
)

