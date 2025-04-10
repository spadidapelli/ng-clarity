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
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IF_ACTIVE_ID, IfActiveService } from './if-active.service';

@Directive({
  selector: '[clrIfActive]',
})

/**********
 *
 * @class ClrIfActive
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: IfActiveService to maintain state between itself and
 * the component using it in the component template.
 *
 */
export class ClrIfActive implements OnDestroy {
  /**********
   * @property activeChange
   *
   * @description
   * An event emitter that emits when the active property is set to allow for 2way binding when the directive is
   * used with de-structured / de-sugared syntax.
   *
   */
  @Output('clrIfActiveChange') activeChange = new EventEmitter<boolean>(false);

  private subscription: Subscription;
  private wasActive = false;

  constructor(
    private ifActiveService: IfActiveService,
    @Inject(IF_ACTIVE_ID) private id: number,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    this.checkAndUpdateView(ifActiveService.current);

    this.subscription = ifActiveService.currentChange.subscribe(newCurrentId => {
      this.checkAndUpdateView(newCurrentId);
    });
  }

  /**
   * @description
   * A property that gets/sets IfActiveService.active with value.
   *
   */
  @Input('clrIfActive')
  get active() {
    return this.ifActiveService.current === this.id;
  }
  set active(value: boolean | string) {
    if (value) {
      this.ifActiveService.current = this.id;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @description
   * Function that takes a any value and either created an embedded view for the associated ViewContainerRef or,
   * Clears all views from the ViewContainerRef
   */
  updateView(value: boolean) {
    if (value) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
  }

  private checkAndUpdateView(currentId: number) {
    const isNowActive = currentId === this.id;
    // only emit if the new active state is changed since last time.
    if (isNowActive !== this.wasActive) {
      this.updateView(isNowActive);
      this.activeChange.emit(isNowActive);
      this.wasActive = isNowActive;
    }
  }
}
