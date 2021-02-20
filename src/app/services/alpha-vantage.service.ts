import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { pathToFileURL, Url } from 'url';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexTheme
} from "ng-apexcharts";

export type CandlestickChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  theme: ApexTheme
};

@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {
  alphaKey: string = 'CR8KNAA8AUN29JG4';
  URL: string = 'https://www.alphavantage.co/query?'

  FUNCTIONS = {
    TIME_SERIES: {
      INTRADAY: 'function=TIME_SERIES_INTRADAY',
      DAILY: 'function=TIME_SERIES_DAILY',
      ADJUSTED: 'function=TIME_SERIES_DAILY_ADJUSTED',
      WKLY_ADJUSTED: 'function=TIME_SERIES_WEEKLY_ADJUSTED',
      MNTHLY_ADJUSTED: 'function=TIME_SERIES_MONTHLY_ADJUSTED'
    },
    FUNDAMENTALS: {
      COMP_OVERVIEW: 'function=OVERVIEW',
      INCOME_STATEMENT: 'function=INCOME_STATEMENT',
      CASH_FLOW: 'function=CASH_FLOW',
      EARNINGS: 'function=EARNINGS',
      EARNINGS_CAL: 'function=EARNINGS_CALENDAR'
    }
  }

  INTERVAL = {
    one: '1min',
    five: '5min',
    fifteen: '15min',
    thirty: '30min',
    sixty: '60min',
  }
  
  constructor(private http: HttpClient) { }

  getStockSearch(query: string){
    return this.http.get(this.URL + 'function=SYMBOL_SEARCH'+'&keywords='+query+'&apikey='+this.alphaKey).pipe(
      map((response) => {
        let results;
        let bestMatches = response["bestMatches"] 
        results = Object.keys(bestMatches).filter((key) => {
          return bestMatches[key]
        }).map((key) => {
          return {
            symbol:  bestMatches[key]["1. symbol"],
            name: bestMatches[key]["2. name"]
          }
        })
        return results
      })
    )
  }

  getIntradayTimeSeriesData(symbol: string, interval: string){
    return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.INTRADAY+'&symbol='+symbol+'&interval='+interval+'&apikey='+this.alphaKey).pipe(
      map(res => {
        let timeseriesResponse = res[`Time Series (${interval})`]

        let chartOptions: CandlestickChartOptions = {
          chart: {
            type: "candlestick",
            height: 350
          },
          series: [],  
          title: {
            text: symbol +' '+interval,
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
          }
        }

        chartOptions.series['data'] = Object.keys(timeseriesResponse).filter((key) => {
          return timeseriesResponse[key]
        }).map((key) => {
          return {
            x: new Date( Date.parse(key) ) ,
            y: [
              parseFloat(timeseriesResponse[key]["1. open"]),
              parseFloat(timeseriesResponse[key]["2. high"]),
              parseFloat(timeseriesResponse[key]["3. low"]),
              parseFloat(timeseriesResponse[key]["4. close"]),
            ]

          }
        })
        console.log("chart options:", chartOptions)
        return chartOptions;
      })
    )
  }





}
