import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { asyncScheduler, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetaThought, Thought } from '../store/models/meta-thoughts.model';
import { Profile } from '../store/models/profile.model';
import { currentUserUIDSelector } from '../store/selectors/auth.selectors';
import { FireAuthService } from './fire-auth.service';

@Injectable({
  providedIn: 'root'
})
export class MetaThoughtService {
  // currentUserUID$: Observable<string>
  constructor(private afs: AngularFirestore, private store: Store) {
    // this.currentUserUID$ = store.select(currentUserUIDSelector)
  }

  getAllMetaThoughtsByCurrentUser(uid: string): Observable<unknown>{
    console.log('service::getAllThoughtsByCurrentUser(), querying with uid: ', uid)
    return this.afs.collection(`users/${uid}/meta-thoughts`).get().pipe(
      map((qs) => {
        console.log('service::getAllThoughtsByCurrentUser(), querySnapshot', qs)
        let formatedMetaThoughts = [];
        let allThoughtDocs = qs.docs

        let tempThought = {
          createdAt: null,
          authorProfile: '',
          creator: '',
          privacy: '',
          text: '',
          image: '',
          link: '',
        }
        let authorProfiles = []
        
        allThoughtDocs.forEach((queryDocumentSnapshot: QueryDocumentSnapshot<unknown>) => {
          tempThought = {
            createdAt: queryDocumentSnapshot.get('createdAt'),
            authorProfile: queryDocumentSnapshot.get('authorRef').path,
            creator: queryDocumentSnapshot.get('creator'),
            privacy: queryDocumentSnapshot.get('privacy'),
            text: queryDocumentSnapshot.get('text'),
            image: queryDocumentSnapshot.get('image'),
            link: queryDocumentSnapshot.get('link'),
          }
          formatedMetaThoughts = [...formatedMetaThoughts, tempThought]
        })
        console.log('service::getAllThoughtsByCurrentUser()', formatedMetaThoughts)
        return formatedMetaThoughts;
      })
    )
  }

  loadAuthorProfiles(formatedMetaThoughts:Thought<MetaThought>[]){
    
    let p = new Promise((resolve, reject) => {
    let newThoughts = []
    let bool = false;
    let count = 0;
    let t = []
    t = [...formatedMetaThoughts]
    
      formatedMetaThoughts.forEach((element, i) => {
        this.afs.doc(element.authorProfile).get().pipe(
          map(ref => {
            // console.log(ref.get('profile'))
            newThoughts = [...newThoughts,ref.get('profile')]
            let repl = {
              createdAt:formatedMetaThoughts[i].createdAt,
              creator:formatedMetaThoughts[i].creator,
              privacy:formatedMetaThoughts[i].privacy,
              text:formatedMetaThoughts[i].text,
              authorProfile:ref.get('profile'),
              link:formatedMetaThoughts[i].link,
              image:formatedMetaThoughts[i].image,
            }
            
            // t = [...formatedMetaThoughts]
            t.splice(i, 1, repl)
            console.log('index',i,'this is repl',repl, 'this is t', t)
            // formatedMetaThoughts[i].authorProfile = ref.get('profile')
          })
        ).subscribe({
          next(x){console.log('within promise, got value x:', x)},
          error(err){reject(err)},
          complete(){ count++;}
        })
      })
      const task = () => {resolve(t)}
      asyncScheduler.schedule(task, 1000)
  }
    ) 
    return p
    // console.log(newThoughts)
    // return of(newThoughts)
  }

  myHelper(path: string){
    this.afs.doc(path).get().pipe(
      map(ref => {
        return ref.get('profile')
      }) 
    ).subscribe()
  }

  createNewThought(thought: Thought<MetaThought>, uid: string, username: string) {
    let x = this.afs.doc(`users/${uid}`).ref;
    console.log(x)
    let repl = {
      createdAt:thought.createdAt,
      creator:thought.creator,
      privacy:thought.privacy,
      text:thought.text,
      authorRef:x,
      link:thought.link,
      image:thought.image,
    }
    // Object.defineProperty(thought, 'authorProfile', {value:x,writable: true})
    // console.log(JSON.parse(JSON.stringify(repl)))
    // let newThought = JSON.parse(JSON.stringify(repl))
    return this.afs.collection(`users/${uid}/meta-thoughts`).add(repl).then(
      (val) =>{return val}, 
      (reason) => {
        console.log('Failed to create a new thought, reason: ',reason);
        return false;
    })
  }
}
