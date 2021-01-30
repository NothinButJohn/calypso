import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/firestore';
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

    getChats():Observable<any[]> {
      return this.fa.authUserDoc.get().pipe(
        map(x => {
          return x.data().profile.username
        }),
        switchMap((username:string) => {
          let query: QueryFn = ref => ref.where('members', "array-contains", username)
          return this.afs.collection('messages', query).get()
        }),
        map(r => r.docs.map(d => d.data())),
        tap(x =>console.log(x))
      )
    }


}
