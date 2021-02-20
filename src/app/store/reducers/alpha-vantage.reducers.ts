import { Action, createReducer, on } from '@ngrx/store';
import * as AlphaActions from '../actions/alpha-vantage.actions'


export interface StocksState {
    searchResults: [],
    selectedStock?: string,
    selectedInterval?: string
}
export const initialStocksState: StocksState = {
    searchResults: []
}

export const stocksReducer = createReducer<StocksState>(
    initialStocksState,
    on(AlphaActions.searchForStockSuccess, (state, action): StocksState => {
        return {
            ...state,
            searchResults: action.results
        }
    })
)