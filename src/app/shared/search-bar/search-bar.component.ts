import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, switchMap, first, startWith, share} from "rxjs/internal/operators";
import {StudentsServiceService} from "../../common/services/students.service";
import {IStudent} from "../../common/models/IStudent";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.sass"]
})
export class SearchBarComponent implements OnInit {
  @Input() public barValue: string;
  public searchBar: FormGroup;
  @Output() public searchRes: EventEmitter<IStudent[]> = new EventEmitter();

  constructor(
    private studentsService: StudentsServiceService
  ) {
    this.searchBar = new FormGroup({
      search: new FormControl("")
    });

  }

  public ngOnInit(): void {
    this.searchBar.get("search").setValue(this.barValue);
  }

  public showSearchResult(): void {
    this.searchRes.emit(this.searchBar.get("search").value);
  }
}
