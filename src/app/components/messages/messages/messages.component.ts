import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { MessagingService } from 'src/app/services/messaging.service';

export interface Message{
  uid: string;
  created: string;
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
  public currUsername;

  constructor(
    private msg: MessagingService,
    private fa: FireAuthService
   ) 
    {

    }

  ngOnInit(): void {
    this.query = this.msg.getChats();
    this.currUsername = this.fa.authUserDoc.get().pipe(
      map(d => {
        this.currUsername = d.data().profile.username
      })
    )
  }

  chatSelected(chat: QueryDocumentSnapshot<unknown>) {
    console.log(chat)
    this.chatHistory$ = this.msg.getMessageHistory(chat.id)
  }



}
