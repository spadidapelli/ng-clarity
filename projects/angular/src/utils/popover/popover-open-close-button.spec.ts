/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { spec, TestContext } from '../testing/helpers.spec';
import { ClrPopoverOpenCloseButton } from './popover-open-close-button';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';

@Component({
  selector: 'test-host',
  template:
    '<button #testAnchor clrPopoverOpenCloseButton (clrPopoverOpenCloseChange)="updateOpenState($event)">Smart' +
    ' Open Close' +
    ' Button</button>',
  providers: [ClrPopoverToggleService],
})
class TestHost {
  @ViewChild('testAnchor', { read: ElementRef, static: true }) anchor: ElementRef<HTMLButtonElement>;

  openState;

  updateOpenState(event) {
    this.openState = event;
  }
}

export default function (): void {
  describe('ClrPopoverOpenCloseButton', function () {
    type Context = TestContext<ClrPopoverOpenCloseButton, TestHost> & {
      toggleService: ClrPopoverToggleService;
    };

    describe('TypeScript API', function (this: Context) {
      spec(ClrPopoverOpenCloseButton, TestHost, undefined, {
        providers: [ClrPopoverToggleService],
      });

      beforeEach(function (this: Context) {
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
        this.detectChanges();
      });

      it('declares a ClrPopoverToggleService', function (this: Context) {
        expect(this.toggleService).toBeDefined();
      });

      it('responds to openChange events from the toggleService', function (this: Context) {
        let changeCount = 0;
        const sub: Subscription = this.toggleService.openChange.subscribe(() => {
          changeCount++;
        });
        expect(changeCount).toBe(0); // initial state
        this.clarityElement.click();
        expect(changeCount).toBe(1); // open click
        this.clarityElement.click();
        expect(changeCount).toBe(2); // close click
        sub.unsubscribe();
      });
    });

    describe('Template API', () => {
      spec(ClrPopoverOpenCloseButton, TestHost, undefined, {
        providers: [ClrPopoverToggleService],
      });

      beforeEach(function (this: Context) {
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
        this.detectChanges();
      });

      it('emits events when the open state changes', function (this: Context) {
        expect(this.fixture.componentInstance.openState).toBeUndefined(); // inital state
        this.clarityElement.click();
        expect(this.hostComponent.openState).toEqual(this.toggleService.open);
        expect(this.hostComponent.openState).toBe(true); // opened state
        this.clarityElement.click();
        expect(this.hostComponent.openState).toEqual(this.toggleService.open);
        expect(this.hostComponent.openState).toBe(false); // closed state
      });

      it('handles click events', function (this: Context) {
        const clickSpy = spyOn(this.toggleService, 'toggleWithEvent');
        this.clarityElement.click();
        expect(clickSpy.calls.count()).toEqual(1);
      });
    });

    describe('View Basics', function (this: Context) {
      spec(ClrPopoverOpenCloseButton, TestHost, undefined, {
        providers: [ClrPopoverToggleService],
      });

      it('adds the clr-smart-open-close classname', function (this: Context) {
        expect(this.clarityElement.classList).toContain('clr-smart-open-close');
      });
    });
  });
}
