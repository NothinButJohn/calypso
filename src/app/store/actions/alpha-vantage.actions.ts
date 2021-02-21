import { createAction, props } from '@ngrx/store';

export const searchForStock = createAction(
    '[Home] stock search input',
    props<{ query }>()
)
export const searchForStockSuccess = createAction(
    '[Home] stock search input success',
    props<{ results }>()
)
export const selectStock = createAction(
    '[Home] selected stock from search',
    props<{ selectedStock }>()
)
export const loadIntradayCandlestick = createAction(
    '[Home] load intraday candlestick chart options'
)
export const loadIntradayCandlestickSuccess = createAction(
    '[Home] load intraday candlestick chart options success',
    props<{ chartOptions }>()
)
export const loadIntradayCandlestickFail = createAction(
    '[Home] load intraday candlestick chart options failed',
    props<{ error }>()
)
