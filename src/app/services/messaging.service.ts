import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, DocumentReference, QueryDocumentSnapshot, QueryFn, QuerySnapshot } from '@angular/fire/firestore';
import { FireAuthService } from './fire-auth.service';

import { Message } from '../components/messages/messages/messages.component'
import { Observable, Observer, of, Subject } from 'rxjs';
import { concatAll, delay, map, switchMap, tap } from 'rxjs/operators';

import * as MessagingActions from '../store/actions/messaging.actions'

export interface message{
  createdAt: string,
  sender: string,
  text: string,
}

export interface messengerChatroom {
  docId: string,
  title: string[],
  members: string[],
  messageHistory: Observable<unknown[]>
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private allUsernames: string[] = [];
  private newChatroomMembers: string[] = [];




  constructor(
    private afs: AngularFirestore,
    private fa: FireAuthService
  )
    {

    }

    queryChatrooms(username: string){
      console.log('username', username)
      return this.afs.collection('messages', ref => ref.where('members', 'array-contains', username)).get().pipe(
        map((qds) => {
          let chatrooms: messengerChatroom[] = [];
          qds.docs.forEach((ele) => {
            let cr = {
              docId: ele.id,
              title: ele.get('title'),
              members: ele.get('members'),
              messageHistory: null
            }
            chatrooms.push(cr)})
            return chatrooms
        }),
        map((chatroomArray) => {
          chatroomArray.forEach((cr) => {
            cr.messageHistory = this.afs.collection(`messages/${cr}/messageHistory`).valueChanges()
          })
          return chatroomArray;
        })
      )
    }

      filterAllUsernames(username: string){
        console.log('filter value: ', username, "allUsernames: ", this.allUsernames, "val")
        let filterValue = username.toLowerCase();
        return this.allUsernames.filter(un => un.toLowerCase().indexOf(filterValue) === 0)
      }

      getNewChatroomMembers(): Observable<string[]>{
        return of(this.newChatroomMembers)
      }

      getAllUsernames(){
        return this.allUsernames
      }
      addNewChatMember(user: string){
        if(!this.newChatroomMembers.includes(user)){
          this.newChatroomMembers.push(user)
        }
      }
      removeNewChatMember(user: string){
        let index = this.newChatroomMembers.indexOf(user);
        if(index >=0) {
          this.newChatroomMembers.splice(index, 1);
        }
      }


    queryAllUsernames(){
      // console.log('query all usernames', this.allUsernames)
      return this.afs.collection('users').get().pipe(
        map(qs => {
           qs.docs.forEach(qds => {
            if(!this.allUsernames.includes(qds.get('profile.username'))){
              this.allUsernames.push(qds.get('profile.username'))} 
          })
        })
      )
    }

    createChatroom(){
      // if()
    }



}
