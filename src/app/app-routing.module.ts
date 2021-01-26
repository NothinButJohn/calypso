import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { AngularFireAuthGuard, customClaims, hasCustomClaim } from '@angular/fire/auth-guard';
import { MaterialNavComponent } from './components/navigation/material-nav/material-nav.component';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { MessagesComponent } from './components/messages/messages/messages.component';

const userDashboard = () => map;


const routes: Routes = [
  { path: '', pathMatch: 'full' , component: MaterialNavComponent },
  { path: 'user/:username', component: ProfileComponent },
  { path: 'messages', component: MessagesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
