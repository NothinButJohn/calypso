import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireAuthService } from './fire-auth.service';

import { Message } from '../components/messages/messages/messages.component'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private chatRooms$: Observable<any>;

  constructor(
    
    private afs: AngularFirestore,
    private fa: FireAuthService
  )
    {
      this.chatRooms$ = this.fa.authUserDoc.collection<any>('messages').valueChanges({ idField: "id"});
      // this.chatRooms$.subscribe(x => console.log(x) )
    }

    getChatRooms(){
      return this.chatRooms$.pipe(
        map((data, i) => {
          console.log(data);
          let x = this.findRecipient(data[i].id)
          let msg = data[i].message
          console.log(x, msg)
        })
      )
    }

    findRecipient(uid: string){
      let username:string;
      let recip$:Observable<any> = this.afs.doc(`users/${uid}`).valueChanges();
      recip$.subscribe(x => username = x.profile.username );
      console.log(username)
      return username;
    }

    sendMessage(){}

    sendMessagetoRecipient(){}


}
