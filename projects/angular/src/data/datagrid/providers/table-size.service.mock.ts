/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { TableSizeService } from './table-size.service';

// With this mock service, we could test individual child components of Datagrid that are dependent on TableSizeService.
@Injectable()
export class MockTableSizeService {
  // Currently only this property needed.
  // We could add more properties if necessary in the future
  getColumnDragHeight(): string {
    return '500px';
  }
}

export const MOCK_TABLE_SIZE_PROVIDER = {
  provide: TableSizeService,
  useClass: MockTableSizeService,
};
