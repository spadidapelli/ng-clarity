/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  ContentChild,
  ContentChildren,
  Directive,
  forwardRef,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ColumnsService } from '../providers/columns.service';
import { DatagridCellRenderer } from './cell-renderer';

@Directive({
  selector: 'clr-dg-row, clr-dg-row-detail',
})
export class DatagridRowRenderer implements AfterContentInit, OnDestroy {
  @ContentChildren(DatagridCellRenderer) cells: QueryList<DatagridCellRenderer>;
  @ContentChild(forwardRef(() => DatagridRowRenderer)) expandableRow: DatagridRowRenderer;

  private subscriptions: Subscription[] = [];

  constructor(private columnsService: ColumnsService) {}

  ngAfterContentInit() {
    this.setCellsState(); // case #3 and #4
    this.subscriptions.push(
      this.cells.changes.subscribe(() => {
        this.setCellsState(); // case #2
        // Note on case #2: In the case of dynamic columns, when one column (header/cell together) gets deleted,
        // this.cells.changes emits before this.columnsService.columns gets updated in MainRenderer
        // when this.headers.changes emits as well. So that means there will be n+1 column state providers
        // when this.cells.changes emits. Hence, we should quit earlier there. But this method will be called
        // right after again when this.headers.changes emits. By then, there will be the same number of column state
        // providers as column headers.
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setCellsState() {
    // This method runs in four cases:
    // 1. When the initial rows appear on the first page.
    //    In this case, the method will be called in DatagridMainRenderer.
    // 2. When columns (corresponding header/cells) get added and deleted.
    //    In this case, the method will be called in DatagridMainRenderer. (Read the note on this case above).
    // 3. When rows load asynchronously.
    //    In this case, the method will be called in this class.
    // 4. When rows load after switching pages.
    //    In this case, the method will be called in this class (Basically, same as the case 3).
    if (this.cells.length === this.columnsService.columns.length) {
      this.cells.forEach((cell, index) => {
        if (this.columnsService.columns[index]) {
          cell.resetState(this.columnsService.columns[index].value);
        }
      });
    }
  }
}
