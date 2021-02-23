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
  ApexTheme,
  ApexNoData
} from "ng-apexcharts";
import { Observable, of, throwError } from 'rxjs';
import { COMPANY_OVERVIEW, DAILY_ADJUSTED, INTRADAY, MONTHLY_ADJUSTED, WEEKLY_ADJUSTED } from './mock-data/alphavantage.mock';

export type CandlestickChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  noData: ApexNoData;
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

  intradayTimeSeries: Observable<any> = of(INTRADAY)
  monthlyAdjustedTimeSeries: Observable<any> = of(MONTHLY_ADJUSTED)
  weeklyAdjustedTimeSeries: Observable<any> = of(WEEKLY_ADJUSTED)
  dailyAdjustedTimeSeries: Observable<any> = of(DAILY_ADJUSTED)
  companyOverview: Observable<any> = of(COMPANY_OVERVIEW)
  
  constructor(private http: HttpClient) { }

  getStockSearch(query: string){
    return this.http.get(this.URL + 'function=SYMBOL_SEARCH'+'&keywords='+query+'&apikey='+this.alphaKey).pipe(
      map((response) => {
        if(response == undefined){
          throwError(new Error('Error in getIntradayTimeSeriesData()! response was undefined.'+response['Note']))
        }
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
    // return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.INTRADAY+'&symbol='+symbol+'&interval='+interval+'&apikey='+this.alphaKey).pipe(

    return this.intradayTimeSeries.pipe(
      map((res) => {
        if(res === undefined){
          throwError(new Error('Error in getIntradayTimeSeriesData()! response was undefined.'+res['Note']))
        }
        let timeseriesResponse = res[`Time Series (${interval})`]
        if(timeseriesResponse === undefined){
          throwError(new Error('Error in getIntradayTimeSeriesData()! response[`Time Series (${interval})`] was undefined.'+ res))
        }

        let seriesData = {series: [{data: []}]}
        console.log('api call, input:', symbol, interval, timeseriesResponse, res)
        seriesData.series['data'] = Object.keys(timeseriesResponse).filter((key) => {
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
        console.log("series data:", seriesData)
        return seriesData;
      })
    )
  }

  getDailyAdjustedSeriesData(symbol: string){
    // return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.ADJUSTED+'&symbol='+symbol+'&apikey='+this.alphaKey).pipe(
      return this.dailyAdjustedTimeSeries.pipe(
        map((res) => {
            if(res === undefined){
              throwError(new Error('Error in getDailyAdjustedSeriesData()! response was undefined.'+res['Note']))
            }
            let timeseriesResponse = res[`Time Series (Daily)`]
            if(timeseriesResponse === undefined){
              throwError(new Error('Error in getDailyAdjustedSeriesData()! response[`Time Series (Daily)`] was undefined.'+ res))
            }
    
            let seriesData = {series: [{data: []}]}
            console.log('alpha-vantage api call::getDailyAdjustedSeriesData() symbol: ', symbol, 'response: ',res, 'timeseries: ', timeseriesResponse)
            seriesData.series['data'] = Object.keys(timeseriesResponse).filter((key) => {
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
            console.log("Formatted getDailyAdjustedSeriesData() series data: open,high,low,close", seriesData)
            return seriesData;
          })
      )
  }
  getWeeklyAdjustedSeriesData(symbol: string){
    // return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.WKLY_ADJUSTED+'&symbol='+symbol+'&apikey='+this.alphaKey).pipe(
      return this.weeklyAdjustedTimeSeries.pipe(
        map((res) => {
            if(res === undefined){
              throwError(new Error('Error in getWeeklyAdjustedSeriesData()! response was undefined.'+res['Note']))
            }
            let timeseriesResponse = res[`Time Series (Weekly)`]
            if(timeseriesResponse === undefined){
              throwError(new Error('Error in getWeeklyAdjustedSeriesData()! response[`Time Series (Weekly)`] was undefined.'+ res))
            }
    
            let seriesData = {series: [{data: []}]}
            console.log('alpha-vantage api call::getWeeklyAdjustedSeriesData() symbol: ', symbol, 'response: ',res, 'timeseries: ', timeseriesResponse)
            seriesData.series['data'] = Object.keys(timeseriesResponse).filter((key) => {
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
            console.log("Formatted getWeeklyAdjustedSeriesData() series data: open,high,low,close", seriesData)
            return seriesData;
          })
      )
  }
  getMonthlyAdjustedSeriesData(symbol: string){
    // return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.MNTHLY_ADJUSTED+'&symbol='+symbol+'&apikey='+this.alphaKey).pipe(
      return this.monthlyAdjustedTimeSeries.pipe(
        map((res) => {
            if(res === undefined){
              throwError(new Error('Error in getMonthlyAdjustedSeriesData()! response was undefined.'+res['Note']))
            }
            let timeseriesResponse = res[`Time Series (Monthly)`]
            if(timeseriesResponse === undefined){
              throwError(new Error('Error in getMonthlyAdjustedSeriesData()! response[`Time Series (Monthly)`] was undefined.'+ res))
            }
    
            let seriesData = {series: [{data: []}]}
            console.log('alpha-vantage api call::getMonthlyAdjustedSeriesData() symbol: ', symbol, 'response: ',res, 'timeseries: ', timeseriesResponse)
            seriesData.series['data'] = Object.keys(timeseriesResponse).filter((key) => {
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
            console.log("Formatted getMonthlyAdjustedSeriesData() series data: open,high,low,close", seriesData)
            return seriesData;
          })
      )
  }

  getCompanyOverview(symbol: string){
      return this.companyOverview.pipe(
          map((res) => {
              return res;
          })
      )
  }

}


