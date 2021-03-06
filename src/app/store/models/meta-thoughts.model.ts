import * as firebase from 'firebase'

export interface MetaThought {
    createdAt: firebase.default.firestore.Timestamp,
    authorProfile?: any;
    creator: string,
    privacy: string,
    text?: string,
    media?: any,
    link?: string,
}
export class Thought<MetaThought>{
    createdAt: firebase.default.firestore.Timestamp;
    authorProfile?: any;
    creator: string;
    privacy: string;
    text?: string;
    media?: any;
    link?: string;

    constructor(text: string, username: string, media?: string[]) {
        this.createdAt = firebase.default.firestore.Timestamp.now();
        this.creator = username;
        this.text = text;
        this.privacy = 'global';
        this.authorProfile = null;
        this.media = media;
        this.link = null;
    };
}