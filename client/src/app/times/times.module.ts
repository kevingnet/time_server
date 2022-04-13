import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TimesRoutingModule } from './times-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import {JwPaginationModule} from 'jw-angular-pagination';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimesRoutingModule,
    FormsModule,
    JwPaginationModule
  ],
    declarations: [
        LayoutComponent,
        ListComponent
    ],
    bootstrap:    [ ListComponent ]
})
export class TimesModule { }
