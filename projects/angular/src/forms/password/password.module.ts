/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon, eyeHideIcon, eyeIcon } from '@cds/core/icon';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
  declarations: [ClrPassword, ClrPasswordContainer],
  exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer],
})
export class ClrPasswordModule {
  constructor() {
    ClarityIcons.addIcons(eyeHideIcon, eyeIcon, exclamationCircleIcon, checkCircleIcon);
  }
}
