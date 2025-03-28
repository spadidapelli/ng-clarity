/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ContentChildren, Directive, HostListener, Input, QueryList } from '@angular/core';

import { ClrLabel } from './label';
import { LayoutService } from './providers/layout.service';
import { MarkControlService } from './providers/mark-control.service';

@Directive({
  selector: '[clrForm]',
  providers: [LayoutService, MarkControlService],
  host: {
    '[class.clr-form]': 'true',
    '[class.clr-form-horizontal]': 'layoutService.isHorizontal()',
    '[class.clr-form-compact]': 'layoutService.isCompact()',
  },
})
export class ClrForm {
  @ContentChildren(ClrLabel, { descendants: true }) labels: QueryList<ClrLabel>;

  constructor(public layoutService: LayoutService, private markControlService: MarkControlService) {}

  @Input('clrLabelSize')
  set labelSize(size: number | string) {
    const sizeNumber = parseInt(size as string, 10) || 2;
    this.layoutService.labelSize = sizeNumber;
  }

  @HostListener('submit')
  onFormSubmit() {
    this.markAsTouched();
  }

  // Trying to avoid adding an input and keep this backwards compatible at the same time
  markAsTouched() {
    this.markControlService.markAsTouched();
  }
}
