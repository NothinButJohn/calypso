import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlphaVantageService, CandlestickChartOptions } from 'src/app/services/alpha-vantage.service';
import { candlestickChartOptionsSelector } from 'src/app/store/selectors/alpha-vantage.selectors';

@Component({
  selector: 'app-candlestick',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.scss']
})
export class CandlestickComponent implements OnInit {
  intradaySeriesData$: Observable<CandlestickChartOptions>

  
  options: CandlestickChartOptions = {
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
  
  constructor(private alphaVantage: AlphaVantageService,
    private store: Store) { }

  ngOnInit(): void {
    // this.intradaySeriesData$ = of(this.options)
    
    this.intradaySeriesData$ = this.store.select(candlestickChartOptionsSelector).pipe(
      tap(x => console.log(x))
    )
    // this.getData()
  }
  getData(){
    this.intradaySeriesData$ = this.alphaVantage.getIntradayTimeSeriesData('TSLA', '5min').pipe(
      tap((res) => {
        console.log('listening: ', res)
      })
    )
  }
}
