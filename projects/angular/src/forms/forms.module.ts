/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrCheckboxModule } from './checkbox/checkbox.module';
import { ClrComboboxModule } from './combobox/combobox.module';
import { ClrCommonFormsModule } from './common/common.module';
import { ClrDatalistModule } from './datalist/datalist.module';
import { ClrDatepickerModule } from './datepicker/datepicker.module';
import { ClrFileInputModule } from './file-input';
import { ClrInputModule } from './input/input.module';
import { ClrNumberInputModule } from './number-input/number-input.module';
import { ClrPasswordModule } from './password/password.module';
import { ClrRadioModule } from './radio/radio.module';
import { ClrRangeModule } from './range/range.module';
import { ClrSelectModule } from './select/select.module';
import { ClrTextareaModule } from './textarea/textarea.module';

@NgModule({
  imports: [CommonModule],
  exports: [
    ClrCommonFormsModule,
    ClrCheckboxModule,
    ClrComboboxModule,
    ClrDatepickerModule,
    ClrFileInputModule,
    ClrInputModule,
    ClrPasswordModule,
    ClrRadioModule,
    ClrSelectModule,
    ClrTextareaModule,
    ClrRangeModule,
    ClrDatalistModule,
    ClrNumberInputModule,
  ],
})
export class ClrFormsModule {}
