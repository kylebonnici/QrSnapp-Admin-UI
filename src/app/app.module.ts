import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LoginComponent} from './components/login/login.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AuthenticationService} from './services/authentication.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {SetFirstPasswordComponent} from './components/set-first-password/set-first-password.component';
import {PasswordResetComponent} from './components/password-reset/password-reset.component';
import {ActivateAccountComponent} from './components/activate-account/activate-account.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {MatBadgeModule} from '@angular/material/badge';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {PaginatorI18n} from './qr-snapp/common/PaginatorI18n';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SignupComponent } from './components/signup/signup.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SetFirstPasswordComponent,
    PasswordResetComponent,
    ActivateAccountComponent,
    ForgotPasswordComponent,
    SignupComponent
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthenticationService,
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
