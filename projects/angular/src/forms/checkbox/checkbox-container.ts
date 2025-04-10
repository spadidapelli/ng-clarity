/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Component, ContentChildren, Input, Optional, QueryList } from '@angular/core';

import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ContainerIdService } from '../common/providers/container-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrCheckbox } from './checkbox';

@Component({
  selector: 'clr-checkbox-container,clr-toggle-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      <div *ngIf="showHelper" class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper"></ng-content>
      </div>
      <div *ngIf="showInvalid || showValid" class="clr-subtext-wrapper">
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'allCheckboxesDisabled',
    '[class.clr-row]': 'addGrid()',
    '[attr.role]': 'role',
  },
  providers: [IfControlStateService, NgControlService, ControlClassService, ContainerIdService],
})
export class ClrCheckboxContainer extends ClrAbstractContainer implements AfterContentInit {
  role: string;

  @ContentChildren(ClrCheckbox, { descendants: true }) checkboxes: QueryList<ClrCheckbox>;

  private inline = false;

  constructor(
    @Optional() protected override layoutService: LayoutService,
    protected override controlClassService: ControlClassService,
    protected override ngControlService: NgControlService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);
  }

  /*
   * Here we want to support the following cases
   * clrInline - true by presence
   * clrInline="true|false" - unless it is explicitly false, strings are considered true
   * [clrInline]="true|false" - expect a boolean
   */
  @Input()
  get clrInline() {
    return this.inline;
  }
  set clrInline(value: boolean | string) {
    if (typeof value === 'string') {
      this.inline = value === 'false' ? false : true;
    } else {
      this.inline = !!value;
    }
  }

  protected get allCheckboxesDisabled() {
    return (
      this.control?.disabled &&
      (!this.additionalControls?.length || this.additionalControls.every(control => control.disabled))
    );
  }

  override ngAfterContentInit() {
    this.setAriaRoles();
  }

  private setAriaRoles() {
    this.role = this.checkboxes.length ? 'group' : null;
  }
}
