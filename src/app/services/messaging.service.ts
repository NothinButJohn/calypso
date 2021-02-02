import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, QueryFn, QuerySnapshot } from '@angular/fire/firestore';
import { FireAuthService } from './fire-auth.service';

import { Message } from '../components/messages/messages/messages.component'
import { Observable, Observer, of } from 'rxjs';
import { concatAll, delay, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  // private messages$: Observable<any>;
  // private authDoc$: Observable<any>;

  constructor(
    private afs: AngularFirestore,
    private fa: FireAuthService
  )
    {
      // this.afs.collection('users').get().subscribe(x => {console.log(x)});

    }

    doThis(){
      this.fa.authUserDoc.get().subscribe(x=>console.log(x.data()))
    }

    getChats() {
      return this.fa.authUserDoc.get().pipe(
        map(x => {
          return x.data().profile.username
        }),
        switchMap((username:string) => {
          let query: QueryFn = ref => ref.where('members', "array-contains", username)
          return this.afs.collection('messages', query).get()
        }),
        map(r => {return r.docs})
        // tap(x =>console.log(x))
      )
    }

    getMessageHistory(docID: string){
      return this.afs.collection(`messages/${docID}/messageHistory`, ref => ref.orderBy('createdAt')).valueChanges()
    }

    sendMessage(docID: string, message: Message){
      this.afs.collection(`messages/${docID}/messageHistory`).add(message)
    }


    
    createChatroom(members: string[]){
      return this.afs.collection('messages', ref => ref.where('members', "==", members)).get().pipe(
        map(col => {
          if(col.empty === true){
            this.afs.collection('messages').add({members, title: "New Chat Room"}).then(dr => {
              return dr.get()
            }, (res) => console.log("could not create the new chatroom. rejected: "+res))
          } else {
            return col.docs.pop()
          }
        })
      )
      
    }

    getAllUsers(){
      let users = [];
      this.afs.collection('users').get().pipe(
        map(qs => {
          qs.docs.forEach(qds => {
            users.push(qds.get('profile.username'));
          })
        })
      ).subscribe()
      return users;
    }


}
