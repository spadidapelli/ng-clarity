/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Inject } from '@angular/core';

import { IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER, IfActiveService } from '../../utils/conditional/if-active.service';
import { TabsService } from './providers/tabs.service';
import { ClrTabContent } from './tab-content';
import { ClrTabLink } from './tab-link.directive';

@Component({
  selector: 'clr-tab',
  template: `<ng-content></ng-content>`,
  providers: [IF_ACTIVE_ID_PROVIDER],
})
export class ClrTab {
  @ContentChild(ClrTabLink, { static: true }) tabLink: ClrTabLink;
  @ContentChild(ClrTabContent, { static: true }) tabContent: ClrTabContent;

  constructor(
    public ifActiveService: IfActiveService,
    @Inject(IF_ACTIVE_ID) public id: number,
    private tabsService: TabsService
  ) {
    tabsService.register(this);
  }

  get active() {
    return this.ifActiveService.current === this.id;
  }

  ngOnDestroy() {
    this.tabsService.unregister(this);
  }
}
