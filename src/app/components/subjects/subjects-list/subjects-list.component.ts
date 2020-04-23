import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Select} from "@ngxs/store";
import {NgxsSubjectsState, SubjectsStateModel} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {AdService} from "../../../common/services/ad.service";


@Component({
  selector: "app-subjects-list",
  templateUrl: "./subjects-list.component.html",
  styleUrls: ["./subjects-list.component.sass"]
})
export class SubjectsListComponent implements OnInit, OnDestroy {
  @Select(NgxsSubjectsState.Subjects) public subjects$: Observable<SubjectsStateModel>;
  public deletingSubject: string;
  public popUp: null|string = null;
  public pops: [];
  public isLoad$: Observable<boolean> = store
    .select(state => Object.keys(state)
      .map(key => state[key].loading)
      .some(load => load)
    );
  public pops: [];
  constructor(
    private store: Ngxs.Store,
    private adService: AdService
    ) {
  }
  public deleteSubject(subjectName: string): void {
    this.store.dispatch(new Subjects.Delete(subjectName));
  }
  public showConfirmation($event: Event): void {
    const subjName: string = $event.target.parentNode.getAttribute("subject");
    this.pops = this.adService.getSuccessPop(`Do you want to delete ${subjName}?`);
    this.deletingSubject = subjName;
  }
  public ngOnInit(): void {
    this.subjects$.subscribe(state => {
      this.popUp = state.popups.list;
    })
  }

  public confirmPopUp($event: Event): boolean {
    console.log($event);
    if ($event) {

      this.deleteSubject(this.deletingSubject);
      this.pops = null;

    } else {

      this.pops = null;

    }

    this.deletingSubject = null;
  }

  public closePopUp(): void {
    this.store.dispatch(new Subjects.PopUpCancelList());
  };
  public sendComponent(popUpComponent: []): any {
    setTimeout(() => {
      this.closePopUp()
    }, 2000);
    return this.adService.getSuccessPop(popUpComponent.value);
  }

}
