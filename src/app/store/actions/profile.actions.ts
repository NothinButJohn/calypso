import { createAction, props } from '@ngrx/store';
import { Profile } from '../models/profile.model';


export const LoadUserProfile = createAction(
    '[Auth Effect] load user profile',
    props<{ uid }>()
)
export const LoadUserProfileSuccess = createAction(
    '[Auth Effect] load user profile',
    props<{ profile }>()
)
export const LoadUserProfileError = createAction(
    '[Auth Effect] load user profile',
    props<{ error }>()
)