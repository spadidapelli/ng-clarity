/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subscription } from 'rxjs';

import { TreeNodeModel } from './models/tree-node.model';
import { TreeFocusManagerService } from './tree-focus-manager.service';

class TreeNodeModelMock extends TreeNodeModel<void> {
  parent: TreeNodeModel<void> | null;
  children: TreeNodeModel<void>[];
  expanded = false;
  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
  }
}

// We will build tree model based on the following nested object literals
const treeScheme = {
  id1: {
    id4: {},
    id5: {
      id7: {},
      id8: {},
    },
  },
  id2: {},
  id3: {
    id6: {},
  },
};

// This id model refs would works as key value obj
// so we don't have to traverse the tree to get the model of specific id
// We just need to pass the id to get its model value from this object
const treeIdModelRefs: { [key: string]: any } = {};

// this method will create an actual tree model based on treeScheme
const createTree = (model: any, parent: TreeNodeModelMock): TreeNodeModelMock[] => {
  return Object.keys(model).map(key => {
    const nodeModel = new TreeNodeModelMock(key);
    treeIdModelRefs[key] = nodeModel;
    nodeModel.parent = parent;
    nodeModel.children = createTree(model[key], nodeModel);
    nodeModel.expanded = nodeModel.children && nodeModel.children.length > 0;
    return nodeModel;
  });
};

export default function (): void {
  describe('Tree Focus Manager', () => {
    const treeFocusManager = new TreeFocusManagerService<void>();
    treeFocusManager.rootNodeModels = createTree(treeScheme, null);
    let focusRequestedOnId: string;
    let focusSetOnId: string;
    let focusRequestedSub: Subscription;
    let focusChangeSub: Subscription;

    beforeEach(() => {
      focusRequestedOnId = null;
      focusSetOnId = null;
      focusRequestedSub = treeFocusManager.focusRequest.subscribe((nodeId: string) => {
        focusRequestedOnId = nodeId;
      });
      focusChangeSub = treeFocusManager.focusChange.subscribe((nodeId: string) => {
        focusSetOnId = nodeId;
      });
    });

    afterEach(() => {
      focusRequestedSub.unsubscribe();
      focusChangeSub.unsubscribe();
    });

    it('emits id of node that focus is requested on via focusNode', () => {
      treeFocusManager.focusNode(new TreeNodeModelMock('test-id'));
      expect(focusRequestedOnId).toBe('test-id');
    });

    it('emits id of node that focus is set on via broadcastFocusedNode', () => {
      treeFocusManager.broadcastFocusedNode('test-id');
      expect(focusSetOnId).toBe('test-id');
    });

    it('emits id of first visible node that focus is requested on via focusFirstVisibleNode', () => {
      treeFocusManager.focusFirstVisibleNode();
      expect(focusRequestedOnId).toBe('id1');
    });

    it('emits id of last visible node that focus is requested on via focusLastVisibleNode', () => {
      treeFocusManager.focusLastVisibleNode();
      expect(focusRequestedOnId).toBe('id6');
    });

    it('emits id of parent node via focusParent', () => {
      treeFocusManager.focusParent(treeIdModelRefs.id4);
      expect(focusRequestedOnId).toBe('id1');
    });

    it('emits id of node right above itself if there is one via focusNodeAbove', () => {
      treeFocusManager.focusNodeAbove(treeIdModelRefs.id8);
      expect(focusRequestedOnId).toBe('id7');
    });

    it('emits id of parent node if it is first child via focusNodeAbove', () => {
      treeFocusManager.focusNodeAbove(treeIdModelRefs.id7);
      expect(focusRequestedOnId).toBe('id5');
    });

    it('emits id of last visible child of sibling node above if it is expanded above via focusNodeAbove', () => {
      treeFocusManager.focusNodeAbove(treeIdModelRefs.id2);
      expect(focusRequestedOnId).toBe('id8');
    });

    it('does not emit anything if node is first visible via focusNodeAbove', () => {
      treeFocusManager.focusNodeAbove(treeIdModelRefs.id1);
      expect(focusRequestedOnId).toBeNull();
    });

    it('emits id of node right below itself if there is one via focusNodeBelow', () => {
      treeFocusManager.focusNodeBelow(treeIdModelRefs.id7);
      expect(focusRequestedOnId).toBe('id8');
    });

    it('emits id of first child node if it is expanded and has children via focusNodeBelow', () => {
      treeFocusManager.focusNodeBelow(treeIdModelRefs.id5);
      expect(focusRequestedOnId).toBe('id7');
    });

    it('emits id of parent sibling node below if it is last visible child via focusNodeBelow', () => {
      treeFocusManager.focusNodeBelow(treeIdModelRefs.id8);
      expect(focusRequestedOnId).toBe('id2');
    });

    it('does not emit anything if node is last visible via focusNodeBelow', () => {
      treeFocusManager.focusNodeBelow(treeIdModelRefs.id6);
      expect(focusRequestedOnId).toBeNull();
    });

    it('emits id of first child node that is not disabled via focusNodeBelow', () => {
      treeIdModelRefs.id7.disabled = true;
      treeFocusManager.focusNodeBelow(treeIdModelRefs.id5);
      expect(focusRequestedOnId).toBe('id7');
      treeIdModelRefs.id7.disabled = false;
    });

    it('emits id of parent node when before sibling is disabled via focusNodeAbove', () => {
      treeIdModelRefs.id4.disabled = true;
      treeFocusManager.focusNodeAbove(treeIdModelRefs.id5);
      expect(focusRequestedOnId).toBe('id4');
      treeIdModelRefs.id4.disabled = false;
    });

    describe('.focusNodeStartsWith', () => {
      treeIdModelRefs.id1.textContent = 'one';
      treeIdModelRefs.id2.textContent = 'two';
      treeIdModelRefs.id3.textContent = 'three';
      treeIdModelRefs.id4.textContent = 'four';
      treeIdModelRefs.id5.textContent = 'five';
      treeIdModelRefs.id6.textContent = 'six';
      treeIdModelRefs.id7.textContent = 'seven';
      treeIdModelRefs.id8.textContent = 'eight';

      it('finds and focuses node that starts with given string from children/sibling nodes', () => {
        treeFocusManager.focusNodeStartsWith('eig', treeIdModelRefs.id1);
        expect(focusRequestedOnId).toBe('id8');
        treeFocusManager.focusNodeStartsWith('t', treeIdModelRefs.id1);
        expect(focusRequestedOnId).toBe('id2');
        treeFocusManager.focusNodeStartsWith('th', treeIdModelRefs.id1);
        expect(focusRequestedOnId).toBe('id3');
        treeFocusManager.focusNodeStartsWith('s', treeIdModelRefs.id8);
        expect(focusRequestedOnId).toBe('id7');
      });

      it('finds and focuses node that starts with given string from root node if not found in children/sibling nodes', () => {
        treeFocusManager.focusNodeStartsWith('f', treeIdModelRefs.id7);
        expect(focusRequestedOnId).toBe('id4');
      });

      it('finds and focuses node that starts with given string by skipping nodes that are not expanded', () => {
        treeFocusManager.focusNodeStartsWith('s', treeIdModelRefs.id2);
        expect(focusRequestedOnId).toBe('id6');
        treeIdModelRefs.id3.expanded = false;
        treeFocusManager.focusNodeStartsWith('s', treeIdModelRefs.id2);
        expect(focusRequestedOnId).toBe('id7');
      });
    });
  });
}
