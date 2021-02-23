import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { AlphaVantageService } from "src/app/services/alpha-vantage.service";

import * as AlphaActions from '../actions/alpha-vantage.actions'
import { selectedIntervalSelector, selectedStockSelector } from "../selectors/alpha-vantage.selectors";




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
            // , catchError((error)=> 
            // of( AlphaActions.searchForStockFail({error}))
            // )
        )
    })

    loadCompanyOverview$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AlphaActions.selectStock),
            switchMap(action => {
                return this.alphaVantage.getCompanyOverview(action.selectedStock.symbol).pipe(
                    map((companyOverview) => {
                        return AlphaActions.loadCompanyOverviewSuccess({ companyOverview })
                    })
                )
            })
        )
    })

    loadIntradayCandlestickSeriesData$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AlphaActions.selectStock),
            withLatestFrom(this.store.select(selectedIntervalSelector)),
            switchMap(([action, interval]) => {
                return this.alphaVantage.getIntradayTimeSeriesData(action.selectedStock.symbol, interval).pipe(
                    map((chartOptions) => {
                        return AlphaActions.loadIntradayCandlestickSuccess({chartOptions})
                    })
                )
            })
            // , catchError((error)=> 
            //     of( AlphaActions.loadIntradayCandlestickFail({error}))
                
            // )
        )
    })

    loadIntradayCandlestickDataWithNewInterval$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AlphaActions.selectInterval),
            withLatestFrom(this.store.select(selectedStockSelector)),
            switchMap(([action, stock]) => {
                return this.alphaVantage.getIntradayTimeSeriesData(stock.symbol, action.selectedInterval).pipe(
                    map((chartOptions) => {
                        return AlphaActions.loadIntradayCandlestickSuccess({chartOptions})
                    })
                )
            })

        )
    })
}