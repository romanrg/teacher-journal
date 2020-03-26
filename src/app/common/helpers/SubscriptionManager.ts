import {Subscription} from "rxjs";

export class SubscriptionManager {
  #subscription: Subscription[];
  constructor() {
    this.#subscription = [];
  }

  public addSubscription(sub: Subscription): void  {
    this.#subscription.push(sub);
  }

  public removeAllSubscription(): void {
    this.#subscription.filter(sub => sub ).forEach(sub => sub.unsubscribe());
  }
}
