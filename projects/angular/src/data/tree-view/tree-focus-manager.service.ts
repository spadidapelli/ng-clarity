/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { TreeNodeModel } from './models/tree-node.model';

@Injectable()
export class TreeFocusManagerService<T> {
  rootNodeModels: TreeNodeModel<T>[];

  private focusedNodeId: string;
  private _focusRequest = new Subject<string>();
  private _focusChange = new Subject<string>();

  get focusRequest(): Observable<string> {
    return this._focusRequest.asObservable();
  }

  get focusChange(): Observable<string> {
    return this._focusChange.asObservable();
  }

  focusNode(model: TreeNodeModel<T>): void {
    if (model) {
      this._focusRequest.next(model.nodeId);
    }
  }

  broadcastFocusedNode(nodeId: string): void {
    if (this.focusedNodeId !== nodeId) {
      this.focusedNodeId = nodeId;
      this._focusChange.next(nodeId);
    }
  }

  focusParent(model: TreeNodeModel<T>): void {
    if (model) {
      this.focusNode(model.parent);
    }
  }

  focusFirstVisibleNode(): void {
    const focusModel = this.rootNodeModels && this.rootNodeModels[0];
    this.focusNode(focusModel);
  }

  focusLastVisibleNode(): void {
    this.focusNode(this.findLastVisibleInTree());
  }

  focusNodeAbove(model: TreeNodeModel<T>): void {
    this.focusNode(this.findNodeAbove(model));
  }

  focusNodeBelow(model: TreeNodeModel<T>): void {
    this.focusNode(this.findNodeBelow(model));
  }

  focusNodeStartsWith(searchString: string, model: TreeNodeModel<T>): void {
    this.focusNode(this.findClosestNodeStartsWith(searchString, model));
  }

  private findSiblings(model: TreeNodeModel<T>): TreeNodeModel<T>[] {
    // the method will return not only sibling models but also itself among them
    if (model.parent) {
      return model.parent.children;
    } else {
      return this.rootNodeModels;
    }
  }

  private findLastVisibleInNode(model: TreeNodeModel<T>): TreeNodeModel<T> {
    // the method will traverse through until it finds the last visible node from the given node
    if (!model) {
      return null;
    }
    if (model.expanded && model.children.length > 0) {
      const children = model.children;
      const lastChild = children[children.length - 1];
      return this.findLastVisibleInNode(lastChild);
    } else {
      return model;
    }
  }

  private findNextFocusable(model: TreeNodeModel<T>): TreeNodeModel<T> {
    if (!model) {
      return null;
    }

    const siblings = this.findSiblings(model);
    const selfIndex = siblings.indexOf(model);

    if (selfIndex < siblings.length - 1) {
      return siblings[selfIndex + 1];
    } else if (selfIndex === siblings.length - 1) {
      return this.findNextFocusable(model.parent);
    }
    return null;
  }

  private findLastVisibleInTree(): TreeNodeModel<T> {
    const lastRootNode =
      this.rootNodeModels && this.rootNodeModels.length && this.rootNodeModels[this.rootNodeModels.length - 1];
    return this.findLastVisibleInNode(lastRootNode);
  }

  private findNodeAbove(model: TreeNodeModel<T>): TreeNodeModel<T> {
    if (!model) {
      return null;
    }

    const siblings = this.findSiblings(model);
    const selfIndex = siblings.indexOf(model);

    if (selfIndex === 0) {
      return model.parent;
    } else if (selfIndex > 0) {
      return this.findLastVisibleInNode(siblings[selfIndex - 1]);
    }
    return null;
  }

  private findNodeBelow(model: TreeNodeModel<T>): TreeNodeModel<T> {
    if (!model) {
      return null;
    }

    if (model.expanded && model.children.length > 0) {
      return model.children[0];
    } else {
      return this.findNextFocusable(model);
    }
  }

  private findDescendentNodeStartsWith(searchString: string, model: TreeNodeModel<T>): TreeNodeModel<T> {
    if (model.expanded && model.children.length > 0) {
      for (const childModel of model.children) {
        const found = this.findNodeStartsWith(searchString, childModel);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private findSiblingNodeStartsWith(searchString: string, model: TreeNodeModel<T>): TreeNodeModel<T> {
    const siblings = this.findSiblings(model);
    const selfIndex = siblings.indexOf(model);

    // Look from sibling nodes
    for (let i = selfIndex + 1; i < siblings.length; i++) {
      const siblingModel = siblings[i];
      const found = this.findNodeStartsWith(searchString, siblingModel);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private findRootNodeStartsWith(searchString: string, model: TreeNodeModel<T>): TreeNodeModel<T> {
    for (const rootModel of this.rootNodeModels) {
      // Don't look from a parent yet
      if (model.parent && model.parent === rootModel) {
        continue;
      }

      const found = this.findNodeStartsWith(searchString, rootModel);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private findNodeStartsWith(searchString: string, model: TreeNodeModel<T>): TreeNodeModel<T> {
    if (!model) {
      return null;
    }

    if (model.textContent.startsWith(searchString)) {
      return model;
    }

    return this.findDescendentNodeStartsWith(searchString, model);
  }

  private findClosestNodeStartsWith(searchString: string, model: TreeNodeModel<T>): TreeNodeModel<T> {
    if (!model) {
      return null;
    }

    const foundFromDescendents = this.findDescendentNodeStartsWith(searchString, model);

    if (foundFromDescendents) {
      return foundFromDescendents;
    }

    const foundFromSiblings = this.findSiblingNodeStartsWith(searchString, model);

    if (foundFromSiblings) {
      return foundFromSiblings;
    }

    const foundFromRootNodes = this.findRootNodeStartsWith(searchString, model);

    if (foundFromRootNodes) {
      return foundFromRootNodes;
    }
    // Now look from its own direct parent
    return this.findNodeStartsWith(searchString, model.parent);
  }
}
