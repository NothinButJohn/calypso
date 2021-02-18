import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, } from 'rxjs';
import { filter, map, tap, withLatestFrom} from 'rxjs/operators';
import { message, MessagingService, messengerChatroom } from 'src/app/services/messaging.service';

import { select, Store } from '@ngrx/store';
import { chatroomsSelector, newChatMembers, selectedChatroomHistorySelector, getChatroomSelector } from 'src/app/store/selectors/messaging.selectors';
import { addMemberToNewChatroom, createNewChatroom, firstMessageNewChatroom, getChatroomHistory, getChatrooms, sendMessageToChatroom } from 'src/app/store/actions/messaging.actions';
import { usernameSelector } from 'src/app/store/selectors/profile.selectors';
import { NewMessageDialogComponent } from './new-message-dialog/new-message-dialog.component'
import * as firebase from 'firebase'
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  // observables
  chatrooms$: Observable<messengerChatroom[]>
  selectedChatroom$: Observable<any>
  selectedChatroomHistory$: Observable<message[]>
  currentUser$: Observable<string>
  newChatUsers$: Observable<string[]>
  // form groups and controls
  chatroomForm = new FormGroup({
    textInput: new FormControl('', Validators.required)
  })

  newChatroom = false;
  showControls = false;
  chatroomTitleEditing: boolean = false;

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
    this.newChatUsers$ = this.store.select(newChatMembers)

    
  }

  ngOnDestroy() {

  }
  editChatroomTitle(){
    this.chatroomTitleEditing = true;
  }

  selectChatroom(docId: string) {
    this.selectedChatroom$ = this.store.select(getChatroomSelector, {docId})
    this.store.dispatch(getChatroomHistory({docId}))
    this.newChatroom = false;
    this.showControls = true;
  }

  sendMessage(username: string){
    let newMessage: message = {
      text: this.chatroomForm.get('textInput').value,
      sender: username,
      createdAt: firebase.default.firestore.Timestamp.now()
    }
    if(this.newChatroom){
      this.store.dispatch(createNewChatroom({payload: newMessage}))
      this.newChatroom = false
      
    }else{
      this.store.dispatch(sendMessageToChatroom({payload:newMessage}))
    }
    this.store.dispatch(getChatrooms());
    this.chatroomForm.get('textInput').reset()
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewMessageDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.newChatroom = true;
        this.chatrooms$.pipe(
          withLatestFrom(this.store.select<string[]>(newChatMembers)),
          map(([chatrooms, newChatUsernames]) => {
            let matchCount=0;
            chatrooms.forEach((chatroom) => {
              newChatUsernames.forEach(newChatUsername => {
                if(chatroom.members.includes(newChatUsername)){
                  matchCount++;
                }else{
                  console.log('n')
                }
              })
              if(chatroom.members.length == matchCount){
                console.log(chatroom.docId)
                this.selectChatroom(chatroom.docId)
              }
              matchCount = 0
            })
          })
        ).subscribe()
      }
    });

  }
}
