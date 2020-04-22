import { Component, OnInit } from '@angular/core';
import {AdService} from "../../common/services/ad.service";

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.sass']
})
export class ExportComponent implements OnInit {

  public pops: [];

  constructor(
    private adService: AdService
  ) { }

  public ngOnInit(): void {
  }

  public exportAsExcel(): void {
    console.log("WOW EXPORTED AS EXCEL");
  }

  public exportAsPDF(): void {
    console.log("WOW EXPORTED AS PDF");
  }
}
