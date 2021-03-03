import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
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

  getAllMetaThoughtsByCurrentUser(uid: string): Observable<Thought<MetaThought>[]>{
    console.log('service::getAllThoughtsByCurrentUser(), querying with uid: ', uid)
    return this.afs.collection(`users/${uid}/meta-thoughts`).get().pipe(
      map((qs) => {
        console.log('service::getAllThoughtsByCurrentUser(), querySnapshot', qs)
        let formatedMetaThoughts: Thought<MetaThought>[] = [];
        let allThoughtDocs = qs.docs

        let tempThought: Thought<MetaThought> = {
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
    let t = []
    t = [...formatedMetaThoughts]
      formatedMetaThoughts.forEach((element, i) => {
        this.afs.doc(element.authorProfile).get().pipe(
          map(ref => {
            // console.log(ref.get('profile'))
            newThoughts = [...newThoughts,ref.get('profile')]
            let repl:Thought<MetaThought> = {
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
            console.log('this is repl',repl, 'this is t', t)
            // formatedMetaThoughts[i].authorProfile = ref.get('profile')
          })
        ).subscribe({
          next(x){console.log('within promise, got value x:', x)},
          error(err){reject(err)},
          complete(){resolve(t)}
        })
      })
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

  createNewThought(thought: string, uid: string, username: string) {
    let newThought = new Thought(thought, username)
    return this.afs.collection(`users/${uid}/meta-thoughts`).add(newThought).then(
      (val) =>{return val}, 
      (reason) => {
        console.log('Failed to create a new thought, reason: ',reason);
        return false;
    })
  }
}
