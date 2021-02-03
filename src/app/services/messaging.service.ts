import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot, QueryFn, QuerySnapshot } from '@angular/fire/firestore';
import { FireAuthService } from './fire-auth.service';

import { Message } from '../components/messages/messages/messages.component'
import { Observable, Observer, of, Subject } from 'rxjs';
import { concatAll, delay, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private currAuthUser: string
  private allUsernames: string[] = [];
  private newChatroomMembers: string[] = [];
  private messageSubject: Subject<QueryDocumentSnapshot<unknown>>;
  private chatroomSubject: Subject<QueryDocumentSnapshot<unknown>>;


  constructor(
    private afs: AngularFirestore,
    private fa: FireAuthService
  )
    {
      this.fa.authUserDoc.get().subscribe(doc => this.currAuthUser = doc.data().profile.username)

    }

    getChatroomsOnce(authUser: string): Observable<QueryDocumentSnapshot<unknown>[]> {
      return this.afs.collection('messages', ref=> ref.where('members', 'array-contains', authUser)).get().pipe(
        map(qs => {
          return qs.docs
        })
      )
    }

    getAllUsernames(){
      this.afs.collection('users').get().pipe(
        map(qs => {
           qs.docs.forEach(qds => {this.allUsernames.push(qds.get('profile.username'))})
        })
      )
    }








}
