import { Component, OnInit, ViewChild } from '@angular/core';
import { AlphaVantageService, IntradayData } from 'src/app/services/alpha-vantage.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip
} from "ng-apexcharts";
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip
};
export type StockChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit { 

  @ViewChild("chart") chart: ChartComponent;
  public stockChartOptions: Partial<StockChartOptions>;
  public chartOptions: Partial<ChartOptions>;

  intradaySeriesData$: Observable<any>


  constructor(private alphaVantage: AlphaVantageService) 
    {
    }


  ngOnInit(): void {

  }

  getData(){
    this.intradaySeriesData$ = this.alphaVantage.getIntradayTimeSeriesData('TSLA', '1min').pipe(
      tap((res) => {
        console.log('listening: ', res.series.data)
      })
    )
  }


}
