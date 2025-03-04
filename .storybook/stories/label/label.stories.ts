/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryFn, StoryObj } from '@storybook/angular';

const LABEL_COLOR_TYPES = ['', 'label-purple', 'label-blue', 'label-orange', 'label-light-blue'];

const LABEL_STATUS_TYPES = ['label-info', 'label-success', 'label-warning', 'label-danger'];

export default {
  title: 'Label/Label',
  argTypes: {
    // story helpers
    labelType: { control: 'radio', options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
    LABEL_COLOR_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
    LABEL_STATUS_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    // story helpers
    content: 'Hello World!',
    badgeContent: '',
    labelType: '',
    clickable: false,
    closeIcon: false,
    LABEL_COLOR_TYPES,
    LABEL_STATUS_TYPES,
  },
};

const LabelTemplate: StoryFn = args => ({
  template: `
    <span class="label" [class.clickable]="clickable" [ngClass]="labelType">
      <span class="text">{{ content }}</span>
      <span *ngIf="badgeContent" class="badge">{{ badgeContent }}</span>
      <cds-icon *ngIf="closeIcon" shape="close"></cds-icon>
    </span>
  `,
  props: args,
});

const LabelAllTemplate: StoryFn = args => ({
  template: `
    <h6>Default Label</h6>
    <div style="margin-top: 5px">
      <span class="label">{{ content }}</span>
    </div>

    <h6>Color Options</h6>
    <div style="margin-top: 5px">
      <span class="label" *ngFor="let type of LABEL_TYPES" [class]="type">{{ content }}</span>
    </div>

    <h6>Clickable Labels</h6>
    <div style="margin-top: 5px">
      <span class="label clickable" *ngFor="let type of LABEL_COLOR_TYPES" [class]="type">
        <span class="text">{{ content }}</span>
      </span>
    </div>
    <h6>Clickable Anchor Labels</h6>
    <div style="margin-top: 5px">
      <a href="javascript://" class="label clickable" *ngFor="let type of LABEL_COLOR_TYPES" [class]="type">
        <span class="text">{{ content }}</span>
      </a>
    </div>

    <h6>Status Labels</h6>
    <div style="margin-top: 5px">
      <span class="label" *ngFor="let type of LABEL_STATUS_TYPES" [class]="type">{{ content }}</span>
    </div>

    <h6>Labels with Badges</h6>
    <div style="margin-top: 5px">
      <span class="label" *ngFor="let type of LABEL_TYPES" [class]="type">
        <span class="text">{{ content }}</span>
        <span class="badge">1</span>
      </span>
    </div>

    <h6>Labels with Close Icon</h6>
    <div style="margin-top: 5px">
      <span class="label clickable" *ngFor="let type of LABEL_TYPES" [class]="type">
        <span class="text">{{ content }}</span>
        <cds-icon shape="close"></cds-icon>
      </span>
    </div>
  `,
  props: args,
});

export const Label: StoryObj = {
  render: LabelTemplate,
};

export const Showcase: StoryObj = {
  render: LabelAllTemplate,
  args: {
    ...LabelTemplate.args,
    LABEL_TYPES: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
