/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrPopoverPositions } from '../../../utils/popover/enums/positions.enum';
import { ClrPopoverPosition } from '../../../utils/popover/interfaces/popover-position.interface';

const enum DatepickerViewEnum {
  MONTHVIEW = 'MONTHVIEW',
  YEARVIEW = 'YEARVIEW',
  DAYVIEW = 'DAYVIEW',
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
@Injectable()
export class ViewManagerService {
  position: ClrPopoverPosition = ClrPopoverPositions['bottom-left'];

  private _currentView: DatepickerViewEnum = DatepickerViewEnum.DAYVIEW;

  get isDayView(): boolean {
    return this._currentView === DatepickerViewEnum.DAYVIEW;
  }

  get isYearView(): boolean {
    return this._currentView === DatepickerViewEnum.YEARVIEW;
  }

  get isMonthView(): boolean {
    return this._currentView === DatepickerViewEnum.MONTHVIEW;
  }

  changeToMonthView(): void {
    this._currentView = DatepickerViewEnum.MONTHVIEW;
  }

  changeToYearView(): void {
    this._currentView = DatepickerViewEnum.YEARVIEW;
  }

  changeToDayView(): void {
    this._currentView = DatepickerViewEnum.DAYVIEW;
  }
}
