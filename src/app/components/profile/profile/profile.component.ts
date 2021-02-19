import { Component, OnInit } from '@angular/core';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  constructor(private alphaVantage: AlphaVantageService) 
    {
    }


  ngOnInit(): void {

  }

  getData(){
    this.alphaVantage.getIntradayTimeSeriesData('TSLA', '1min').subscribe((x) => console.log(x))
  }


}
