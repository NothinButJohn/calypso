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

  apiResponse: Observable<any> = of(dumbDataResponse)
  
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

    return this.apiResponse.pipe(
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





}

export const dumbDataResponse = {
  "Meta Data": {
      "1. Information": "Intraday (5min) open, high, low, close prices and volume",
      "2. Symbol": "tsla",
      "3. Last Refreshed": "2021-02-19 20:00:00",
      "4. Interval": "5min",
      "5. Output Size": "Compact",
      "6. Time Zone": "US/Eastern"
  },
  "Time Series (5min)": {
      "2021-02-19 20:00:00": {
          "1. open": "782.0300",
          "2. high": "782.5000",
          "3. low": "782.0101",
          "4. close": "782.5000",
          "5. volume": "8226"
      },
      "2021-02-19 19:55:00": {
          "1. open": "782.3000",
          "2. high": "782.3000",
          "3. low": "782.0000",
          "4. close": "782.1900",
          "5. volume": "4922"
      },
      "2021-02-19 19:50:00": {
          "1. open": "782.0000",
          "2. high": "782.2200",
          "3. low": "782.0000",
          "4. close": "782.2200",
          "5. volume": "1355"
      },
      "2021-02-19 19:45:00": {
          "1. open": "781.7600",
          "2. high": "782.3000",
          "3. low": "781.7500",
          "4. close": "782.0000",
          "5. volume": "3971"
      },
      "2021-02-19 19:40:00": {
          "1. open": "781.8000",
          "2. high": "781.8999",
          "3. low": "781.6900",
          "4. close": "781.7500",
          "5. volume": "1383"
      },
      "2021-02-19 19:35:00": {
          "1. open": "781.5800",
          "2. high": "781.8000",
          "3. low": "781.5800",
          "4. close": "781.8000",
          "5. volume": "2123"
      },
      "2021-02-19 19:30:00": {
          "1. open": "781.7999",
          "2. high": "781.7999",
          "3. low": "781.5700",
          "4. close": "781.5700",
          "5. volume": "432"
      },
      "2021-02-19 19:25:00": {
          "1. open": "781.4900",
          "2. high": "781.7700",
          "3. low": "781.4900",
          "4. close": "781.7700",
          "5. volume": "3079"
      },
      "2021-02-19 19:20:00": {
          "1. open": "781.5000",
          "2. high": "781.5000",
          "3. low": "781.3200",
          "4. close": "781.3300",
          "5. volume": "2658"
      },
      "2021-02-19 19:10:00": {
          "1. open": "781.2500",
          "2. high": "781.2500",
          "3. low": "781.2500",
          "4. close": "781.2500",
          "5. volume": "1342"
      },
      "2021-02-19 19:05:00": {
          "1. open": "781.3400",
          "2. high": "781.5000",
          "3. low": "781.1100",
          "4. close": "781.1100",
          "5. volume": "4358"
      },
      "2021-02-19 19:00:00": {
          "1. open": "781.3500",
          "2. high": "781.5000",
          "3. low": "781.1000",
          "4. close": "781.1000",
          "5. volume": "1312"
      },
      "2021-02-19 18:55:00": {
          "1. open": "781.3500",
          "2. high": "781.3500",
          "3. low": "781.3500",
          "4. close": "781.3500",
          "5. volume": "512"
      },
      "2021-02-19 18:45:00": {
          "1. open": "781.1500",
          "2. high": "781.2800",
          "3. low": "781.1500",
          "4. close": "781.2800",
          "5. volume": "1315"
      },
      "2021-02-19 18:40:00": {
          "1. open": "780.9500",
          "2. high": "781.2300",
          "3. low": "780.9500",
          "4. close": "781.1500",
          "5. volume": "3167"
      },
      "2021-02-19 18:35:00": {
          "1. open": "780.6100",
          "2. high": "780.6100",
          "3. low": "780.6100",
          "4. close": "780.6100",
          "5. volume": "462"
      },
      "2021-02-19 18:30:00": {
          "1. open": "780.7500",
          "2. high": "780.7500",
          "3. low": "780.6100",
          "4. close": "780.6100",
          "5. volume": "1548"
      },
      "2021-02-19 18:25:00": {
          "1. open": "781.0000",
          "2. high": "781.0000",
          "3. low": "780.6100",
          "4. close": "780.9699",
          "5. volume": "1359"
      },
      "2021-02-19 18:20:00": {
          "1. open": "780.9000",
          "2. high": "780.9900",
          "3. low": "780.9000",
          "4. close": "780.9900",
          "5. volume": "1028"
      },
      "2021-02-19 18:15:00": {
          "1. open": "780.9900",
          "2. high": "781.0000",
          "3. low": "780.6200",
          "4. close": "780.9000",
          "5. volume": "2081"
      },
      "2021-02-19 18:10:00": {
          "1. open": "780.5000",
          "2. high": "780.6500",
          "3. low": "780.5000",
          "4. close": "780.6500",
          "5. volume": "957"
      },
      "2021-02-19 18:05:00": {
          "1. open": "780.3000",
          "2. high": "780.3000",
          "3. low": "780.1501",
          "4. close": "780.3000",
          "5. volume": "1225"
      },
      "2021-02-19 18:00:00": {
          "1. open": "780.3000",
          "2. high": "780.3000",
          "3. low": "780.3000",
          "4. close": "780.3000",
          "5. volume": "1442"
      },
      "2021-02-19 17:55:00": {
          "1. open": "779.8500",
          "2. high": "780.1400",
          "3. low": "779.8500",
          "4. close": "780.1400",
          "5. volume": "926"
      },
      "2021-02-19 17:45:00": {
          "1. open": "779.5100",
          "2. high": "779.7000",
          "3. low": "779.5100",
          "4. close": "779.7000",
          "5. volume": "562"
      },
      "2021-02-19 17:40:00": {
          "1. open": "780.4899",
          "2. high": "780.4899",
          "3. low": "779.6300",
          "4. close": "779.6300",
          "5. volume": "1067"
      },
      "2021-02-19 17:35:00": {
          "1. open": "779.6000",
          "2. high": "779.6500",
          "3. low": "779.6000",
          "4. close": "779.6500",
          "5. volume": "673"
      },
      "2021-02-19 17:30:00": {
          "1. open": "780.0000",
          "2. high": "780.5599",
          "3. low": "780.0000",
          "4. close": "780.5599",
          "5. volume": "694"
      },
      "2021-02-19 17:25:00": {
          "1. open": "779.8600",
          "2. high": "780.0000",
          "3. low": "779.8600",
          "4. close": "780.0000",
          "5. volume": "8280"
      },
      "2021-02-19 17:20:00": {
          "1. open": "779.5000",
          "2. high": "779.5100",
          "3. low": "779.5000",
          "4. close": "779.5100",
          "5. volume": "1050"
      },
      "2021-02-19 17:15:00": {
          "1. open": "780.0000",
          "2. high": "780.0000",
          "3. low": "779.6300",
          "4. close": "779.6300",
          "5. volume": "1085"
      },
      "2021-02-19 17:10:00": {
          "1. open": "779.9000",
          "2. high": "779.9900",
          "3. low": "779.8900",
          "4. close": "779.9900",
          "5. volume": "3088"
      },
      "2021-02-19 17:05:00": {
          "1. open": "779.8500",
          "2. high": "781.3000",
          "3. low": "779.8500",
          "4. close": "779.9900",
          "5. volume": "7708"
      },
      "2021-02-19 17:00:00": {
          "1. open": "779.9500",
          "2. high": "780.0000",
          "3. low": "779.8200",
          "4. close": "779.8400",
          "5. volume": "6486"
      },
      "2021-02-19 16:55:00": {
          "1. open": "779.8700",
          "2. high": "779.9700",
          "3. low": "779.7800",
          "4. close": "779.9500",
          "5. volume": "11586"
      },
      "2021-02-19 16:50:00": {
          "1. open": "779.9000",
          "2. high": "779.9000",
          "3. low": "779.8700",
          "4. close": "779.8700",
          "5. volume": "1146"
      },
      "2021-02-19 16:45:00": {
          "1. open": "780.0400",
          "2. high": "781.3000",
          "3. low": "779.9900",
          "4. close": "780.0000",
          "5. volume": "3971"
      },
      "2021-02-19 16:40:00": {
          "1. open": "780.0000",
          "2. high": "781.3000",
          "3. low": "779.9900",
          "4. close": "780.0000",
          "5. volume": "14903"
      },
      "2021-02-19 16:35:00": {
          "1. open": "780.0000",
          "2. high": "780.1000",
          "3. low": "779.9200",
          "4. close": "780.1000",
          "5. volume": "6497"
      },
      "2021-02-19 16:30:00": {
          "1. open": "779.9800",
          "2. high": "779.9800",
          "3. low": "779.9000",
          "4. close": "779.9800",
          "5. volume": "6767"
      },
      "2021-02-19 16:25:00": {
          "1. open": "779.9900",
          "2. high": "779.9900",
          "3. low": "779.9000",
          "4. close": "779.9700",
          "5. volume": "4226"
      },
      "2021-02-19 16:20:00": {
          "1. open": "780.0000",
          "2. high": "781.3000",
          "3. low": "779.8600",
          "4. close": "779.8600",
          "5. volume": "7288"
      },
      "2021-02-19 16:15:00": {
          "1. open": "779.9000",
          "2. high": "780.1700",
          "3. low": "779.8400",
          "4. close": "779.8400",
          "5. volume": "9963"
      },
      "2021-02-19 16:10:00": {
          "1. open": "780.0000",
          "2. high": "781.3000",
          "3. low": "779.8600",
          "4. close": "780.0700",
          "5. volume": "12327"
      },
      "2021-02-19 16:05:00": {
          "1. open": "781.3000",
          "2. high": "781.3000",
          "3. low": "779.7500",
          "4. close": "780.0000",
          "5. volume": "143264"
      },
      "2021-02-19 16:00:00": {
          "1. open": "780.8500",
          "2. high": "781.5400",
          "3. low": "779.7600",
          "4. close": "781.5000",
          "5. volume": "611622"
      },
      "2021-02-19 15:55:00": {
          "1. open": "779.5100",
          "2. high": "781.9700",
          "3. low": "779.3900",
          "4. close": "780.8160",
          "5. volume": "393097"
      },
      "2021-02-19 15:50:00": {
          "1. open": "778.3400",
          "2. high": "780.3100",
          "3. low": "778.2707",
          "4. close": "779.6400",
          "5. volume": "324890"
      },
      "2021-02-19 15:45:00": {
          "1. open": "780.0100",
          "2. high": "780.1200",
          "3. low": "778.1900",
          "4. close": "778.2700",
          "5. volume": "192576"
      },
      "2021-02-19 15:40:00": {
          "1. open": "778.5701",
          "2. high": "780.0200",
          "3. low": "778.2035",
          "4. close": "779.9450",
          "5. volume": "169356"
      },
      "2021-02-19 15:35:00": {
          "1. open": "777.8250",
          "2. high": "779.5400",
          "3. low": "777.5600",
          "4. close": "778.5996",
          "5. volume": "221613"
      },
      "2021-02-19 15:30:00": {
          "1. open": "778.1670",
          "2. high": "778.7700",
          "3. low": "777.3700",
          "4. close": "777.8300",
          "5. volume": "197875"
      },
      "2021-02-19 15:25:00": {
          "1. open": "779.8200",
          "2. high": "779.9500",
          "3. low": "778.1000",
          "4. close": "778.1100",
          "5. volume": "196943"
      },
      "2021-02-19 15:20:00": {
          "1. open": "780.5000",
          "2. high": "780.6400",
          "3. low": "779.3700",
          "4. close": "779.7650",
          "5. volume": "153823"
      },
      "2021-02-19 15:15:00": {
          "1. open": "780.0564",
          "2. high": "781.7100",
          "3. low": "780.0500",
          "4. close": "780.6000",
          "5. volume": "113416"
      },
      "2021-02-19 15:10:00": {
          "1. open": "781.6800",
          "2. high": "781.6900",
          "3. low": "780.0500",
          "4. close": "780.0800",
          "5. volume": "104046"
      },
      "2021-02-19 15:05:00": {
          "1. open": "781.3900",
          "2. high": "783.0000",
          "3. low": "781.3800",
          "4. close": "781.6450",
          "5. volume": "147861"
      },
      "2021-02-19 15:00:00": {
          "1. open": "779.7100",
          "2. high": "781.6100",
          "3. low": "779.7100",
          "4. close": "781.4500",
          "5. volume": "142630"
      },
      "2021-02-19 14:55:00": {
          "1. open": "780.5800",
          "2. high": "780.6700",
          "3. low": "779.5001",
          "4. close": "779.9900",
          "5. volume": "139838"
      },
      "2021-02-19 14:50:00": {
          "1. open": "779.9600",
          "2. high": "781.6900",
          "3. low": "779.7600",
          "4. close": "780.4700",
          "5. volume": "183275"
      },
      "2021-02-19 14:45:00": {
          "1. open": "779.4750",
          "2. high": "780.7000",
          "3. low": "778.6700",
          "4. close": "780.0400",
          "5. volume": "156408"
      },
      "2021-02-19 14:40:00": {
          "1. open": "778.8100",
          "2. high": "779.6500",
          "3. low": "778.0106",
          "4. close": "779.5799",
          "5. volume": "287525"
      },
      "2021-02-19 14:35:00": {
          "1. open": "780.0150",
          "2. high": "780.8500",
          "3. low": "778.8000",
          "4. close": "778.9300",
          "5. volume": "240209"
      },
      "2021-02-19 14:30:00": {
          "1. open": "780.6223",
          "2. high": "781.1500",
          "3. low": "779.6800",
          "4. close": "780.0000",
          "5. volume": "158528"
      },
      "2021-02-19 14:25:00": {
          "1. open": "781.7800",
          "2. high": "781.9600",
          "3. low": "780.0326",
          "4. close": "780.7079",
          "5. volume": "125823"
      },
      "2021-02-19 14:20:00": {
          "1. open": "781.7070",
          "2. high": "782.8200",
          "3. low": "781.0100",
          "4. close": "781.9000",
          "5. volume": "189841"
      },
      "2021-02-19 14:15:00": {
          "1. open": "782.5800",
          "2. high": "783.1180",
          "3. low": "781.3300",
          "4. close": "781.5000",
          "5. volume": "121543"
      },
      "2021-02-19 14:10:00": {
          "1. open": "783.4000",
          "2. high": "784.9500",
          "3. low": "782.2000",
          "4. close": "782.4900",
          "5. volume": "148225"
      },
      "2021-02-19 14:05:00": {
          "1. open": "784.3300",
          "2. high": "784.7000",
          "3. low": "783.2200",
          "4. close": "783.3317",
          "5. volume": "114177"
      },
      "2021-02-19 14:00:00": {
          "1. open": "783.5000",
          "2. high": "784.7933",
          "3. low": "783.1001",
          "4. close": "784.4687",
          "5. volume": "127144"
      },
      "2021-02-19 13:55:00": {
          "1. open": "783.2700",
          "2. high": "783.8900",
          "3. low": "782.0000",
          "4. close": "783.6499",
          "5. volume": "127039"
      },
      "2021-02-19 13:50:00": {
          "1. open": "783.6100",
          "2. high": "783.8099",
          "3. low": "782.4900",
          "4. close": "783.2300",
          "5. volume": "131957"
      },
      "2021-02-19 13:45:00": {
          "1. open": "784.3000",
          "2. high": "784.9999",
          "3. low": "783.2545",
          "4. close": "783.5200",
          "5. volume": "215687"
      },
      "2021-02-19 13:40:00": {
          "1. open": "781.5000",
          "2. high": "784.6950",
          "3. low": "781.1800",
          "4. close": "784.3600",
          "5. volume": "229614"
      },
      "2021-02-19 13:35:00": {
          "1. open": "782.1800",
          "2. high": "782.2950",
          "3. low": "780.0900",
          "4. close": "781.3401",
          "5. volume": "111474"
      },
      "2021-02-19 13:30:00": {
          "1. open": "781.6400",
          "2. high": "783.3299",
          "3. low": "781.4700",
          "4. close": "782.1001",
          "5. volume": "172080"
      },
      "2021-02-19 13:25:00": {
          "1. open": "779.6900",
          "2. high": "781.8100",
          "3. low": "779.3300",
          "4. close": "781.7376",
          "5. volume": "168361"
      },
      "2021-02-19 13:20:00": {
          "1. open": "781.1500",
          "2. high": "781.8900",
          "3. low": "779.6901",
          "4. close": "779.6901",
          "5. volume": "117150"
      },
      "2021-02-19 13:15:00": {
          "1. open": "779.0400",
          "2. high": "782.2700",
          "3. low": "778.7800",
          "4. close": "781.2300",
          "5. volume": "158725"
      },
      "2021-02-19 13:10:00": {
          "1. open": "781.8200",
          "2. high": "782.5000",
          "3. low": "779.0333",
          "4. close": "779.1500",
          "5. volume": "188252"
      },
      "2021-02-19 13:05:00": {
          "1. open": "781.2200",
          "2. high": "782.4500",
          "3. low": "780.5700",
          "4. close": "782.0799",
          "5. volume": "167326"
      },
      "2021-02-19 13:00:00": {
          "1. open": "779.1200",
          "2. high": "781.7455",
          "3. low": "779.0150",
          "4. close": "781.4365",
          "5. volume": "278897"
      },
      "2021-02-19 12:55:00": {
          "1. open": "780.6610",
          "2. high": "782.1199",
          "3. low": "778.5300",
          "4. close": "778.9100",
          "5. volume": "377844"
      },
      "2021-02-19 12:50:00": {
          "1. open": "782.4350",
          "2. high": "783.5000",
          "3. low": "780.5709",
          "4. close": "780.6000",
          "5. volume": "216233"
      },
      "2021-02-19 12:45:00": {
          "1. open": "782.1500",
          "2. high": "783.1010",
          "3. low": "780.2600",
          "4. close": "782.6000",
          "5. volume": "326029"
      },
      "2021-02-19 12:40:00": {
          "1. open": "783.1000",
          "2. high": "783.9800",
          "3. low": "781.7500",
          "4. close": "782.6100",
          "5. volume": "222745"
      },
      "2021-02-19 12:35:00": {
          "1. open": "784.2700",
          "2. high": "785.4999",
          "3. low": "782.8800",
          "4. close": "782.8800",
          "5. volume": "217455"
      },
      "2021-02-19 12:30:00": {
          "1. open": "785.2500",
          "2. high": "785.6296",
          "3. low": "783.5700",
          "4. close": "784.5000",
          "5. volume": "350511"
      },
      "2021-02-19 12:25:00": {
          "1. open": "786.1200",
          "2. high": "786.6499",
          "3. low": "785.2200",
          "4. close": "785.3700",
          "5. volume": "263290"
      },
      "2021-02-19 12:20:00": {
          "1. open": "787.8900",
          "2. high": "788.9900",
          "3. low": "786.0900",
          "4. close": "786.1200",
          "5. volume": "231373"
      },
      "2021-02-19 12:15:00": {
          "1. open": "786.9450",
          "2. high": "788.6800",
          "3. low": "786.7400",
          "4. close": "787.7615",
          "5. volume": "220043"
      },
      "2021-02-19 12:10:00": {
          "1. open": "787.4499",
          "2. high": "788.1500",
          "3. low": "786.0000",
          "4. close": "786.7950",
          "5. volume": "235225"
      },
      "2021-02-19 12:05:00": {
          "1. open": "787.7100",
          "2. high": "788.3800",
          "3. low": "786.0000",
          "4. close": "787.4400",
          "5. volume": "358956"
      },
      "2021-02-19 12:00:00": {
          "1. open": "789.5400",
          "2. high": "790.1200",
          "3. low": "787.6700",
          "4. close": "787.8800",
          "5. volume": "273236"
      },
      "2021-02-19 11:55:00": {
          "1. open": "791.3873",
          "2. high": "791.6350",
          "3. low": "789.5000",
          "4. close": "789.5000",
          "5. volume": "183584"
      },
      "2021-02-19 11:50:00": {
          "1. open": "793.0200",
          "2. high": "793.1753",
          "3. low": "791.0700",
          "4. close": "791.6000",
          "5. volume": "167718"
      },
      "2021-02-19 11:45:00": {
          "1. open": "794.2399",
          "2. high": "794.2399",
          "3. low": "792.0400",
          "4. close": "792.9900",
          "5. volume": "269011"
      },
      "2021-02-19 11:40:00": {
          "1. open": "790.4800",
          "2. high": "794.3299",
          "3. low": "790.2777",
          "4. close": "794.2100",
          "5. volume": "407742"
      },
      "2021-02-19 11:35:00": {
          "1. open": "790.7806",
          "2. high": "790.8599",
          "3. low": "789.2500",
          "4. close": "790.4100",
          "5. volume": "138009"
      },
      "2021-02-19 11:30:00": {
          "1. open": "789.6100",
          "2. high": "791.2300",
          "3. low": "789.6012",
          "4. close": "790.7800",
          "5. volume": "173604"
      }
  }
}
