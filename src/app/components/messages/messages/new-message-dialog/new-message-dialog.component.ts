import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
import { getAllUsernames } from "src/app/store/actions/messaging.actions";
import { allUsersSelector } from "src/app/store/selectors/messaging.selectors";

@Component({
    selector: 'new-message-dialog',
    templateUrl: 'new-message-dialog.component.html',
  })
  export class NewMessageDialogComponent implements OnInit {
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    filteredUsernames$: Observable<string[]>;
    allUsers$: Observable<string[]>
    newChatForm = new FormControl('')
    newChatmembers$: Observable<string[]>

    constructor(private store: Store) {

      }

      ngOnInit():void {
        this.store.dispatch(getAllUsernames())
        this.allUsers$ = this.store.select(allUsersSelector)
        this.allUsers$.subscribe()

        this.filteredUsernames$ = this.newChatForm.valueChanges.pipe(
            startWith(null),
            switchMap((fruit) => fruit ? this._filter(fruit) : this.allUsers$.pipe(map((user) => user.slice()))))
      }
     
      add(event: MatChipInputEvent): void {
    //     const input = event.input;
    //     const value = event.value;
    
    //     // Add our fruit
    //     if ((value || '').trim()) {
    //       this.fruits.push(value.trim());
    //     }
    
    //     // Reset the input value
    //     if (input) {
    //       input.value = '';
        }
    
    //     this.newChatForm.setValue(null);
    //   }
    
      remove(fruit: string): void {
    //     const index = this.fruits.indexOf(fruit);
    
    //     if (index >= 0) {
    //       this.fruits.splice(index, 1);
    //     }
      }
    
      selected(event: MatAutocompleteSelectedEvent): void {
    //     this.fruits.push(event.option.viewValue);
    //     this.fruitInput.nativeElement.value = '';
    //     this.newChatForm.setValue(null);
      }
    
      private _filter(value: string) {
        const filterValue = value.toLowerCase();
        console.log(filterValue)
        return this.allUsers$.pipe(
            map(array => {
                console.log(array); 
                return array.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0)})
            )
      }
  }