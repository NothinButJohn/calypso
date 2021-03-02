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
import { MaterialDashComponent } from './components/dashboard/material-dash/material-dash.component';
import { HomeComponent } from './components/home/home.component';
import { GroupsComponent } from './components/groups/groups.component';

const userDashboard = () => map;


const routes: Routes = [
  { path: '', pathMatch: 'full' , component: HomeComponent },
  { path: 'user/:username', component: ProfileComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'groups', component: GroupsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
