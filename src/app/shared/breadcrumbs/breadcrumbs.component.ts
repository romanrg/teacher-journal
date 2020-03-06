import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {IBreadCrumb} from "../../common/models/IBreadCrumb";
import {distinctUntilChanged, filter, map, tap} from "rxjs/internal/operators";
import {Subject} from "rxjs";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.sass"]
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs$: Subject;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.breadcrumbs$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(event => this.buildBreadCrumb(this.activatedRoute.root))
    );

  }

  public buildBreadCrumb(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: IBreadCrumb[] = [],
  ): IBreadCrumb[] {
      const br: string = "breadcrumb";
      let label: string;
      let path: string;
      if (route.routeConfig) {
        label = route.routeConfig.data[br];
        path = route.routeConfig.path;
      } else {
        label = "home";
        path = "";
      }
      const nextUrl: string = `${url}${path}/`;
      const breadcrumb: IBreadCrumb = {
        label: label,
        url: nextUrl
      };
      const newBreadcrumbs: IBreadCrumb[] = [...breadcrumbs, breadcrumb];

      if (route.firstChild) {
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }
      return newBreadcrumbs;

    }
}
