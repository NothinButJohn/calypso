import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, } from 'rxjs';
import { filter, tap} from 'rxjs/operators';
import { message, MessagingService, messengerChatroom } from 'src/app/services/messaging.service';

import { select, Store } from '@ngrx/store';
import { chatroomsSelector, selectedChatroomHistorySelector } from 'src/app/store/selectors/messaging.selectors';
import { getChatroomHistory, getChatrooms, sendMessageToChatroom } from 'src/app/store/actions/messaging.actions';
import { usernameSelector } from 'src/app/store/selectors/profile.selectors';
import { MessagingEffects } from 'src/app/store/effects/messaging.effects';
import * as firebase from 'firebase'
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  // observables
  chatrooms$: Observable<messengerChatroom[]>
  selectedChatroomHistory$: Observable<message[]>
  currentUser$: Observable<string>
  // form groups and controls
  chatroomForm = new FormGroup({
    textInput: new FormControl('', Validators.required)
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
    this.currentUser$ = this.store.select(usernameSelector)
    this.selectedChatroomHistory$ = this.store.select(selectedChatroomHistorySelector).pipe(
      filter(d=>!!d[0]),
      tap((v) => console.log("sc", v))
    )


  }

  ngOnDestroy() {

  }

  selectChatroom(docId: string) {
    this.store.dispatch(getChatroomHistory({docId}))
  }

  sendMessage(username: string){
    let newMessage: message = {
      text: this.chatroomForm.get('textInput').value,
      sender: username,
      createdAt: firebase.default.firestore.Timestamp.now()
    }
    this.store.dispatch(sendMessageToChatroom({payload:newMessage}))
    this.chatroomForm.get('textInput').reset()
    
  }
}
