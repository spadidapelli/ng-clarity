/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'z-index-custom-filter',
  template: `<z-index-various-content></z-index-various-content>`,
})
export class ZIndexCustomFilter<T> implements ClrDatagridFilterInterface<T> {
  private changesSubject = new Subject<T>();

  constructor(protected filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  /**
   * The Observable required as part of the Filter interface
   */
  get changes(): Observable<T> {
    return this.changesSubject.asObservable();
  }

  /**
   * Tests if an item matches a search text
   */
  accepts(): boolean {
    return false;
  }

  /**
   * Indicates if the filter is currently active, (at least one input is set)
   */
  isActive(): boolean {
    return false;
  }
}
