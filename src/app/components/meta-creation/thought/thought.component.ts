import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { metaThoughtsSelector } from 'src/app/store/selectors/profile.selectors';

@Component({
  selector: 'app-thought',
  templateUrl: './thought.component.html',
  styleUrls: ['./thought.component.scss']
})
export class ThoughtComponent implements OnInit {
  metaThoughts$: Observable<any>;
  haha: DocumentReference

  constructor(private store: Store, private afs: AngularFirestore) {
    // this.afs.doc('').get()
  }

  ngOnInit(): void {
    this.metaThoughts$ = this.store.select(metaThoughtsSelector)
    // this.haha.get
  }

}
