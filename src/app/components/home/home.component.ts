import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stockSearch$: Observable<any>

  stockSearch = new FormGroup({
    stockSearchInput: new FormControl('')
  })
  

  constructor(private alphaVantage: AlphaVantageService) { }

  ngOnInit(): void {
    this.stockSearch.get('stockSearchInput').valueChanges.pipe(
      map((input) => {
        this.stockSearch$ = this.alphaVantage.getStockSearch(input)
        this.stockSearch$.subscribe()
      })
    ).subscribe()
    
  }

  

}
