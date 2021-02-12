import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { googleLoginSuccess } from '../store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  constructor(
    public auth: AngularFireAuth,
    private store: Store)
    {

    }

  login(){
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result)=> {
      let uid = result.user.uid
      this.store.dispatch(googleLoginSuccess({uid}))
      return uid
    })
    .catch((error) => {
      console.log(error)
    })
  }
  logout(){
    this.auth.signOut();
  }

}
