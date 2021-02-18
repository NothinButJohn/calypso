import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map} from 'rxjs/operators';
import * as firebase from 'firebase'

// temporary storing models

export interface message{
  createdAt: firebase.default.firestore.Timestamp,
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

  constructor(
    private afs: AngularFirestore,
    
  ) {
    
    }

    queryChatrooms(username: string): Observable<messengerChatroom[]> {
      // query for collection of chatrooms @param: username: string is apart of
      return this.afs.collection('messages', ref => ref.where('members', 'array-contains', username)).get().pipe(
        map((querySnapshot: QuerySnapshot<unknown>) => {
          let chatrooms: messengerChatroom[] = []; 
          // extract querySnapshot into data model array
          querySnapshot.docs.forEach((queryDocumentSnapshot: QueryDocumentSnapshot<unknown>) => {
            let tempChatroom = {
              docId: queryDocumentSnapshot.id,
              title: queryDocumentSnapshot.get('title'),
              members: queryDocumentSnapshot.get('members'),
              messageHistory: null
            }
            chatrooms.push(tempChatroom)
          })
          return chatrooms
        }),
      )
    }

    queryChatroomHistory(docId: string) {
      return this.afs.collection<message>(`messages/${docId}/messageHistory`, ref => ref.orderBy('createdAt')).valueChanges()
    }
  sendMessage(message: message, docId: string) {
    console.log('sent ', message, " in ", docId)
    this.afs.collection(`messages/${docId}/messageHistory`).add(message)
  }

  queryAllUsernames(): Observable<string[]> {
    return this.afs.collection('users').get().pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((user) => {
          return user.get('profile.username')
        })
      })
    )
  }

  createNewChatroom(data, message): Promise<string>{
    return this.afs.collection('messages').add(data).then(
      (docRef)=>{
        this.afs.collection(`messages/${docRef.id}/messageHistory`).add(message)
        return docRef.id;
      }
      )
  }

  setChatroomTitle(docId: string, newTitle: string){
    return this.afs.doc(`messages/${docId}`).update({title: newTitle}).catch((error) => console.log("cannot update the chatroom title on docId: ", docId, error))
  }

}
