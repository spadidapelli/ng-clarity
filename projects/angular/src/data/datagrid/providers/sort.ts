/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { ClrDatagridComparatorInterface } from '../interfaces/comparator.interface';
import { StateDebouncer } from './state-debouncer.provider';

@Injectable()
export class Sort<T = any> {
  /**
   * Currently active comparator
   */
  private _comparator: ClrDatagridComparatorInterface<T>;

  /**
   * Ascending order if false, descending if true
   */
  private _reverse = false;

  /**
   * The Observable that lets other classes subscribe to sort changes
   */
  private _change = new Subject<Sort<T>>();

  constructor(private stateDebouncer: StateDebouncer) {}

  get comparator(): ClrDatagridComparatorInterface<T> {
    return this._comparator;
  }
  set comparator(value: ClrDatagridComparatorInterface<T>) {
    this.stateDebouncer.changeStart();
    this._comparator = value;
    this.emitChange();
    this.stateDebouncer.changeDone();
  }

  get reverse(): boolean {
    return this._reverse;
  }
  set reverse(value: boolean) {
    this.stateDebouncer.changeStart();
    this._reverse = value;
    this.emitChange();
    this.stateDebouncer.changeDone();
  }

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<Sort<T>> {
    return this._change.asObservable();
  }

  /**
   * Sets a comparator as the current one, or toggles reverse if the comparator is already used. The
   * optional forceReverse input parameter allows to override that toggling behavior by sorting in
   * reverse order if `true`.
   *
   * @memberof Sort
   */
  toggle(sortBy: ClrDatagridComparatorInterface<T>, forceReverse?: boolean) {
    this.stateDebouncer.changeStart();
    // We modify private properties directly, to batch the change event
    if (this.comparator === sortBy) {
      this._reverse = typeof forceReverse !== 'undefined' ? forceReverse || !this._reverse : !this._reverse;
    } else {
      this._comparator = sortBy;
      this._reverse = typeof forceReverse !== 'undefined' ? forceReverse : false;
    }
    this.emitChange();
    this.stateDebouncer.changeDone();
  }

  /**
   * Clears the current sorting order
   */
  clear() {
    this.comparator = null;
  }

  /**
   * Compares two objects according to the current comparator
   */
  compare(a: T, b: T): number {
    return (this.reverse ? -1 : 1) * this.comparator.compare(a, b);
  }

  private emitChange() {
    this._change.next(this);
  }
}
