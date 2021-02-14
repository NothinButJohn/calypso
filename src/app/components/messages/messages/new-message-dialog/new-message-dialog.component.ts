import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, startWith, switchMap, tap } from "rxjs/operators";
import { addMemberToNewChatroom, getAllUsernames } from "src/app/store/actions/messaging.actions";
import { allUsersSelector, newChatMembers } from "src/app/store/selectors/messaging.selectors";

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
    newChatMembers$: Observable<string[]>
    // newChatMembers$: Observable<string[]> = of<string[]>([])

    constructor(private store: Store) {

      }

      ngOnInit():void {
        this.store.dispatch(getAllUsernames())
        this.allUsers$ = this.store.select(allUsersSelector)
        this.allUsers$.subscribe()

        this.newChatMembers$ = this.store.select(newChatMembers)

        this.newChatMembers$.pipe(
            tap((v) => console.log('new mems',v))
        )

        this.filteredUsernames$ = this.newChatForm.valueChanges.pipe(
            startWith(null),
            switchMap((fruit) => fruit ? this._filter(fruit) : this.allUsers$.pipe(map((user) => user.slice()))))
      }
     
      add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        this.store.dispatch(addMemberToNewChatroom({ user: value }))

        // this.newChatMembers$.pipe(
        //     map(users => {
        //         users.push(value.trim())
        //         this.store.dispatch(addMemberToNewChatroom({ user: users }))
        //     })
        // )
    
        // *ngIf="( newChatMembers$ | async) as newChatMembers"
    
        // Reset the input value
        if (input) {
          input.value = '';
        }
    
        this.newChatForm.setValue(null);
      }
    
      remove(username: string): void {
        this.newChatMembers$.pipe(
            map(usernames => {
                let index = usernames.indexOf(username)
                if (index >= 0) {
                    usernames.splice(index, 1);
                  }
            })
        )
    

      }
    
      selected(event: MatAutocompleteSelectedEvent): void {
        this.store.dispatch(addMemberToNewChatroom({ user: event.option.viewValue }))
        // this.newChatMembers$.pipe(
        //     map(users => {
        //         users.push(event.option.viewValue)
        //         this.store.dispatch(addMemberToNewChatroom({ user: users }))
        //     })
        // )
        this.newChatForm.reset();
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