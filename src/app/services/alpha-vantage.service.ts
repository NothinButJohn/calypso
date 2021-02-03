import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { pathToFileURL, Url } from 'url';

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
    one: '&interval=1min',
    five: '&interval=5min',
    fifteen: '&interval=15min',
    thirty: '&interval=30min',
    sixty: '&interval=60min',
  }

  
  constructor(private http: HttpClient) { }

  getTimeSeriesData(function_option, symbol, interval?){
    this.http.get(this.URL+function_option+'&symbol='+symbol+'&apikey='+this.alphaKey).pipe(
      map(res => {
        
      })
    )
  }



}
