import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { Store } from '@ngrx/store';
import { googleLogin } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-material-nav',
  templateUrl: './material-nav.component.html',
  styleUrls: ['./material-nav.component.scss']
})
export class MaterialNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, 
    private store: Store) {}

  signIn(){
    this.store.dispatch(googleLogin())
  }

}
