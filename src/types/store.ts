export type Watcher<T> = (state: T) => void;

export interface Subscription {
  (): void;
  unsubscribe(): void;
}

export interface Observable<T = any> {
  watch: (fn: Watcher<T>) => Subscription;
}
