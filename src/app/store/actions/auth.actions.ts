import { createAction, props } from '@ngrx/store';

export const googleLogin = createAction(
    '[Home] Login with Google'
)
export const googleLoginSuccess = createAction(
    '[Home] Login with Google Successful',
    props<{ uid }>()
)

export const LoginFail = createAction(
    '[Home] Login Fail',
    props<{ error }>()
)

export const logout = createAction(
    '[Home] Logout'
)