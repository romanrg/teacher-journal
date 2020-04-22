import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Select} from "@ngxs/store";
import {NgxsSubjectsState, SubjectsStateModel} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {AdService} from "../../../common/services/ad.service";
import {Students} from "../../../@ngxs/students/students.actions";


@Component({
  selector: "app-subjects-list",
  templateUrl: "./subjects-list.component.html",
  styleUrls: ["./subjects-list.component.sass"]
})
export class SubjectsListComponent implements OnInit, OnDestroy {
  @Select(NgxsSubjectsState.Subjects) public subjects$: Observable<SubjectsStateModel>;
  public popUp: null|string = null;
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
  public deleteSubject($event: Event): void {
    const subjName: string = $event.target.parentNode.getAttribute("subject");
    this.store.dispatch(new Subjects.Delete(subjName));
  }
  public ngOnInit(): void {
    this.subjects$.subscribe(state => {
      this.popUp = state.popups.list;
    })
  }

  public closePopUp(): void {
    this.store.dispatch(new Subjects.PopUpCancelList());
  };
  public sendComponent(popUpComponent: []): any {
    setTimeout(() => {
      this.closePopUp()
    }, 5000);
    return this.adService.getSuccessPop(popUpComponent.value);
  }

}
