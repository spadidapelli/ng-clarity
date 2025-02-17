/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrRangeContainer, ClrRangeModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

export default {
  title: 'Range/Range Container',
  decorators: [
    moduleMetadata({
      imports: [ClrRangeModule],
    }),
  ],
  component: ClrRangeContainer,
  argTypes: {
    // methods
    getRangeProgressFillWidth: { control: { disabled: true }, table: { disable: true } },
    addGrid: { control: { disabled: true }, table: { disable: true } },
    controlClass: { control: { disabled: true }, table: { disable: true } },
    value: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrRangeHasProgress: false,
    // story helpers
    label: 'Options',
    value: 50,
    disabled: false,
  },
};

const rangeTemplate: StoryFn = args => ({
  template: `
    <clr-range-container [clrRangeHasProgress]="clrRangeHasProgress">
      <label>{{ label }}</label>
      <input type="range" clrRange [value]="value" [disabled]="disabled" />
    </clr-range-container>
  `,
  props: args,
});

const rangeAllTemplate: StoryFn = args => ({
  template: `
    <h6>Default Range</h6>
    <clr-range-container [clrRangeHasProgress]="false">
      <label>{{ label }}</label>
      <input type="range" clrRange [value]="value" [disabled]="false" />
    </clr-range-container>

    <h6>Disabled Range</h6>
    <clr-range-container [clrRangeHasProgress]="false">
      <label>{{ label }}</label>
      <input type="range" clrRange [value]="value" [disabled]="true" />
    </clr-range-container>

    <h6>Range with Progress</h6>
    <clr-range-container [clrRangeHasProgress]="true">
      <label>{{ label }}</label>
      <input type="range" clrRange [value]="value" [disabled]="false" />
    </clr-range-container>

    <h6>Disabled Range with Progress</h6>
    <clr-range-container class="compact" [clrRangeHasProgress]="true">
      <label>{{ label }}</label>
      <input type="range" clrRange [value]="value" [disabled]="true" />
    </clr-range-container>
  `,
  props: args,
});

export const Range: StoryObj = {
  render: rangeTemplate,
};

export const ShowcaseRange: StoryObj = {
  render: rangeAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
