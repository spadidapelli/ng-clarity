/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BehaviorSubject, Observable } from 'rxjs';

import { SingleSelectComboboxModel } from './single-select-combobox.model';

export class PseudoFocusModel<T> extends SingleSelectComboboxModel<T> {
  private _focusChanged = new BehaviorSubject<T>(null);
  get focusChanged(): Observable<T> {
    return this._focusChanged.asObservable();
  }

  override select(item: T): void {
    if (this.model !== item) {
      this.model = item;
      this._focusChanged.next(item);
    }
  }
}
