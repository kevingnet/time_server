import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import {JwPaginationModule} from 'jw-angular-pagination';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FormsModule,
    JwPaginationModule
  ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ],
    bootstrap:    [ AddEditComponent ]
})
export class UsersModule { }
