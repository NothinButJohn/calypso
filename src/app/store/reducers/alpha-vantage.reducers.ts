import { Action, createReducer, on } from '@ngrx/store';
import { CandlestickChartOptions } from 'src/app/services/alpha-vantage.service';
import * as AlphaActions from '../actions/alpha-vantage.actions'

export const initChartOptions: CandlestickChartOptions = {
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
    },
    stroke: {
      curve: 'smooth'
    }
  }

export interface StocksState {
    searchResults: [],
    selectedStock?: any,
    selectedInterval?: string,
    chartOptions?: any,
    error?: string,
    series?: any,
    technicalIndicators: string[],
    intradayIntervals: string[],
    companyOverview?: any
}
export const initialStocksState: StocksState = {
    searchResults: [],
    selectedStock: {},
    selectedInterval: '5min',
    chartOptions: {
      series: [],
      chart: {
        type: 'candlestick'
      }
    },
    error: '',
    technicalIndicators: [
      'SMA',
      'EMA',
      'MACD'
    ],
    intradayIntervals: [
        '1min',
        '5min',
        '15min',
        '30min',
        '60min'
      ],
    companyOverview: {}
    
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
            chartOptions: {series: action.seriesData.series, chart: state.chartOptions.chart}
        }
    }),
    on(AlphaActions.loadIntradayCandlestickFail, (state, action): StocksState => {
        return {
            ...state,
            error: action.error
        }
    }),
    on(AlphaActions.searchForStockFail, (state, action): StocksState => {
        return {
            ...state,
            error: action.error
        }
    }),
    on(AlphaActions.selectInterval, (state, action): StocksState => {
        return {
            ...state,
            selectedInterval: action.selectedInterval
        }
    }),
    on(AlphaActions.loadCompanyOverviewSuccess, (state, action): StocksState=> {
      return {
        ...state,
        companyOverview: action.companyOverview
      }
    }),
    on(AlphaActions.loadTechnicalIndicatorSuccess, (state, action): StocksState => {
      return {
        ...state,
        chartOptions: {
          series: [...state.chartOptions.series, action.technicalIndicatorData.series[0]],
          chart: {
            type: 'line'
          }
        }
      }
    })
)