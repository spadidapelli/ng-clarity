/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Optional } from '@angular/core';

import { ClrAbstractControl, CONTROL_SUFFIX } from './abstract-control';
import { ContainerIdService } from './providers/container-id.service';
import { ControlIdService } from './providers/control-id.service';

@Component({
  selector: 'clr-control-success',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.clr-subtext]': 'true',
    '[class.success]': 'true',
    '[attr.id]': 'id',
  },
})
export class ClrControlSuccess extends ClrAbstractControl {
  override controlIdSuffix = CONTROL_SUFFIX.SUCCESS;

  constructor(
    @Optional() protected override controlIdService: ControlIdService,
    @Optional() protected override containerIdService: ContainerIdService
  ) {
    super(controlIdService, containerIdService);
  }
}
