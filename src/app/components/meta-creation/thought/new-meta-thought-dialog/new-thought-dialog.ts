import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { profilePictureSelector } from "src/app/store/selectors/profile.selectors";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";


@Component({
    selector: 'new-thought-dialog',
    templateUrl: './new-thought-dialog.html',
    styleUrls: ['./new-thought-dialog.scss']
})
export class NewThoughtDialogComponent implements OnInit {
    @ViewChild('dialogInput') dialogInput: MatInput
    profilePicture$: Observable<string>;
    constructor(private store: Store){}
    ngOnInit(){
        this.profilePicture$ = this.store.select(profilePictureSelector)
        
    }
}