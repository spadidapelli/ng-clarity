/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FocusService {
  private _focused = new BehaviorSubject(false);
  get focusChange(): Observable<boolean> {
    return this._focused.asObservable();
  }
  set focused(state: boolean) {
    this._focused.next(state);
  }
}
