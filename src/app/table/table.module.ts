import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableComponent } from './table.component';
import { MaterialModule } from '../shared/material/material.module';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule
    ],
    declarations: [TableComponent],
    providers: [DatePipe],
    entryComponents: []
  })
  export class TableModule { }
