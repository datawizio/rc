export type Watcher<P> = (state: any, payload: P) => any;

export interface Subscription {
  (): void;
  unsubscribe(): void;
}

export interface Observable {
  watch(watcher: Watcher<undefined>): Subscription;
  watch<E>(trigger: any, watcher: Watcher<E>): Subscription;
}
