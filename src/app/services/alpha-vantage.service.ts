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
  ApexTooltip
} from "ng-apexcharts";

export type CandlestickChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip
};

// export interface IntradayData {
//   metaData: {
//     symbol: string,
//     interval: string
//   },
//   timeseries?: 
//     {
//       'time': string,
//       'open': number,
//       'high': number,
//       'low': number,
//       'close': number,
//       'volume': number
//     }[]
// }

// The xy format accepts [{ x: date, y: [O,H,L,C] }].
// You can also pass timestamp in the x property instead of a date String
export interface IntradayData {
  series: [
    // name: string,
    data?: {
      x: Date,
      y: [o: number, h: number, l: number, c: number]
    }[]
  ]
}

export class intradata implements IntradayData {
  series
  constructor(){
    this.series = []
  }
}

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
  // INTERVAL = {
  //   one: '&interval=1min',
  //   five: '&interval=5min',
  //   fifteen: '&interval=15min',
  //   thirty: '&interval=30min',
  //   sixty: '&interval=60min',
  // }

  
  constructor(private http: HttpClient) { }

  getTimeSeriesData(function_option, symbol, interval?){
    this.http.get(this.URL+function_option+'&symbol='+symbol+'&apikey='+this.alphaKey).pipe(
      map(res => {
        
      })
    )
  }
  // getIntradayTimeSeriesData(symbol: string, interval: string){
  //   return this.http.get(this.URL+this.FUNCTIONS.TIME_SERIES.INTRADAY+'&symbol='+symbol+'&interval='+interval+'&apikey='+this.alphaKey).pipe(
  //     map(res => {
  //       let timeseriesResponse = res[`Time Series (${interval})`]
  //       // console.log(timeseriesResponse)
  //       let data: IntradayData;
  //       data = {
  //         "metaData": {
  //         symbol,
  //         interval
  //       }
  //     }
  //       data.timeseries = Object.keys(timeseriesResponse).filter((key) => {
  //         return timeseriesResponse[key]
  //       }).map((key) => {
  //         return {
  //           'time': key,
  //           'open': parseInt(timeseriesResponse[key]["1. open"]),
  //           'high': parseInt(timeseriesResponse[key]["2. high"]),
  //           'low': parseInt(timeseriesResponse[key]["3. low"]),
  //           'close': parseInt(timeseriesResponse[key]["4. close"]),
  //           'volume': parseInt(timeseriesResponse[key]["5. volume"])
  //         }
  //       })
  //       return data;
  //     })
  //   )
  // }
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
            text: "CandleStick Chart",
            align: "left"
          },
          xaxis: {
            type: "datetime"
          },
          yaxis: {
            // tooltip: {
            //   enabled: true,
              
            // }
          },
          tooltip: {
            enabled: true,
            custom: function({ seriesIndex, dataPointIndex, w }) {
              const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
              const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
              const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
              const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
              return (
                '<div class="apexcharts-tooltip-candlestick">' +
                '<div>Open: <span class="value">' +
                o +
                '</span></div>' +
                '<div>High: <span class="value">' +
                h +
                '</span></div>' +
                '<div>Low: <span class="value">' +
                l +
                '</span></div>' +
                '<div>Close: <span class="value">' +
                c +
                '</span></div>' +
                '</div>'
              )
            }
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
