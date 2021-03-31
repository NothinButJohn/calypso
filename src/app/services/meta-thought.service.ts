import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { asyncScheduler, forkJoin, from, Observable, of, zip } from 'rxjs';
import { combineAll, concatMap, exhaustMap, finalize, map, mergeAll, mergeMap, reduce, switchAll, switchMap, tap } from 'rxjs/operators';
import { MetaThought, Thought } from '../store/models/meta-thoughts.model';
import { Profile } from '../store/models/profile.model';
import { currentUserUIDSelector } from '../store/selectors/auth.selectors';
import { FireAuthService } from './fire-auth.service';
import * as firebase from 'firebase'
import { FileInput } from 'ngx-material-file-input';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class MetaThoughtService {
  // currentUserUID$: Observable<string>
  constructor(private afs: AngularFirestore, private store: Store, private afstorage: AngularFireStorage) {
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
          media: '',
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
            media: queryDocumentSnapshot.get('media'),
            link: queryDocumentSnapshot.get('link'),
          }
          formatedMetaThoughts = [...formatedMetaThoughts, tempThought]
        })
        console.log('service::getAllThoughtsByCurrentUser()', formatedMetaThoughts)
        return formatedMetaThoughts;
      })
    )
  }

  loadAuthorProfiles(formatedMetaThoughts:Thought<MetaThought>[]) {
    let metaThoughtsWithAuthorProfileReplacements:Thought<MetaThought>[] = []
    let formatedMetaThoughtsWithProfileReplaced:Thought<MetaThought>[] = [...formatedMetaThoughts] // initialize to original thought list
    let metaThoughts$ = of(formatedMetaThoughtsWithProfileReplaced)
    let observable = 
      metaThoughts$.pipe(
        concatMap((metaThoughts:Thought<MetaThought>[]) => {
          let t=  []
          for(let i=0; i<metaThoughts.length; i++){
            let metaThought = metaThoughts[i]
            // console.log('arg1, metaThoughts[i]: ', metaThought, '\n arg2, metaThoughts',metaThoughts)
            let userDocSnapshot = this.afs.doc(metaThought.authorProfile).get()
            let s = userDocSnapshot.pipe(
              map((docSnapshot) => {
                let userProfile = docSnapshot.get('profile')
                let formattedThought:Thought<MetaThought> = {
                  createdAt: metaThought.createdAt,
                  creator: metaThought.creator,
                  privacy: metaThought.privacy,
                  text: metaThought.text,
                  authorProfile: userProfile,
                  link: metaThought.link,
                  media: metaThought.media,
              }
              return formattedThought
                // return {metaThought, userProfile}
                // return metaThoughtsWithAuthorProfileReplacements
                
              })
            )
            t.push(s)
          }
          return forkJoin(t)
        }),

      ).pipe(
        // combineAll(),
        tap((result) => {

          console.log('[meta-thought.service]::loadAuthorProfiles() | returning', result)})
      )
    return observable

  }

  async uploadMedia(fileInput: FileInput, uid: string){
    // let uploadPromise = new Promise((resolve, reject)=> {
      let fbStorage = firebase.default.storage().ref();
      let mediaDownloadURLs = []

      const testObs = new Observable(subscriber => {
        
      })

      for(const file of fileInput.files){
        let mediaName = Date.now().toString();
  
        await fbStorage.child(`${uid}/media/${mediaName}`).put(file).then(snapshot => {
          //nothing more to do currently...//
          console.log('uploadMedia(), upload complete, snapshot reference: ',snapshot.ref)
          fbStorage.child(`${uid}/media/${mediaName}`).getDownloadURL().then(url => {
            mediaDownloadURLs.push(url)
          })
        })
      }
      console.log('uploadMedia()::mediaDownloadURLs: ', mediaDownloadURLs)
    
    return mediaDownloadURLs
  }
  uploadMedia2(fileInput: FileInput, uid: string) {
      let fbStorage = firebase.default.storage().ref();
      let files$ = from(fileInput.files)

      let lo = files$.pipe(
        concatMap(file => {
          let mediaDownloadURLs = []
          let mediaName = Date.now().toString();
          let upload$ = of(fbStorage.child(`${uid}/media/${mediaName}`).put(file).then(snapshot => {
            //nothing more to do currently...//
            console.log('uploadMedia(), upload complete, snapshot reference: ',snapshot.ref)
            fbStorage.child(`${uid}/media/${mediaName}`).getDownloadURL().then(url => {
              mediaDownloadURLs.push(url)
            })
          })
          )
          return forkJoin(upload$)
          // return upload$;
        })
      )
      
      // console.log('uploadMedia()::mediaDownloadURLs: ', mediaDownloadURLs)
    
    return lo
  }
  uploadMedia3(fileInput: FileInput, uid: string) {
    let mediaDownloadURLs: Observable<any>[] = [];
    let mediaName = Date.now().toString();
    let path = `${uid}/media/${mediaName}`;
    let uploads = [];
    let files$ = of(fileInput.files)

    let obs = files$.pipe(
      concatMap((files) => {
        files.map((file) => {
          let task = this.afstorage.upload(path, file)
          let downloadURL$ = task.snapshotChanges().pipe(
            finalize(() => {
              mediaDownloadURLs.push(this.afstorage.ref(path).getDownloadURL() )
            })
          )
          uploads.push(downloadURL$)
        })
        let xyz = forkJoin(mediaDownloadURLs).pipe(
          tap((x) => {console.log('in here we got x which is ', x)})
        )
        return xyz
      })
    )
    return obs

  }
  uploadMedia4(fileInput: FileInput, uid: string) {
    let files$ = from(fileInput.files);
  }

  createNewThought(thought: Thought<MetaThought>, uid: string, username: string) {
    console.log('[meta-thought service]::createNewThought() args: ',thought, uid, username);

    // Prepare Data Object to send to firestore
    let currentUserProfileDocRef = this.afs.doc(`users/${uid}`).ref;
    let newThought = {
      createdAt: thought.createdAt,
      creator: thought.creator,
      privacy: thought.privacy,
      text: thought.text,
      authorRef: currentUserProfileDocRef,
      link:thought.link,
      media:thought.media,
    }
    // Write the thought to firestore; returns the documentRef or false
    return this.afs.collection(`users/${uid}/meta-thoughts`).add(newThought).then(
      (val) =>{return val}, 
      (reason) => {
        console.log('Failed to create a new thought, reason: ',reason);
        return false;
    })
  }
}
