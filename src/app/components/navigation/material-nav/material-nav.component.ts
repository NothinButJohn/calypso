import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { Store } from '@ngrx/store';
import { googleLogin } from 'src/app/store/actions/auth.actions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewThoughtDialogComponent } from '../../meta-creation/thought/new-meta-thought-dialog/new-thought-dialog';

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
    private store: Store, private dialog: MatDialog) {}

  signIn(){
    this.store.dispatch(googleLogin())
  }

  createNewThought(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = '200px'
    dialogConfig.minWidth = '200px'
    let newThoughtDialog = this.dialog.open(NewThoughtDialogComponent, dialogConfig)
  }

}
