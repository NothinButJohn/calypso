import { createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MetaThought, Thought } from '../models/meta-thoughts.model';
import { Profile } from '../models/profile.model';


export const LoadUserProfile = createAction(
    '[Auth Effect] load user profile',
    props<{ uid }>()
)
export const LoadUserProfileSuccess = createAction(
    '[Auth Effect] load user profile success',
    props<{ profile }>()
)
export const LoadUserProfileError = createAction(
    '[Auth Effect] load user profile error',
    props<{ error }>()
)
export const LoadCurrentUserMetaThoughts = createAction(
    '[Profile] load current user meta thoughts'
)
export const LoadCurrentUserMetaThoughtsSuccess = createAction(
    '[Profile] load current user meta thoughts success',
    props<{ metaThoughtDocs }>()
)
export const CreateNewMetaThought = createAction(
    '[Meta] create new meta-thought',
    props<{ thought, fileInput }>()
)
export const CreateNewMetaThought2 = createAction(
    '[Meta] create new meta-thought23',
    props<{ thought, fileInput }>()
)
export const SettleAuthorProfileReferences = createAction(
    '[Profile] load AuthorProfiles from reference paths',
    props<{ metaThoughtDocs }>()
)