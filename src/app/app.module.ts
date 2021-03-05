import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './components/shared/navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { MaterialNavComponent } from './components/navigation/material-nav/material-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MaterialDashComponent } from './components/dashboard/material-dash/material-dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { LandingComponent } from './components/landing/landing/landing.component';
import { EffectsModule } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessagesComponent } from './components/messages/messages/messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import { MessagingEffects } from './store/effects/messaging.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { messagingReducer } from './store/reducers/messaging.reducers';
import { AuthReducer } from './store/reducers/auth.reducers';
import { ProfileReducer } from './store/reducers/profile.reducers';
import { AuthEffects } from './store/effects/auth.effects';
import { ProfileEffects } from './store/effects/profile.effects';
import {NewMessageDialogComponent} from './components/messages/messages/new-message-dialog/new-message-dialog.component'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CandlestickComponent } from './components/charts/candlestick/candlestick.component';
import { stocksReducer } from './store/reducers/alpha-vantage.reducers';
import { AlphaVantageEffects } from './store/effects/alpha-vantage.effects';
import {MatSelectModule} from '@angular/material/select';

import {MatTabsModule} from '@angular/material/tabs';
import { GroupsComponent } from './components/groups/groups.component';
import { NewGroupDialogComponent } from './components/groups/new-group-dialog/new-group-dialog.component';
import { ThoughtComponent } from './components/meta-creation/thought/thought.component';
import { NewThoughtDialogComponent } from './components/meta-creation/thought/new-meta-thought-dialog/new-thought-dialog';
import { EditProfileDialogComponent } from './components/profile/profile/edit-profile-dialog/edit-profile-dialog.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    MaterialNavComponent,
    MaterialDashComponent,
    ProfileComponent,
    LandingComponent,
    MessagesComponent,
    NewMessageDialogComponent,
    CandlestickComponent,
    GroupsComponent,
    NewGroupDialogComponent,
    ThoughtComponent,
    NewThoughtDialogComponent,
    EditProfileDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    StoreModule.forRoot({messenger: messagingReducer, auth: AuthReducer, profile: ProfileReducer, stocks: stocksReducer}),
    StoreDevtoolsModule.instrument({name: 'john message app', maxAge: 25 }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    StoreModule,
    EffectsModule.forRoot([MessagingEffects, AuthEffects, ProfileEffects, AlphaVantageEffects]),
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    NgApexchartsModule,
    MatSelectModule,
    MatTabsModule,
    MaterialFileInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
