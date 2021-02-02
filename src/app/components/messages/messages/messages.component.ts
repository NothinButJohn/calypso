import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryDocumentSnapshot} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, timestamp } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
export interface Message{
  sender: string;
  createdAt;
  text: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public chats$: Observable<unknown>
  public chatHistory$: Observable<any[]>
  public query: Observable<QueryDocumentSnapshot<unknown>[]>;
  public currUsername: string;
  private selectedChat

  allUsernames: string[];
  filteredUsernames
  newChatMembers: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('userInput', {static: false}) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  newChatroom = false;

  chatForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })

  searchForm = new FormGroup({
    searchUsers: new FormControl('')
  
  })

  constructor(
    private msg: MessagingService,
    private fa: FireAuthService,
    public dialog: MatDialog
   ) 
    {

    }

  ngOnInit(): void {
    this.query = this.msg.getChats();
    this.fa.authUserDoc.get().pipe(
      map(d => {
        this.currUsername = d.data().profile.username
      })
    ).subscribe();

    this.allUsernames = this.msg.getAllUsers();
    this.filteredUsernames = this.searchForm.get('searchUsers').valueChanges.pipe(
      startWith(null),
      map((searchQuery: string | null) => searchQuery ? this.allUsernames.filter(u => u.toLowerCase().includes(searchQuery.toLowerCase())) :
      this.allUsernames.slice())
    )
  }

  openDialog() {
    let dialogRef = this.dialog.open(NewMessageDialog);
    dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
    if(result){

    }
    })
  }

  add(event: MatChipInputEvent) {
    let input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      this.newChatMembers.push(value.trim())
    }
    if(input) {
      input.value = null;
    }
  }

  remove(user: string) {
    let index = this.newChatMembers.indexOf(user);
    if(index >=0) {
      this.newChatMembers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option)
    this.newChatMembers.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.searchForm.get('searchUsers').setValue('');
  }

  chatSelected(chat: QueryDocumentSnapshot<unknown>) {
    console.log("chat selected"+chat)
    this.selectedChat = chat;
    this.chatHistory$ = this.msg.getMessageHistory(chat.id)
  }

  sendMessage(){
    let msg: Message = {
      sender: this.currUsername,
      text: this.chatForm.get('text').value,
      createdAt: timestamp().toString()
    }
    console.log(msg)
    this.msg.sendMessage(this.selectedChat.id, msg)
    this.chatForm.reset();
  }

  search(){
    this.searchForm.get('searchMessages').valueChanges
  }

  createChatroom(){
    this.msg.createChatroom(this.newChatMembers.sort()).pipe(
      map(x => {
        this.selectedChat = x
        this.chatHistory$ = this.msg.getMessageHistory(x.id)
      })
    )
    this.newChatMembers.splice(0)
  }

}

@Component({
  selector: 'new-message-dialog-content',
  templateUrl: 'newchat-dialog.html'
})
export class NewMessageDialog extends MessagesComponent{}
