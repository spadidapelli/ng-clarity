/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-binding-properties-demo',
  providers: [Inventory],
  templateUrl: 'expandable-rows.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridExpandableRowsDemo {
  users: User[];
  selected: User[];
  detail = 'columns';
  replace = false;
  fixedHeight = false;
  slowLoad = false;
  date = false;
  removeRowDetail = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  get selectable() {
    return !!this.selected;
  }
  set selectable(value: boolean) {
    if (value) {
      this.selected = [];
    } else {
      delete this.selected;
    }
  }
}
