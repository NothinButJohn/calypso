import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';
import { loadIntradayCandlestick, searchForStock, selectInterval, selectStock } from 'src/app/store/actions/alpha-vantage.actions';
import { companyOverviewSelector, intradayIntervalsSelector, selectedIntervalSelector, stocksSearchResultsSelector } from 'src/app/store/selectors/alpha-vantage.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  stockSearch$: Observable<any>
  filteredOptions: Observable<any>
  stockSelected$: Observable<any>
  stockSearchSubscription: Subscription

  selectedInterval$: Observable<string>
  intradayIntervals$: Observable<string[]>
  companyOverview$: Observable<any>



  stockSearch = new FormGroup({
    stockSearchInput: new FormControl(''),
    intradayIntervalSelection: new FormControl('')
  })
  

  constructor(private alphaVantage: AlphaVantageService,
    private store: Store) { }

  ngOnInit(): void {
    this.stockSearchSubscription = this.stockSearch.get('stockSearchInput').valueChanges.pipe(
      map((stockSearchQuery: string) => {
        console.log("search is empty", stockSearchQuery == '')
        if(stockSearchQuery == ''){

        }else if(stockSearchQuery.length >= 4){
          this.store.dispatch(searchForStock({query: stockSearchQuery}))
        }
        
      })
    ).subscribe()
    this.stockSearch$ = this.store.select(stocksSearchResultsSelector)
    this.selectedInterval$ = this.store.select(selectedIntervalSelector)
    this.intradayIntervals$ = this.store.select(intradayIntervalsSelector)
    this.companyOverview$ = this.store.select(companyOverviewSelector)
    // this.selectedInterval$.subscribe(x => console.log(x))
  }

  stockAutoSelection(event: MatAutocompleteSelectedEvent){
    let selection = event.option.value;
    this.store.dispatch(selectStock({selectedStock: selection}))
    this.store.dispatch(loadIntradayCandlestick())
    this.stockSearch.get('stockSearchInput').setValue('')

  }

  intervalSelected(){
    this.store.dispatch(selectInterval({ selectedInterval: this.stockSearch.get('intradayIntervalSelection').value }))
  }

  ngOnDestroy(): void {
    // this.stockSearchSubscription.unsubscribe()
  }
  

}
