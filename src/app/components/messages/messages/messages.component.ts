import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  constructor(
    private msg: MessagingService,
   ) 
    {
      let x:Observable<any> = msg.getChatRooms();
      x.subscribe(x => console.log(x))
    }

  ngOnInit(): void {
  }



}
