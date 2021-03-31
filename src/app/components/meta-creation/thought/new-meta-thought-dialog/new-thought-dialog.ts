import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { asyncScheduler, Observable, of } from "rxjs";
import { profilePictureSelector, usernameSelector } from "src/app/store/selectors/profile.selectors";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormControl, FormGroup } from "@angular/forms";
import { CreateNewMetaThought, CreateNewMetaThought2 } from "src/app/store/actions/profile.actions";
import { MetaThought, Thought } from "src/app/store/models/meta-thoughts.model";
import { FileInput } from "ngx-material-file-input";
import { map } from "rxjs/operators";
import { fileURLToPath } from "url";
import { X } from "@angular/cdk/keycodes";
import { MetaThoughtService } from "src/app/services/meta-thought.service";
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
        mediaInputControl: new FormControl(),
        emojiInputControl: new FormControl(''),
        gifInputControl: new FormControl(''),
    })
    constructor(private store: Store, private mts: MetaThoughtService){}
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
        let temp:FileInput = this.newThoughtFormGroup.get('mediaInputControl').value
        let payload = this.newThoughtFormGroup.get('textInputControl').value
        this.store.dispatch(CreateNewMetaThought2({thought: payload, fileInput: temp}))
        
    }
}