/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

let wizardHeaderActionIndex = 0;

@Component({
  selector: 'clr-wizard-header-action',
  template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `,
  host: { class: 'clr-wizard-header-action-wrapper' },
})
export class ClrWizardHeaderAction {
  // title is explanatory text added to the header action
  @Input('title') title = '';

  // If our host has an ID attribute, we use this instead of our index.
  @Input('id') _id: string = (wizardHeaderActionIndex++).toString();

  @Input('clrWizardHeaderActionDisabled') disabled = false;

  @Output('actionClicked') headerActionClicked = new EventEmitter<string>(false);

  get id(): string {
    return `clr-wizard-header-action-${this._id}`;
  }

  click(): void {
    if (this.disabled) {
      return;
    }

    // passing the header action id allows users to have one method that
    // routes to many different actions based on the type of header action
    // clicked. this is further aided by users being able to specify ids
    // for their header actions.
    this.headerActionClicked.emit(this._id);
  }
}
