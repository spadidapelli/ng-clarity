/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { InputDemo } from './input.demo';
import { ROUTING } from './input.demo.routing';

@NgModule({
  imports: [ClarityModule, FormsModule, ROUTING],
  declarations: [InputDemo],
})
export class InputDemoModule {}
