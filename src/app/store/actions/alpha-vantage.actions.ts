import { createAction, props } from '@ngrx/store';

export const searchForStock = createAction(
    '[Home] stock search input',
    props<{ query }>()
)
export const searchForStockSuccess = createAction(
    '[Home] stock search input success',
    props<{ results }>()
)
