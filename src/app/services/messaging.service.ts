import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';

// temporary storing models

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
      return this.afs.collection<message>(`messages/${docId}/messageHistory`).valueChanges()
    }

}
