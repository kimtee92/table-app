import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guest } from '../shared/model/guest';
import { Event } from '../shared/model/event';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SocketService } from '../shared/services/socket.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  ioConnection: any;
  registerForm: FormGroup;
  guestData: Guest[] = [];
  displayedColumns: string[] = ['Name', 'Email', 'Address', 'Date'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource();
  date = new Date();

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private socketService: SocketService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required, Validators.pattern('^[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')],
      Address: ['', Validators.required],
      Date: ['']
    });
    this.socketService.getAll().pipe(first()).subscribe((tableData: Guest[]) => {
      this.guestData = tableData;
      this.dataSource = new MatTableDataSource(this.guestData);
    });
    this.initIoConnection();
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onRegister()
      .subscribe((guest: Guest) => {
        this.guestData.push(guest);
        this.dataSource = new MatTableDataSource(this.guestData);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  onAddRow() {
    console.log('on add row');
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.value.Date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
    this.socketService.register(this.registerForm.value);
    this.registerForm.reset();
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
