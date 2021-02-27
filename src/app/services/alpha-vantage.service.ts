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
  ApexNoData,
  ApexStroke
} from "ng-apexcharts";
import { Observable, of, range, throwError } from 'rxjs';
import { COMPANY_OVERVIEW, DAILY_ADJUSTED, EMA, INTRADAY, MONTHLY_ADJUSTED, SMA, WEEKLY_ADJUSTED } from './mock-data/alphavantage.mock';

export type CandlestickChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  noData: ApexNoData;
  stroke: ApexStroke;
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

  simpleMovingAverage: Observable<any> = of(SMA)
  exponentialMovingAverage: Observable<any> = of(EMA)
  
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
    return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.INTRADAY+'&symbol='+symbol+'&interval='+interval+'&apikey='+this.alphaKey).pipe(

    // return this.intradayTimeSeries.pipe(
      map((res) => {
        if(res === undefined){
          throwError(new Error('Error in getIntradayTimeSeriesData()! response was undefined.'+res['Note']))
        }
        let timeseriesResponse = res[`Time Series (${interval})`]
        if(timeseriesResponse === undefined){
          throwError(new Error('Error in getIntradayTimeSeriesData()! response[`Time Series (${interval})`] was undefined.'+ res))
        }

        let seriesData = 
        {
            series: [
                {
                    name: 'candle',
                    type: 'candlestick',
                    data: []
                }],
                range: {}
        }
        console.log('api call, input:', symbol, interval, timeseriesResponse, res)
        seriesData.series[0]["data"] = Object.keys(timeseriesResponse).filter((key) => {
          return timeseriesResponse[key]
        }).map((key) => {
          return {
            x: new Date( Date.parse(key) ).toUTCString() ,
            y: [
              parseFloat(timeseriesResponse[key]["1. open"]),
              parseFloat(timeseriesResponse[key]["2. high"]),
              parseFloat(timeseriesResponse[key]["3. low"]),
              parseFloat(timeseriesResponse[key]["4. close"]),
            ]
          }
        })
        let lastIndex = seriesData.series[0]["data"].length-1
        seriesData.range = {end: seriesData.series[0]["data"][0].x, start: seriesData.series[0]["data"][lastIndex].x}
        console.log("getIntradayTimeSeriesData() api call, series data:", seriesData, 'range', seriesData.series[0]["data"][0].x, seriesData.series[0]["data"][lastIndex].x)
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
    
            let seriesData = {series: [{
                name: 'candle',
                type: 'candlestick',
                data: []}]
            }
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
    return this.http.get(this.URL+'function=OVERVIEW'+'&symbol='+symbol+'&apikey='+this.alphaKey).pipe(
      // return this.companyOverview.pipe(
          map((res) => {
              return res;
          })
      )
  }
  getTechnicalIndicatorData(technicalIndicator: string, symbol: string, interval: string, range){
    return this.http.get(this.URL+'function='+technicalIndicator+'&symbol='+symbol+'&interval='+interval+'&time_period=10&series_type=open'+'&apikey='+this.alphaKey).pipe(
      // let selectedIndicator: Observable<any>;
      // if (technicalIndicator == 'SMA') {
      //     selectedIndicator = this.simpleMovingAverage;
      // } else if (technicalIndicator == 'EMA') {
      //     selectedIndicator = this.exponentialMovingAverage;
      // }else{
      //   selectedIndicator = this.simpleMovingAverage
      // }
      // return selectedIndicator.pipe(
          map((res) => {
            let technicalAnalysisResponse = res[`Technical Analysis: ${technicalIndicator}`]
            if(res === undefined){
              throwError(new Error('Error in getTechnicalIndicatorData()! response was undefined.'+res['Note']))
            }
            if(technicalAnalysisResponse === undefined){
              throwError(new Error('Error in getTechnicalIndicatorData()! res[`Technical Analysis: ${technicalIndicator}`] was undefined.'+ res))
            }
            let technicalAnalysisData = 
            {
                series: [
                    {
                        name: `${technicalIndicator}`,
                        type: 'line',
                        data: []
                    }]
            }

            console.log('alpha-vantage api call::getTechnicalIndicatorData() symbol: ', symbol, 'response: ',res, 'timeseries: ', technicalAnalysisResponse)
            technicalAnalysisData.series[0]['data'] = Object.keys(technicalAnalysisResponse).filter((key) => {
              return technicalAnalysisResponse[key]
            }).map((key) => {
              return {
                x: new Date( Date.parse(key) ) ,
                y: parseFloat(technicalAnalysisResponse[key][`${technicalIndicator}`])
              }
            })

            let endIndex = technicalAnalysisData.series[0]['data'].findIndex((value) => {
                console.log('endIndex comparison', value.x, range.end)
                let endTime = new Date(Date.parse(range.end))
                return value.x.getTime() == endTime.getTime() })
            let startIndex = technicalAnalysisData.series[0]['data'].findIndex((value) => {
                console.log('startIndex comparison', value.x, range.start)
                let startTime = new Date(Date.parse(range.start))
                return value.x.getTime() == startTime.getTime() })


                console.log("endIndex match", endIndex, 'startIndex match', startIndex)
                technicalAnalysisData.series[0]['data'] = technicalAnalysisData.series[0]['data'].slice(endIndex, startIndex)
            console.log("Formatted getMonthlyAdjustedSeriesData() series data: open,high,low,close", technicalAnalysisData)
            return technicalAnalysisData;
          })
      )
  }

}


