/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTabs, ClrTabsModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { TabsLayout } from '../../../projects/angular/src/layout/tabs/enums/tabs-layout.enum';

export default {
  title: 'Tabs/Tabs',
  decorators: [
    moduleMetadata({
      imports: [ClrTabsModule],
    }),
  ],
  component: ClrTabs,
  argTypes: {
    // inputs
    clrLayout: { control: 'inline-radio', options: TabsLayout },
    // methods
    closeOnEscapeKey: { control: { disable: true }, table: { disable: true } },
    closeOnFocusOut: { control: { disable: true }, table: { disable: true } },
    closeOnOutsideClick: { control: { disable: true }, table: { disable: true } },
    openOverflowOnFocus: { control: { disable: true }, table: { disable: true } },
    resetKeyFocusCurrentToActive: { control: { disable: true }, table: { disable: true } },
    toggleOverflowOnClick: { control: { disable: true }, table: { disable: true } },
    toggleOverflowOnPosition: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    tabCount: { control: { type: 'number', min: 1, max: 100 } },
    activeTab: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrLayout: TabsLayout.HORIZONTAL,
    // story helpers
    createArray: n => new Array(n),
    tabCount: 4,
    activeTab: 1,
    title: 'Tab',
    content: 'Tab Content',
  },
};

const tabsTemplate: StoryFn = args => ({
  template: `
    <clr-tabs [clrLayout]="clrLayout">
      <clr-tab *ngFor="let _ of createArray(tabCount); let i = index">
        <button clrTabLink>{{ title }} {{ i + 1 }}</button>
        <clr-tab-content *clrIfActive="activeTab === i + 1">
          <p>{{ content }} {{ i + 1 }}</p>
        </clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
  props: { ...args },
});

export const Tabs: StoryObj = {
  render: tabsTemplate,
};

export const VerticalTabs: StoryObj = {
  render: tabsTemplate,
  args: {
    clrLayout: TabsLayout.VERTICAL,
  },
};

export const TabsResponsive: StoryObj = {
  render: tabsTemplate,
  parameters: {
    viewport: {
      defaultViewport: 'large',
    },
  },
};
