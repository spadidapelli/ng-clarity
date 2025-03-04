/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { DatagridColumnChanges } from './enums/column-changes.enum';
import { ColumnState } from './interfaces/column-state.interface';
import { COLUMN_STATE } from './providers/column-state.provider';
import { ColumnsService } from './providers/columns.service';

@Directive({
  selector: '[clrDgHideableColumn]',
})

/**
 *
 * @description
 * A structural directive meant to be used inside a clr-dg-column component.
 *
 * <clr-dg-column>
 *       <ng-container *clrDgHideableColumn="{ hidden: true }">
 *           User ID
 *       </ng-container>
 *   </clr-dg-column>
 *
 * It sets up state and properties so that columns can be manges for hide/show by a service and an internal
 * datagrid toggle component.
 *
 */
export class ClrDatagridHideableColumn implements OnDestroy {
  @Output('clrDgHiddenChange') hiddenChange = new EventEmitter<boolean>();

  /**
   *
   * @description
   * Used to initialize the column with either hidden or visible state.
   *
   */
  private _hidden: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private titleTemplateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    private columnsService: ColumnsService,
    @Optional()
    @Inject(COLUMN_STATE)
    private columnState: BehaviorSubject<ColumnState>
  ) {
    viewContainerRef.createEmbeddedView(titleTemplateRef);

    if (!columnState) {
      throw new Error('The *clrDgHideableColumn directive can only be used inside of a clr-dg-column component.');
    }
  }

  /**
   *
   * @description
   * Setter fn for the @Input with the same name as this structural directive.
   * It allows the user to pre-configure the column's hide/show state. { hidden: true }
   * It's more verbose but has more Clarity.
   *
   * @example
   * *clrDgHideableColumn
   * *clrDgHideableColumn={hidden: false}
   * *clrDgHideableColumn={hidden: true}
   *
   */
  @Input('clrDgHideableColumn')
  set clrDgHideableColumn(value: { hidden: boolean } | string) {
    if (typeof value === 'string') {
      this.clrDgHidden = false;
      return;
    }
    this.clrDgHidden = value && value.hidden ? value.hidden : false;
  }

  @Input('clrDgHidden')
  set clrDgHidden(hidden: boolean) {
    this._hidden = hidden ? hidden : false;
    this.columnsService.emitStateChange(this.columnState, {
      hidden: this._hidden,
      changes: [DatagridColumnChanges.HIDDEN],
    });
  }

  ngOnInit() {
    this.columnsService.emitStateChange(this.columnState, {
      hideable: true,
      titleTemplateRef: this.titleTemplateRef,
      hidden: this._hidden,
      changes: [DatagridColumnChanges.HIDDEN],
    });

    this.subscriptions.push(
      this.columnState.subscribe((state: ColumnState) => {
        if (state.changes && state.changes.indexOf(DatagridColumnChanges.HIDDEN) > -1) {
          this.hiddenChange.emit(state.hidden); // Can emit through @Output when desugared syntax is used
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
