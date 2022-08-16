import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolverComponent } from './resolver.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const routes: Routes = [
  {
    path: '', component: ResolverComponent
  }
];

@NgModule({
  declarations: [ResolverComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterModule,
    TranslateModule,
    MatProgressSpinnerModule
  ]
})
export class ResolverModule { }
