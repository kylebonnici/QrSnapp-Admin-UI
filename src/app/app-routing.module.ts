import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SetFirstPasswordComponent} from './components/set-first-password/set-first-password.component';
import {PasswordResetComponent} from './components/password-reset/password-reset.component';
import {ActivateAccountComponent} from './components/activate-account/activate-account.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {SignupComponent} from './components/signup/signup.component';


const routes: Routes = [
  { path: 'resolver/:qrCodeId', loadChildren: () => import('./resolver/resolver.module').then(m => m.ResolverModule)},
  { path: 'profile/:profileUsername', loadChildren: () => import('./qr-snapp/qr-snapp.module').then(m => m.QrSnappModule)},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'invite', component: SetFirstPasswordComponent},
  { path: 'reset', component: PasswordResetComponent},
  { path: 'activate', component: ActivateAccountComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
