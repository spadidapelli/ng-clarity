/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EmbeddedViewRef, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { NgControlService } from '../providers/ng-control.service';
import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';

@Directive({
  selector: '[clrIfError]',
})
export class ClrIfError extends AbstractIfState {
  @Input('clrIfError') error: string;

  private embeddedViewRef: EmbeddedViewRef<any>;

  constructor(
    @Optional() ifControlStateService: IfControlStateService,
    @Optional() ngControlService: NgControlService,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    super(ifControlStateService, ngControlService);

    if (!this.ifControlStateService) {
      throw new Error('clrIfError can only be used within a form control container element like clr-input-container');
    }
  }
  /**
   * @param state CONTROL_STATE
   */
  protected override handleState(state: CONTROL_STATE) {
    if (this.error && this.control) {
      this.displayError(this.control.hasError(this.error));
    } else {
      this.displayError(CONTROL_STATE.INVALID === state);
    }
  }

  private displayError(invalid: boolean) {
    /* if no container do nothing */
    if (!this.container) {
      return;
    }
    if (invalid) {
      if (this.displayedContent === false) {
        this.embeddedViewRef = this.container.createEmbeddedView(this.template, {
          error: this.control.getError(this.error),
        });
        this.displayedContent = true;
      } else if (this.embeddedViewRef && this.embeddedViewRef.context) {
        // if view is already rendered, update the error object to keep it in sync
        this.embeddedViewRef.context.error = this.control.getError(this.error);
      }
    } else {
      this.container.clear();
      this.displayedContent = false;
    }
  }
}
