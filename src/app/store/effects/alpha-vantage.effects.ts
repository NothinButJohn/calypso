import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { AlphaVantageService } from "src/app/services/alpha-vantage.service";

import * as AlphaActions from '../actions/alpha-vantage.actions'
import { selectedIntervalSelector } from "../selectors/alpha-vantage.selectors";




@Injectable({
    providedIn: 'root'
})
export class AlphaVantageEffects {
    constructor(
        private actions$: Actions,
        private store: Store,
        private alphaVantage: AlphaVantageService
    ){}

    updateStockSearchResults$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AlphaActions.searchForStock),
            switchMap((action) => {
                return this.alphaVantage.getStockSearch(action.query).pipe(
                    map((searchResults) => {
                        return AlphaActions.searchForStockSuccess({results: searchResults})
                    })
                )
            })
        )
    })

    selectStock = createEffect(() => {
        return this.actions$.pipe(
            ofType(AlphaActions.selectStock),
            withLatestFrom(this.store.select(selectedIntervalSelector)),
            map( ([action, interval]) => {
                return AlphaActions.loadIntradayCandlestick({selectedStock: action.selectedStock, selectedInterval: interval})
            })
        )
    })

    loadIntradayCandlestickOptions = createEffect(() => {
        return this.actions$.pipe(
            ofType(AlphaActions.loadIntradayCandlestick),
            switchMap(action => {
                return this.alphaVantage.getIntradayTimeSeriesData(action.selectedStock.symbol, action.selectedInterval).pipe(
                    map((chartOptions) => {
                        return AlphaActions.loadIntradayCandlestickSuccess({chartOptions})
                    })
                )
            })
        )
    })
}