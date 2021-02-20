import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';

@Component({
  selector: 'app-candlestick',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.scss']
})
export class CandlestickComponent implements OnInit {
  intradaySeriesData$: Observable<any>
  constructor(private alphaVantage: AlphaVantageService) { }

  ngOnInit(): void {
    this.getData()
  }
  getData(){
    this.intradaySeriesData$ = this.alphaVantage.getIntradayTimeSeriesData('TSLA', '5min').pipe(
      tap((res) => {
        console.log('listening: ', res.series.data)
      })
    )
  }
}
