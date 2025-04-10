/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrDatagridCell } from './datagrid-cell';
import { TestContext } from './helpers.spec';
import { DatagridRenderOrganizer } from './render/render-organizer';

export default function (): void {
  describe('ClrDatagridCell component', function () {
    let context: TestContext<ClrDatagridCell, SimpleTest>;

    beforeEach(function () {
      context = this.create(ClrDatagridCell, SimpleTest, [DatagridRenderOrganizer]);
    });

    afterEach(() => {
      context.fixture.destroy();
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
    });

    it('provides a wrapped view for the content', function () {
      this.directive = context.clarityDirective;
      expect(this.directive._view).toBeDefined();
    });

    it('projects content', function () {
      expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
    });

    it('adds the .datagrid-cell class to the host', function () {
      expect(context.clarityElement.classList.contains('datagrid-cell')).toBeTruthy();
    });

    it('does only adds .datagrid-signpost-trigger class when there is a signpost', function () {
      expect(context.clarityElement.classList.contains('datagrid-signpost-trigger')).toBeFalsy();
      context.testComponent.signpostTest = true;
      context.detectChanges();
      expect(context.clarityElement.classList.contains('datagrid-signpost-trigger')).toBeTruthy();
    });

    it('adds a11y roles to the cell', function () {
      expect(context.clarityElement.attributes.role.value).toBe('gridcell');
    });
  });
}

@Component({
  template: `
    <clr-dg-cell>
      Hello world
      <clr-signpost *ngIf="signpostTest">
        <clr-signpost-content *clrIfOpen>The user is strong.</clr-signpost-content>
      </clr-signpost>
    </clr-dg-cell>
  `,
})
class SimpleTest {
  signpostTest = false;
}
