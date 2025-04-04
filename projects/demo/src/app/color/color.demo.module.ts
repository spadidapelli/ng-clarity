/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ColorPalette } from './color-palette';
import { ColorsDemo } from './color.demo';
import { ROUTING } from './color.demo.routing';

@NgModule({
  imports: [CommonModule, ROUTING, ClarityModule],
  declarations: [ColorsDemo, ColorPalette],
  exports: [ColorsDemo, ColorPalette],
})
export class ColorDemoModule {}
