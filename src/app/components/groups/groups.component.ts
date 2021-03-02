import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from './new-group-dialog/new-group-dialog.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  newGroupForm = new FormGroup({
    groupName: new FormControl(''),
    groupTag: new FormControl(''),
  })

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openNewGroupDialog(){
    let dialogRef = this.dialog.open( NewGroupDialogComponent,{
      height: '400px',
      width: '600px'
    })
  }

  createGroup(){
    this.dialog.closeAll()

  }

}