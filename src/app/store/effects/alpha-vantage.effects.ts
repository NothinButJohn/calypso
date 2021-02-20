import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs/operators";
import { AlphaVantageService } from "src/app/services/alpha-vantage.service";

import * as AlphaActions from '../actions/alpha-vantage.actions'




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
}