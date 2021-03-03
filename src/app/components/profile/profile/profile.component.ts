import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadCurrentUserMetaThoughts } from 'src/app/store/actions/profile.actions';
import { bioSelector, headerPictureSelector, metaThoughtsSelector, profilePictureSelector, usernameSelector } from 'src/app/store/selectors/profile.selectors';

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
  metaThoughts$: Observable<any>;

  constructor(private store: Store) 
    {
    }


  ngOnInit(): void {
    this.store.dispatch(LoadCurrentUserMetaThoughts())
    this.headerPicture$ = this.store.select(headerPictureSelector).pipe(
      tap(
      (res) => {
        console.log(res)
      })
    )
    this.profilePicture$ = this.store.select(profilePictureSelector)
    this.username$ = this.store.select(usernameSelector)
    this.bio$ = this.store.select(bioSelector)
    this.metaThoughts$ = this.store.select(metaThoughtsSelector)
  }


}
