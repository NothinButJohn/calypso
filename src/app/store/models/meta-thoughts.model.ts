import * as firebase from 'firebase'

export interface MetaThought {
    createdAt: firebase.default.firestore.Timestamp,
    authorProfile?: any;
    creator: string,
    privacy: string,
    text?: string,
    image?: string,
    link?: string,
}
export class Thought<MetaThought>{
    createdAt: firebase.default.firestore.Timestamp;
    authorProfile?: any;
    creator: string;
    privacy: string;
    text?: string;
    image?: string;
    link?: string;


    // constructor(){
    //     this.createdAt = null;
    //     this.creator = '';
    //     this.privacy = '';
    // };
    
    constructor(text: string, username: string) {
        this.createdAt = firebase.default.firestore.Timestamp.now();
        this.creator = username;
        this.text = text;
        this.privacy = 'global';
        this.authorProfile = null;
        this.image = null;
        this.link = null;

    };
    // setAuthorProfile(docRef){
    //     this.authorProfile
    //     //  = docRef;
    // }
}