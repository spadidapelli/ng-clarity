/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

export class PageCollectionMock {
  _previousPageIsCompleted = true;

  private _pagesReset = new Subject<boolean>();
  private _stepItemIdWasCalled = false;

  get pagesReset(): Observable<boolean> {
    return this._pagesReset.asObservable();
  }

  get stepItemIdWasCalled(): boolean {
    return this._stepItemIdWasCalled;
  }

  getStepItemIdForPage(): string {
    this._stepItemIdWasCalled = true;
    return 'mock-id';
  }

  previousPageIsCompleted(_page: any = null): boolean {
    return this._previousPageIsCompleted;
  }
}
