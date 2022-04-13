import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JwPaginationComponent } from './jw-pagination.component';

// @ts-ignore
@NgModule({
  imports: [CommonModule],
  declarations: [JwPaginationComponent],
  exports: [JwPaginationComponent]
})
export class JwPaginationModule { }
