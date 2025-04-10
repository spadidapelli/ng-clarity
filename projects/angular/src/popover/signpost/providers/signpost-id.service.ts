/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class SignpostIdService {
  private _id = new Subject<string>();

  get id(): Observable<string> {
    return this._id.asObservable();
  }

  setId(id: string) {
    this._id.next(id);
  }
}
