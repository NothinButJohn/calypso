import { createAction, props } from '@ngrx/store';

export const searchForStock = createAction(
    '[Home] stock search input',
    props<{ query }>()
)
export const searchForStockSuccess = createAction(
    '[Home] stock search input success',
    props<{ results }>()
)
export const searchForStockFail = createAction(
    '[Home] stock search input failed',
    props<{ error }>()
)
export const selectStock = createAction(
    '[Home] selected stock from search',
    props<{ selectedStock }>()
)
export const selectInterval = createAction(
    '[Home] selected interval',
    props<{ selectedInterval }>()
)
export const loadIntradayCandlestick = createAction(
    '[Home] load intraday candlestick chart options'
)
export const loadIntradayCandlestickSuccess = createAction(
    '[Home] load intraday candlestick chart options success',
    props<{ seriesData }>()
)
export const loadIntradayCandlestickFail = createAction(
    '[Home] load intraday candlestick chart options failed',
    props<{ error }>()
)

export const loadCompanyOverviewSuccess = createAction(
    '[Home] load company overview success',
    props<{ companyOverview }>()
)
export const loadCompanyOverviewFail = createAction(
    '[Home] load company overview failed',
    props<{ error }>()
)
export const loadTechnicalIndicator = createAction(
    '[Candlestick] load technical indicator',
    props<{ technicalIndicator }>()
)

export const loadTechnicalIndicatorSuccess = createAction(
    '[Candlestick] load technical indicator success',
    props<{ technicalIndicatorData }>()
)
