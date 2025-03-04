/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplaySubject, Subject } from 'rxjs';

import { ResponsiveNavCodes } from '../responsive-nav-codes';
import { ResponsiveNavControlMessage } from '../responsive-nav-control-message';

@Injectable({ providedIn: 'root' })
export class ResponsiveNavigationService {
  responsiveNavList: number[] = [];

  private registerNavSubject = new ReplaySubject<number[]>();
  private controlNavSubject = new Subject<ResponsiveNavControlMessage>();

  constructor() {
    this.closeAllNavs(); // We start with all navs closed
  }

  get registeredNavs(): Observable<number[]> {
    return this.registerNavSubject.asObservable();
  }

  get navControl(): Observable<ResponsiveNavControlMessage> {
    return this.controlNavSubject.asObservable();
  }

  registerNav(navLevel: number): void {
    if (!navLevel || this.isNavRegistered(navLevel)) {
      return;
    }
    this.responsiveNavList.push(navLevel);
    this.registerNavSubject.next(this.responsiveNavList);
  }

  isNavRegistered(navLevel: number): boolean {
    if (this.responsiveNavList.indexOf(navLevel) > -1) {
      console.error('Multiple clr-nav-level ' + navLevel + ' attributes found. Please make sure that only one exists');
      return true;
    }
    return false;
  }

  unregisterNav(navLevel: number) {
    const index = this.responsiveNavList.indexOf(navLevel);
    if (index > -1) {
      this.responsiveNavList.splice(index, 1);
      this.registerNavSubject.next(this.responsiveNavList);
    }
  }

  sendControlMessage(controlCode: string, navLevel: number) {
    const message: ResponsiveNavControlMessage = new ResponsiveNavControlMessage(controlCode, navLevel);
    this.controlNavSubject.next(message);
  }

  closeAllNavs() {
    const message: ResponsiveNavControlMessage = new ResponsiveNavControlMessage(
      ResponsiveNavCodes.NAV_CLOSE_ALL,
      -999
    );
    this.controlNavSubject.next(message);
  }
}
