/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdownModule, ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Header/Headers Collapsed',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, ClrDropdownModule],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
};

const HeaderCollapsedTemplate: StoryFn = args => ({
  template: `
    <iframe width="500" src="/iframe.html?args=&id=header-header--header&viewMode=story" style="border: none"></iframe>
  `,
  props: args,
});

export const HeaderCollapsed: StoryObj = {
  render: HeaderCollapsedTemplate,
};
