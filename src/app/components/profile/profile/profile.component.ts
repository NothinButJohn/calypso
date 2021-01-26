import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

export interface User { name: string }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userCollection: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;

  users$: Observable<any>;
  nameFilter$: BehaviorSubject<string|null>;

  constructor(private fireAuth: FireAuthService, 
    private route: ActivatedRoute, 
    private afs: AngularFirestore,
    private afa: AngularFireAuth) 
    {
      // let cu$ = new Observable<any>();
      let cu$ = afa.user;
      let u;
      cu$.subscribe(x => u = x.uid)
      this.nameFilter$ = new BehaviorSubject(null);
      this.users$ = combineLatest([this.nameFilter$]).pipe(
        switchMap(([n]) => {
          return afs.collection('users', ref => {
            let query: firebase.default.firestore.Query = ref;
            if (n) { query = query.where('uid', '==', n) };
            return query;
          }).valueChanges()
        })
      )

      this.nameFilter$.next(u)
    }


  ngOnInit(): void {

  }



}
