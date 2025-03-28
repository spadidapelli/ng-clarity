/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, Optional } from '@angular/core';
import { Subscription } from 'rxjs';

import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { TreeNodeModel } from './models/tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';
import { TreeFeaturesService } from './tree-features.service';

@Component({
  selector: 'clr-recursive-children',
  template: `
    <ng-container *ngIf="shouldRender()">
      <ng-container *ngFor="let child of parent?.children || children">
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      </ng-container>
    </ng-container>
  `,
  host: {
    '[attr.role]': 'role', // Safari + VO needs direct relationship between treeitem and group; no element should exist between them
  },
})
/**
 * Internal component, do not export!
 * This is part of the hack to get around https://github.com/angular/angular/issues/15998
 */
export class RecursiveChildren<T> {
  // Offering the option to either give the parent node to recurse potentially lazily,
  // or directly the list of children to display.
  @Input('parent') parent: TreeNodeModel<T>;
  @Input('children') children: TreeNodeModel<T>[];

  subscription: Subscription;
  role: string;

  constructor(public featuresService: TreeFeaturesService<T>, @Optional() private expandService: IfExpandService) {
    if (expandService) {
      this.subscription = expandService.expandChange.subscribe(value => {
        if (!value && this.parent && !featuresService.eager && featuresService.recursion) {
          // In the case of lazy-loading recursive trees, we clear the children on collapse.
          // This is better in case they change between two user interaction, and that way
          // the app itself can decide whether to cache them or not.
          (this.parent as RecursiveTreeNodeModel<T>).clearChildren();
        }
      });
    }
  }

  ngAfterContentInit() {
    this.setAriaRoles();
  }

  shouldRender() {
    return (
      this.featuresService.recursion &&
      // In the smart case, we eagerly render all the recursive children
      // to make sure two-way bindings for selection are available.
      // They will be hidden with CSS by the parent.
      (this.featuresService.eager || !this.expandService || this.expandService.expanded)
    );
  }

  getContext(node: TreeNodeModel<T>): ClrRecursiveForOfContext<T> {
    return {
      $implicit: node.model,
      clrModel: node,
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private setAriaRoles() {
    this.role = this.parent ? 'group' : null;
  }
}
