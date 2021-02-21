import { Action, createReducer, on } from '@ngrx/store';
import { CandlestickChartOptions } from 'src/app/services/alpha-vantage.service';
import * as AlphaActions from '../actions/alpha-vantage.actions'

export const initChartOptions:CandlestickChartOptions = {
    chart: {
      type: "candlestick",
      height: 350
    },
    series: [],  
    title: {
      text: '',
      align: "left"
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      tooltip: {
        enabled: true,
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
    },
    theme: {
      mode: 'dark'
    },
    noData: {
        text: 'Search for an Equity'
    }
  }

export interface StocksState {
    searchResults: [],
    selectedStock?: any,
    selectedInterval?: string,
    chartOptions?: CandlestickChartOptions
    error?: string
}
export const initialStocksState: StocksState = {
    searchResults: [],
    selectedStock: {},
    selectedInterval: '1min',
    chartOptions: initChartOptions,
    error: ''
    
}


export const stocksReducer = createReducer<StocksState>(
    initialStocksState,
    on(AlphaActions.searchForStockSuccess, (state, action): StocksState => {
        return {
            ...state,
            searchResults: action.results
        }
    }),
    on(AlphaActions.selectStock, (state, action): StocksState => {
        return {
            ...state,
            selectedStock: action.selectedStock
        }
    }),
    on(AlphaActions.loadIntradayCandlestickSuccess, (state,action): StocksState => {
        return{ 
            ...state,
            chartOptions: action.chartOptions
        }
    }),
    on(AlphaActions.loadIntradayCandlestickFail, (state, action): StocksState => {
        return {
            ...state,
            error: action.error
        }
    })
)