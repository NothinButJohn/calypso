import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  user: Observable<firebase.User>
  authUserDoc: AngularFirestoreDocument<any>;


  constructor(public auth: AngularFireAuth,
    private afs: AngularFirestore) {
    this.user = auth.authState;
  }

  login(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result)=> {
      let currUserUID = result.user.uid;
      this.authUserDoc = this.afs.doc<any>(`users/${currUserUID}`);
    })
  }
  logout(){
    this.auth.signOut();
  }

}
