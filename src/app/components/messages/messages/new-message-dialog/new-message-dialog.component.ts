import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, startWith, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { addMemberToNewChatroom, getAllUsernames, removeMemberFromNewChatroom } from "src/app/store/actions/messaging.actions";
import { allUsersSelector, newChatMembers } from "src/app/store/selectors/messaging.selectors";
import { usernameSelector } from 'src/app/store/selectors/profile.selectors';

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
    creationDisabled = true

    constructor(private store: Store) {

      }

      ngOnInit():void {
        this.store.dispatch(getAllUsernames())
        this.allUsers$ = this.store.select(allUsersSelector)
        this.allUsers$.subscribe()

        this.newChatMembers$ = this.store.select(newChatMembers)

        this.newChatMembers$.pipe(
            tap((v) => console.log('newChatMembers: ',v)),
            map((newChatMembers) => {
                if(newChatMembers.length > 0){
                    this.creationDisabled = false
                    console.log('false', newChatMembers.length, this.creationDisabled)
                } else {
                    true
                }
            })
        ).subscribe()

        this.filteredUsernames$ = this.newChatForm.valueChanges.pipe(
            startWith(null),
            switchMap((username) => username ? this._filter(username) : this.allUsers$.pipe(map((user) => user.slice()))),
            withLatestFrom(this.newChatMembers$),
            map(([filtered, newChat]) => {
              // let newFilter = filtered
              console.log('filter', filtered, newChat)
              newChat.forEach((newChatUser) => { filtered = filtered.filter((fuser) => fuser !== newChatUser)})
              return filtered
            })
            
            )
      }
     
      add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        this.store.dispatch(addMemberToNewChatroom({ member: value.trim() }))

        if (input) {
          input.value = '';
        }
    
        this.newChatForm.setValue(null);
      }
    
      remove(username: string): void {
        this.store.dispatch(removeMemberFromNewChatroom({ member: username }))
      }
    
      selected(event: MatAutocompleteSelectedEvent): void {
        this.store.dispatch(addMemberToNewChatroom({ member: event.option.viewValue }))
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

      create(){
        this.newChatMembers$.pipe(
          withLatestFrom(this.store.select(usernameSelector)),
          map(([mem, user]) =>{
            if(!mem.includes(user)){
              this.store.dispatch(addMemberToNewChatroom({member: user}))
            }
           
          })
        ).subscribe()

      }
  }