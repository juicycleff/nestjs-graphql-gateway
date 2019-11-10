/* tslint:disable:ban-types */

// Source: https://github.com/nestjs/graphql/blob/master/lib/storages/lazy-metadata.storage.ts

export class LazyMetadataStorageHost {
  private readonly storage: Function[] = [];

  store(fn: Function) {
    this.storage.push(fn);
  }

  load() {
    this.storage.forEach(fn => fn());
  }
}

export const lazyMetadataStorage = new LazyMetadataStorageHost();
