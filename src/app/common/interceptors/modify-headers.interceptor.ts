import {Injectable, Provider} from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS, HttpResponse
} from "@angular/common/http";
import {Observable, Subject} from "rxjs";

@Injectable()
export class ModifyHeadersInterceptor implements HttpInterceptor {

  constructor() {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const req = request.clone({
      headers: request.headers.set("Modified", "Modified with interceptor")
    });
    return next.handle(req);
  }
}

export const modifyHeadersProvider: Provider[] = [
  {provide: HTTP_INTERCEPTORS, useClass: ModifyHeadersInterceptor, multi: true},
];

