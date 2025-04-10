/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';
import { Point } from '../common/popover';
import { TooltipIdService } from './providers/tooltip-id.service';
import { ClrTooltipContent } from './tooltip-content';
import { ClrTooltipModule } from './tooltip.module';

@Component({
  template: `
    <clr-tooltip>
      <clr-tooltip-content>Hello world</clr-tooltip-content>
    </clr-tooltip>
  `,
})
class DefaultTest {}

@Component({
  template: `
    <clr-tooltip>
      <clr-tooltip-content [id]="idValue">Hello world</clr-tooltip-content>
    </clr-tooltip>
  `,
})
class IdTest {
  idValue;
}

@Component({
  template: `
    <clr-tooltip>
      <clr-tooltip-content [clrPosition]="position" [clrSize]="size">Hello world</clr-tooltip-content>
    </clr-tooltip>
  `,
})
class SimpleTest {
  position: string;
  size: string;
}

interface TooltipContext<H> extends TestContext<ClrTooltipContent, H> {
  toggleService: ClrPopoverToggleService;
  tooltipIdService: TooltipIdService;
}

export default function (): void {
  describe('TooltipContent component', function () {
    describe('Template API', function () {
      describe('defaults', function () {
        spec(ClrTooltipContent, DefaultTest, ClrTooltipModule, {
          providers: [ClrPopoverToggleService, TooltipIdService],
        });

        beforeEach(function (this: TooltipContext<DefaultTest>) {
          this.getClarityProvider(ClrPopoverToggleService).open = true;
          this.tooltipIdService = this.getClarityProvider(TooltipIdService);
          this.detectChanges();
        });

        it('sets the correct default classes', function (this: TooltipContext<DefaultTest>) {
          expect(this.clarityElement.classList).toContain('tooltip-content');
          expect(this.clarityElement.classList).toContain('tooltip-sm');
          expect(this.clarityElement.classList).toContain('tooltip-right');
        });
      });

      describe('handles values for custom id', function () {
        spec(ClrTooltipContent, IdTest, ClrTooltipModule, {
          providers: [ClrPopoverToggleService, TooltipIdService],
        });

        beforeEach(function (this: TooltipContext<IdTest>) {
          this.getClarityProvider(ClrPopoverToggleService).open = true;
          this.tooltipIdService = this.getClarityProvider(TooltipIdService);
          this.detectChanges();
        });

        it('accepts an [id] when an undefined id is provided', function (this: TooltipContext<IdTest>) {
          // IdTest component starts with idValue undefined
          expect(this.clarityElement.getAttribute('id')).toEqual('');
        });

        it('accepts an [id] when a null id is provided', function (this: TooltipContext<IdTest>) {
          this.hostComponent.idValue = null;
          this.detectChanges();
          expect(this.clarityElement.getAttribute('id')).toEqual('');
        });

        it('accepts an [id] when an empty string id is provided', function (this: TooltipContext<IdTest>) {
          this.hostComponent.idValue = '';
          this.detectChanges();
          expect(this.clarityElement.getAttribute('id')).toEqual('');
        });

        it('accepts an [id] when an custom string id is provided', function (this: TooltipContext<IdTest>) {
          this.hostComponent.idValue = 'custom-id';
          this.detectChanges();
          expect(this.clarityElement.getAttribute('id')).toEqual('custom-id');
        });
      });

      describe('handles inputs for position and size', function () {
        spec(ClrTooltipContent, SimpleTest, ClrTooltipModule, {
          providers: [ClrPopoverToggleService, TooltipIdService],
        });

        beforeEach(function (this: TooltipContext<SimpleTest>) {
          this.getClarityProvider(ClrPopoverToggleService).open = true;
          this.tooltipIdService = this.getClarityProvider(TooltipIdService);
          this.detectChanges();
        });

        it('sets an id when no id is provided', function (this: TooltipContext<SimpleTest>) {
          expect(this.clarityDirective.id).toEqual(this.clarityElement.getAttribute('id'));
        });

        it('accepts a [clrPosition] input', function (this: TooltipContext<SimpleTest>) {
          // Default is right
          expect((this.clarityDirective as any).anchorPoint).toEqual(Point.RIGHT_CENTER);
          expect((this.clarityDirective as any).popoverPoint).toEqual(Point.LEFT_TOP);
          expect(this.clarityElement.classList).toContain('tooltip-right');

          this.hostComponent.position = 'bottom-right';
          this.detectChanges();
          expect((this.clarityDirective as any).anchorPoint).toEqual(Point.BOTTOM_CENTER);
          expect((this.clarityDirective as any).popoverPoint).toEqual(Point.LEFT_TOP);
          expect(this.clarityElement.classList).not.toContain('tooltip-right');
          expect(this.clarityElement.classList).toContain('tooltip-bottom-right');

          this.hostComponent.position = 'top-left';
          this.detectChanges();
          expect((this.clarityDirective as any).anchorPoint).toEqual(Point.TOP_CENTER);
          expect((this.clarityDirective as any).popoverPoint).toEqual(Point.RIGHT_BOTTOM);
          expect(this.clarityElement.classList).not.toContain('tooltip-bottom-right');
          expect(this.clarityElement.classList).toContain('tooltip-top-left');
        });

        it('accepts a [clrSize] input', function (this: TooltipContext<SimpleTest>) {
          // Default is small
          expect(this.clarityDirective.size).toEqual('sm');
          expect(this.clarityElement.classList).toContain('tooltip-sm');

          this.hostComponent.size = 'lg';
          this.detectChanges();
          expect(this.clarityDirective.size).toEqual('lg');
          expect(this.clarityElement.classList).not.toContain('tooltip-sm');
          expect(this.clarityElement.classList).toContain('tooltip-lg');
        });
      });
    });

    describe('View basics', function () {
      spec(ClrTooltipContent, SimpleTest, ClrTooltipModule, {
        providers: [ClrPopoverToggleService, TooltipIdService],
      });

      beforeEach(function (this: TooltipContext<SimpleTest>) {
        this.getClarityProvider(ClrPopoverToggleService).open = true;
        this.tooltipIdService = this.getClarityProvider(TooltipIdService);
        this.detectChanges();
      });

      it('projects content', function (this: TooltipContext<SimpleTest>) {
        expect(this.clarityElement.textContent.trim()).toMatch('Hello world');
      });

      it('adds the .tooltip-content class to the host', function (this: TooltipContext<SimpleTest>) {
        expect(this.clarityElement.classList).toContain('tooltip-content');
      });

      it('has the correct role', function (this: TooltipContext<SimpleTest>) {
        expect(this.clarityElement.getAttribute('role')).toBe('tooltip');
      });

      it('has an id', function (this: TooltipContext<SimpleTest>) {
        expect(this.clarityElement.getAttribute('id')).toBeTruthy();
      });
    });
  });
}
