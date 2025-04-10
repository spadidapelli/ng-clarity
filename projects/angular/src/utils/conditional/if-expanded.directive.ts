/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IfExpandService } from './if-expanded.service';

@Directive({
  selector: '[clrIfExpanded]',
})
export class ClrIfExpanded implements OnInit, OnDestroy {
  @Output('clrIfExpandedChange') expandedChange = new EventEmitter<boolean>(true);

  private _expanded = false;

  /**
   * Subscriptions to all the services and queries changes
   */
  private _subscriptions: Subscription[] = [];

  constructor(
    @Optional() private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private expand: IfExpandService
  ) {
    this._subscriptions.push(
      expand.expandChange.subscribe(() => {
        this.updateView();
        this.expandedChange.emit(expand.expanded);
      })
    );

    expand.hasExpandTemplate = !!template;
  }

  @Input('clrIfExpanded')
  get expanded(): boolean | string {
    return this._expanded;
  }
  set expanded(value: boolean | string) {
    if (typeof value === 'boolean') {
      this.expand.expanded = value;
      this._expanded = value;
    }
  }

  ngOnInit() {
    this.expand.expandable++;
    this.updateView();
  }

  ngOnDestroy() {
    this.expand.expandable--;
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private updateView() {
    if (this.expand.expanded && this.container.length !== 0) {
      return;
    }
    if (this.template) {
      if (this.expand.expanded) {
        // Should we pass a context? I don't see anything useful to pass right now,
        // but we can come back to it in the future as a solution for additional features.
        this.container.createEmbeddedView(this.template);
      } else {
        // TODO: Move when we move the animation logic to Datagrid Row Expand
        // We clear before the animation is over. Not ideal, but doing better would involve a much heavier
        // process for very little gain. Once Angular animations are dynamic enough, we should be able to
        // get the optimal behavior.
        this.container.clear();
      }
    } else {
      try {
        // If we don't have a template ref, we fallback to a crude display: none for now.
        if (this.expand.expanded) {
          this.renderer.setStyle(this.el.nativeElement, 'display', null);
        } else {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
        }
      } catch (e) {
        // We catch the case where clrIfExpanded was put on a non-DOM element, and we just do nothing
      }
    }
  }
}
