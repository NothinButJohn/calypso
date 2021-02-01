import { Component, OnInit } from '@angular/core';
import { QueryDocumentSnapshot} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, timestamp } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { MessagingService } from 'src/app/services/messaging.service';

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
  public query;
  public currUsername: string;
  private selectedChat

  allUsernames: string[];
  filteredUsernames

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
      startWith(''),
      map(searchQuery => {
        console.log(searchQuery, this.allUsernames)
        let fv = searchQuery.toLowerCase();
        return this.allUsernames.filter(u => u.toLowerCase().includes(fv))
        })
    )
  }

  openDialog() {
    let dialogRef = this.dialog.open(NewMessageDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  chatSelected(chat: QueryDocumentSnapshot<unknown>) {
    // console.log(chat)
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

}

@Component({
  selector: 'new-message-dialog-content',
  templateUrl: 'newchat-dialog.html'
})
export class NewMessageDialog extends MessagesComponent{}
