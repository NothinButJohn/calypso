import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StocksState } from '../reducers/alpha-vantage.reducers';


const stocksFeatureSelector = createFeatureSelector<StocksState>('stocks');

export const stocksSearchResultsSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.searchResults
    }
)