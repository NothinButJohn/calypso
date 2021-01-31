import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { map, tap, timestamp } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { MessagingService } from 'src/app/services/messaging.service';

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
export class MessagesComponent implements OnInit {
  public chats$: Observable<unknown>
  public chatHistory$: Observable<any[]>
  public query;
  public currUsername: string;
  private selectedChat

  chatForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })

  constructor(
    private msg: MessagingService,
    private fa: FireAuthService
   ) 
    {

    }

  ngOnInit(): void {
    this.query = this.msg.getChats();
    this.fa.authUserDoc.get().pipe(
      map(d => {
        this.currUsername = d.data().profile.username
      })
    ).subscribe();
  }

  chatSelected(chat: QueryDocumentSnapshot<unknown>) {
    // console.log(chat)
    this.selectedChat = chat;
    this.chatHistory$ = this.msg.getMessageHistory(chat.id)
  }

  sendMessage(){
    let msg: Message = {
      sender: this.currUsername,
      text: this.chatForm.get('text').value,
      createdAt: timestamp().toString()
    }
    console.log(msg)
    this.msg.sendMessage(this.selectedChat.id, msg)
  }



}
