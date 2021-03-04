import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { profilePictureSelector, usernameSelector } from "src/app/store/selectors/profile.selectors";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormControl, FormGroup } from "@angular/forms";
import { CreateNewMetaThought } from "src/app/store/actions/profile.actions";
import { MetaThought, Thought } from "src/app/store/models/meta-thoughts.model";


@Component({
    selector: 'new-thought-dialog',
    templateUrl: './new-thought-dialog.html',
    styleUrls: ['./new-thought-dialog.scss']
})
export class NewThoughtDialogComponent implements OnInit {
    @ViewChild('dialogInput') dialogInput: MatInput
    profilePicture$: Observable<string>;
    username$:Observable<string>;

    newThoughtFormGroup = new FormGroup({
        textInputControl: new FormControl('')
    })
    constructor(private store: Store){}
    ngOnInit(){
        this.profilePicture$ = this.store.select(profilePictureSelector)
        this.username$ = this.store.select(usernameSelector)
    }
    createThought(username: string){
        console.log(username)
        let payload = this.newThoughtFormGroup.get('textInputControl').value
        let newThought: Thought<MetaThought> = new Thought(payload, username)
        this.store.dispatch(CreateNewMetaThought({thought: newThought}))
    }
}