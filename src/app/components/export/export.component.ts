import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.sass']
})
export class ExportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public exportAsExcel(): void {
    console.log("WOW EXPORTED AS EXCEL");
  }

  public exportAsPDF(): void {
    console.log("WOW EXPORTED AS PDF");
  }
}
