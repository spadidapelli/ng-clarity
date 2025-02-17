/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ResponsiveNavigationService } from './providers/responsive-navigation.service';
import { ResponsiveNavCodes } from './responsive-nav-codes';

@Component({
  selector: 'clr-header',
  template: `
    <button
      type="button"
      *ngIf="isNavLevel1OnPage"
      class="header-hamburger-trigger"
      [attr.aria-label]="responsiveNavCommonString"
      (click)="openNav(responsiveNavCodes.NAV_LEVEL_1)"
    >
      <span></span>
    </button>
    <ng-content></ng-content>
    <button
      type="button"
      *ngIf="isNavLevel2OnPage"
      class="header-overflow-trigger"
      [attr.aria-label]="responsiveOverflowCommonString"
      (click)="openNav(responsiveNavCodes.NAV_LEVEL_2)"
    >
      <span></span>
    </button>
    <div class="header-backdrop" (click)="closeOpenNav()"></div>
  `,
  host: { '[class.header]': 'true' },
})
export class ClrHeader implements OnDestroy {
  @Input() @HostBinding('attr.role') role = 'banner';

  isNavLevel1OnPage = false;
  isNavLevel2OnPage = false;
  openNavLevel: number = null;
  responsiveNavCodes = ResponsiveNavCodes;
  private _subscription: Subscription;

  constructor(
    private responsiveNavService: ResponsiveNavigationService,
    public commonStrings: ClrCommonStringsService
  ) {
    this._subscription = responsiveNavService.registeredNavs.subscribe({
      next: (navLevelList: number[]) => {
        this.initializeNavTriggers(navLevelList);
      },
    });

    this._subscription.add(
      responsiveNavService.navControl
        .pipe(
          filter(
            ({ controlCode }) =>
              controlCode === ResponsiveNavCodes.NAV_CLOSE || controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL
          )
        )
        .subscribe(() => {
          this.openNavLevel = null;
        })
    );
  }

  get responsiveNavCommonString() {
    const myCommonStrings = this.commonStrings.keys;
    if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_1) {
      return myCommonStrings.responsiveNavToggleOpen;
    } else {
      return myCommonStrings.responsiveNavToggleClose;
    }
  }

  get responsiveOverflowCommonString() {
    const myCommonStrings = this.commonStrings.keys;
    if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_2) {
      return myCommonStrings.responsiveNavOverflowOpen;
    } else {
      return myCommonStrings.responsiveNavOverflowClose;
    }
  }

  // reset triggers. handles cases when an application has different nav levels on different pages.
  resetNavTriggers() {
    this.isNavLevel1OnPage = false;
    this.isNavLevel2OnPage = false;
  }

  // decides which triggers to show on the header
  initializeNavTriggers(navList: number[]): void {
    this.resetNavTriggers();
    if (navList.length > 2) {
      console.error('More than 2 Nav Levels detected.');
      return;
    }
    navList.forEach(navLevel => {
      if (navLevel === ResponsiveNavCodes.NAV_LEVEL_1) {
        this.isNavLevel1OnPage = true;
      } else if (navLevel === ResponsiveNavCodes.NAV_LEVEL_2) {
        this.isNavLevel2OnPage = true;
      }
    });
  }

  // closes the nav that is open
  closeOpenNav() {
    this.responsiveNavService.closeAllNavs();
  }

  /**
   * @deprecated Will be removed in with @clr/angular v15.0.0
   *
   * Use `openNav(navLevel)` instead to open the navigation and ResponsiveNavService to close it.
   */
  toggleNav(navLevel: number) {
    if (this.openNavLevel === navLevel) {
      this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, navLevel);
      return;
    }

    this.openNav(navLevel);
  }

  openNav(navLevel: number) {
    this.openNavLevel = navLevel;
    this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, navLevel);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
