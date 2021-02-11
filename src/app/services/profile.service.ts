import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private afs: AngularFirestore) { }

  queryUserProfile(uid: string) {
    return this.afs.doc(`users/${uid}`).get().pipe(
      tap((next) => {
        return next.data()
      })
    )
  }
}
