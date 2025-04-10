/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { AsyncInfiniteTree } from '../utils/async-infinite-tree';
import { InfiniteTree } from '../utils/infinite-tree';

@Component({
  selector: 'clr-lazy-recursive-tree-demo',
  styleUrls: ['../tree-view.demo.scss'],
  templateUrl: './lazy-recursive-tree.html',
})
export class LazyRecursiveTreeDemo {
  tree = new InfiniteTree(3);
  asyncTree = new AsyncInfiniteTree(3, 500);
  lazierTree = new AsyncInfiniteTree(3, 500);

  synchronousChildren = (node: string) => this.tree.getChildren(node);
  asynchronousChildren = (node: string) => this.asyncTree.fetchChildren(node);
  lazierChildren = (node: string) => this.lazierTree.fetchChildren(node);
}
