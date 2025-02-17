/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatepickerCSSRegressionDemo } from './css-regression';
import { DatepickerAKDemo } from './datepicker-AK';
import { DatepickerARDemo } from './datepicker-AR';
import { DatepickerDateInputDemo } from './datepicker-date-input';
import { DatepickerDateInputExplicitWrapperDemo } from './datepicker-date-input-explicit-wrapper';
import { DatepickerDEDemo } from './datepicker-DE';
import { DatepickerHIDemo } from './datepicker-HI';
import { DatepickerHRDemo } from './datepicker-hr';
import { DatepickerInReactiveForms } from './datepicker-in-reactive-forms';
import { DatepickerInTemplateDrivenFormsDemo } from './datepicker-in-template-driven-forms';
import { DatepickerKKJDemo } from './datepicker-KKJ';
import { DatepickerLocaleData } from './datepicker-locale-data';
import { DatepickerMinMaxDemo } from './datepicker-min-max';
import { DatePickerWithActionButtonsDemo } from './datepicker-with-action-buttons';
import { DatepickerDemo } from './datepicker.demo';
import { DateRangePickerDemo } from './daterangepicker';
import { DisabledDemo } from './disabled';
import { DatepickerLayoutDemo } from './layout';
import { NgModelAutoWrappedDatepickerDemo } from './ngmodel-auto-wrapped';
import { NgModelExplicitWrapperDemo } from './ngmodel-wrapper-explicit-wrapper';

const ROUTES: Routes = [
  {
    path: '',
    component: DatepickerDemo,
    children: [
      { path: '', redirectTo: 'ng-model-auto-wrapped', pathMatch: 'full' },
      { path: 'ng-model-auto-wrapped', component: NgModelAutoWrappedDatepickerDemo },
      { path: 'ng-model-wrapper-present', component: NgModelExplicitWrapperDemo },
      { path: 'datepicker-date-input', component: DatepickerDateInputDemo },
      { path: 'datepicker-date-input-wrapper-present', component: DatepickerDateInputExplicitWrapperDemo },
      { path: 'template-driven-forms', component: DatepickerInTemplateDrivenFormsDemo },
      { path: 'reactive-forms', component: DatepickerInReactiveForms },
      { path: 'css-regression', component: DatepickerCSSRegressionDemo },
      { path: 'disabled', component: DisabledDemo },
      { path: 'layout', component: DatepickerLayoutDemo },
      { path: 'datepicker-min-max', component: DatepickerMinMaxDemo },
      { path: 'date-range-picker', component: DateRangePickerDemo },
      { path: 'with-action-buttons', component: DatePickerWithActionButtonsDemo },
      {
        path: 'locale-data',
        component: DatepickerLocaleData,
        children: [
          { path: '', redirectTo: 'de', pathMatch: 'full' },
          { path: 'de', component: DatepickerDEDemo },
          { path: 'hi', component: DatepickerHIDemo },
          { path: 'ak', component: DatepickerAKDemo },
          { path: 'ar', component: DatepickerARDemo },
          { path: 'kkj', component: DatepickerKKJDemo },
          { path: 'hr', component: DatepickerHRDemo },
        ],
      },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
