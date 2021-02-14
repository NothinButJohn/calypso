import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentSnapshot, QueryDocumentSnapshot} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { filter, map, startWith, tap, timestamp } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { message, MessagingService, messengerChatroom } from 'src/app/services/messaging.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { select, Store } from '@ngrx/store';
import { chatroomsSelector, selectedChatroomHistorySelector } from 'src/app/store/selectors/messaging.selectors';
import { getChatroomHistory, getChatrooms } from 'src/app/store/actions/messaging.actions';
export interface Message{
  sender: string;
  createdAt;
  text: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  // observables
  chatrooms$: Observable<messengerChatroom[]>
  selectedChatroomHistory$: Observable<message[]>
  // form groups and controls
  chatForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })
  searchForm = new FormGroup({
    searchUsers: new FormControl('')
  
  })

  constructor(
    private msg: MessagingService,
    public dialog: MatDialog,
    private store: Store
   ) 
    {

    }

  ngOnInit(): void {
    this.store.dispatch(getChatrooms());
    this.chatrooms$ = this.store.select(chatroomsSelector).pipe(
      tap((val) => console.log('val', val) )
    )
    this.selectedChatroomHistory$ = this.store.select(selectedChatroomHistorySelector).pipe(
      filter(d=>!!d),
      tap((v) => console.log("sc", v))
    )
  }

  ngOnDestroy() {

  }

  selectChatroom(docId: string) {
    this.store.dispatch(getChatroomHistory({docId}))

  }
}
