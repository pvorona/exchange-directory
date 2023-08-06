export type Loadable<T, E = unknown> =
  | {
      readonly status: LoadableStatus.Idle;
    }
  | {
      readonly status: LoadableStatus.Loading;
    }
  | {
      readonly status: LoadableStatus.Completed;
      readonly data: T;
    }
  | {
      readonly status: LoadableStatus.Failed;
      readonly error: E;
    };

export enum LoadableStatus {
  Idle,
  Loading,
  Completed,
  Failed,
}
