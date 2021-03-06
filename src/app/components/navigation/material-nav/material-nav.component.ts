import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { Store } from '@ngrx/store';
import { googleLogin, googleLoginSuccess } from 'src/app/store/actions/auth.actions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewThoughtDialogComponent } from '../../meta-creation/thought/new-meta-thought-dialog/new-thought-dialog';
import { AsunaTestAccount, unknownMethodTestAccount } from 'src/app/store/models/profile.model';
import { LoadUserProfile } from 'src/app/store/actions/profile.actions';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-material-nav',
  templateUrl: './material-nav.component.html',
  styleUrls: ['./material-nav.component.scss']
})
export class MaterialNavComponent {
  
  // svg = new SVGElement()

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, 
    private store: Store, private dialog: MatDialog) {
      // auto login a test account
      this.store.dispatch(googleLoginSuccess({uid: AsunaTestAccount}))
      this.store.dispatch(LoadUserProfile({uid: AsunaTestAccount}))

    }

  signIn(){
    this.store.dispatch(googleLogin())
  }

  createNewThought(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = '250px'
    dialogConfig.minWidth = '600px'
    let newThoughtDialog = this.dialog.open(NewThoughtDialogComponent, dialogConfig)
  }

}
