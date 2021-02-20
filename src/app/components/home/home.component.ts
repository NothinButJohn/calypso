import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';
import { searchForStock, selectStock } from 'src/app/store/actions/alpha-vantage.actions';
import { stocksSearchResultsSelector } from 'src/app/store/selectors/alpha-vantage.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  stockSearch$: Observable<any>
  stockSelected$: Observable<any>
  stockSearchSubscription: Subscription



  stockSearch = new FormGroup({
    stockSearchInput: new FormControl('')
  })
  

  constructor(private alphaVantage: AlphaVantageService,
    private store: Store) { }

  ngOnInit(): void {
    this.stockSearchSubscription = this.stockSearch.get('stockSearchInput').valueChanges.pipe(
      filter(x => x !== ''),
      map((stockSearchQuery: string) => {
        this.store.dispatch(searchForStock({query: stockSearchQuery}))
      })
    ).subscribe()
    this.stockSearch$ = this.store.select(stocksSearchResultsSelector)
  }

  stockAutoSelection(event: MatAutocompleteSelectedEvent){
    let selection = event.option.value;
    this.store.dispatch(selectStock({selectedStock: selection}))

  }

  ngOnDestroy(): void {
    this.stockSearchSubscription.unsubscribe()
  }
  

}
