import {Subscription} from "rxjs";

export class SubscriptionManager {
  constructor(
    private _subscription: Subscription[] = []
  ) {}

  public addSubscription(sub: Subscription): void  {
    this._subscription.push(sub);
  }

  public removeAllSubscription(): void {
    this._subscription.forEach(sub => sub.unsubscribe());
  }

  get subscriptions(): Subscription[] {
    return this._subscription;
  }

}
