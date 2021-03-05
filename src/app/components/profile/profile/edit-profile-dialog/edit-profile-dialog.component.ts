import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { bioSelector, registeredNameSelector } from "src/app/store/selectors/profile.selectors";

@Component({
    selector: 'edit-profile-dialog',
    templateUrl: './edit-profile-dialog.component.html',
    styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
    name$: Observable<string>
    bio$: Observable<string>
    constructor(private store: Store){}
    ngOnInit(){
        this.bio$ = this.store.select(bioSelector)
        this.name$ = this.store.select(registeredNameSelector)
    }

}