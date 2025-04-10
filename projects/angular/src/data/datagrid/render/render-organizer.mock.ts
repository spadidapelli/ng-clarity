/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { DatagridRenderStep } from '../enums/render-step.enum';
import { DatagridRenderOrganizer } from './render-organizer';

/**
 * Mock that gives direct access to the subjects, to trigger specific parts of the render cycle.
 */
@Injectable()
export class MockDatagridRenderOrganizer extends DatagridRenderOrganizer {
  get updateRenderStep(): Subject<DatagridRenderStep> {
    return this._renderStep;
  }
}

export const MOCK_ORGANIZER_PROVIDER = {
  provide: DatagridRenderOrganizer,
  useClass: MockDatagridRenderOrganizer,
};
