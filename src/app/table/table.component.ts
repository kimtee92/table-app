import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

export interface Guest {
  Name: string;
  Number: string;
  Address: string;
  Date: string;
}

const KIM_DATA: Guest[] = [
  {Name: 'Kim Lester Tee', Number: ' 0412919397 ', Address: 'Glebe', Date: '30/01/2019'}
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  registerForm: FormGroup;
  displayedColumns: string[] = ['Name', 'Number', 'Address', 'Date'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource(KIM_DATA);
  date = new Date();

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Number: ['', Validators.required],
      Address: ['', Validators.required],
      Date: ['']
    });
  }

  onAddRow() {
    console.log('on add row');
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.value.Date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
    this.registerForm.value.Number = this.registerForm.value.Number;
    KIM_DATA.push(this.registerForm.value);
    this.registerForm.reset();
    this.dataSource = new MatTableDataSource(KIM_DATA);
  }

  ExportTOExcel() {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wscols = [
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 200 }
  ];
  ws['!cols'] = wscols;
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, this.datePipe.transform(this.date, 'dd/MM/yyyy') + '.xlsx');

}

}
