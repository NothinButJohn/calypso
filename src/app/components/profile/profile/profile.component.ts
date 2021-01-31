import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

export interface User { name: string }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public userProfile$

  users$: Observable<any>;
  nameFilter$: BehaviorSubject<string|null>;

  constructor(private fireAuth: FireAuthService, 
    private route: ActivatedRoute, 
    private afs: AngularFirestore,
    private afa: AngularFireAuth) 
    {
      this.userProfile$ = fireAuth.authUserDoc.get().pipe(
        map(x => {
          return x.data().profile
        })
      )

    }


  ngOnInit(): void {

  }



}
