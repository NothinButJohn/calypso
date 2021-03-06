import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { asyncScheduler, Observable, of } from "rxjs";
import { profilePictureSelector, usernameSelector } from "src/app/store/selectors/profile.selectors";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormControl, FormGroup } from "@angular/forms";
import { CreateNewMetaThought } from "src/app/store/actions/profile.actions";
import { MetaThought, Thought } from "src/app/store/models/meta-thoughts.model";
import { FileInput } from "ngx-material-file-input";
import { map } from "rxjs/operators";
import { fileURLToPath } from "url";
// import { Console } from "console";


@Component({
    selector: 'new-thought-dialog',
    templateUrl: './new-thought-dialog.html',
    styleUrls: ['./new-thought-dialog.scss']
})
export class NewThoughtDialogComponent implements OnInit {
    @ViewChild('dialogInput') dialogInput: MatInput
    @ViewChild('mediaFileInput') mediaFileInput: FileInput
    profilePicture$: Observable<string>;
    username$:Observable<string>;
    mediaInputPreview$: Observable<any>;

    newThoughtFormGroup = new FormGroup({
        textInputControl: new FormControl(''),
        mediaInputControl: new FormControl()
    })
    constructor(private store: Store){}
    ngOnInit(){
        this.profilePicture$ = this.store.select(profilePictureSelector)
        this.username$ = this.store.select(usernameSelector)
        this.mediaInputPreview$ = this.newThoughtFormGroup.get('mediaInputControl').valueChanges.pipe(
            map((FileInput: FileInput) => {
                let mediaArray = []
                for(let i=0; i<FileInput.files.length; i++) {
                    (function(file){
                        let reader = new FileReader();    
                        reader.onloadend = (_event) => {
                            mediaArray.push(reader.result)
                        }
                        reader.readAsDataURL(file)
                    })(FileInput.files[i])
                }
                return mediaArray;
            })
        )
    }
    createThought(username: string){
        console.log('[new-thought-dialog]createThought()')
        this.mediaInputPreview$.pipe(
            map(uploadedMedia => {
                let newThought: Thought<MetaThought> 
                if(uploadedMedia.length > 0){
                    let payload = this.newThoughtFormGroup.get('textInputControl').value
                    newThought = new Thought(payload, username, uploadedMedia)
                }else {
                    let payload = this.newThoughtFormGroup.get('textInputControl').value
                    newThought = new Thought(payload, username)
                }
                this.store.dispatch(CreateNewMetaThought({thought: newThought}))
            })
        ).subscribe()
        
        
    }
}