/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

/*
 * This provider implements some form of synchronous debouncing through a lock pattern
 * to avoid emitting multiple state changes for a single user action.
 */
@Injectable()
export class StateDebouncer {
  /*
   * This is the lock, to only emit once all the changes have finished processing
   */
  private nbChanges = 0;

  /**
   * The Observable that lets other classes subscribe to global state changes
   */
  private _change = new Subject<void>();

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<void> {
    return this._change.asObservable();
  }

  changeStart() {
    this.nbChanges++;
  }

  changeDone() {
    if (--this.nbChanges === 0) {
      this._change.next();
    }
  }
}
