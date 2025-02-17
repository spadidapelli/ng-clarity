/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';

import { ClrDatagridHideableColumn } from '../datagrid-hideable-column';
import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { columnStateFactory } from './column-state.provider';
import { ColumnsService } from './columns.service';

class MockHideableColumnTemplateRef extends TemplateRef<ClrDatagridHideableColumn> {
  elementRef = null;
  createEmbeddedView(): EmbeddedViewRef<any> {
    return null;
  }
}

@Injectable()
export class MockColumnsService extends ColumnsService {
  // Sometimes we have to use an actual template ref.
  // In that case, this service should be injected into the test component,
  // and we need to assign the template ref from there.
  templateRef: TemplateRef<any>;

  mockColumns(columnNumber: number) {
    for (let i = 0; i < columnNumber; i++) {
      this.columns.push(columnStateFactory());
    }
  }

  mockHideableAt(index: number, hidden = false) {
    this.emitStateChange(this.columns[index], {
      hideable: true,
      titleTemplateRef: this.templateRef || new MockHideableColumnTemplateRef(),
      hidden: hidden,
      changes: [DatagridColumnChanges.HIDDEN],
    });
  }

  mockAllHideable(hidden = false) {
    this.columns.forEach((_column, index) => this.mockHideableAt(index, hidden));
  }

  mockPartialHideable(from: number, to: number, hidden = false) {
    this.columns.forEach((_column, index) => {
      if (index >= from && index <= to) {
        this.mockHideableAt(index, hidden);
      }
    });
  }
}

export const MOCK_COLUMN_SERVICE_PROVIDER = {
  provide: ColumnsService,
  useClass: MockColumnsService,
};
