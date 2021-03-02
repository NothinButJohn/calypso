import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { GroupsComponent } from "../groups.component";



@Component({
    selector: 'new-group-dialog',
    templateUrl: 'new-group-dialog.component.html',
  })
export class NewGroupDialogComponent implements OnInit  {
    @Input('newGroupFormGroup') newGroupForm: FormGroup
    
    
    constructor(){
    }
    ngOnInit(){}
  }