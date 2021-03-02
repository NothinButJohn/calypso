import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { bioSelector, headerPictureSelector, profilePictureSelector, usernameSelector } from 'src/app/store/selectors/profile.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit { 
  profilePicture$: Observable<string>;
  headerPicture$: Observable<string>;
  username$: Observable<string>;
  bio$: Observable<string>;

  constructor(private store: Store) 
    {
    }


  ngOnInit(): void {
    this.headerPicture$ = this.store.select(headerPictureSelector).pipe(
      tap(
      (res) => {
        console.log(res)
      })
    )
    this.profilePicture$ = this.store.select(profilePictureSelector)
    this.username$ = this.store.select(usernameSelector)
    this.bio$ = this.store.select(bioSelector)
  }


}
