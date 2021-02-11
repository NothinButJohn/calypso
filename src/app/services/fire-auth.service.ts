import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  constructor(
    public auth: AngularFireAuth,
    private afs: AngularFirestore) 
    {

    }

  login(){
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result)=> {
      return result.user.uid
    })
    .catch((error) => {
      console.log(error)
    })
  }
  logout(){
    this.auth.signOut();
  }

}
