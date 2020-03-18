import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-table-caption',
  templateUrl: './table-caption.component.html',
  styleUrls: ['./table-caption.component.sass']
})
export class TableCaptionComponent implements OnInit {

  @Input() public caption: string;
  constructor() { }

  ngOnInit(): void {
  }

}
