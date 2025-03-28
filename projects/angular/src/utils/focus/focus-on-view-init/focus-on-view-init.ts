/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FOCUS_ON_VIEW_INIT } from './focus-on-view-init.provider';

/*  This directive is for guiding the document focus to the newly added content when its view is initialized
    so that assistive technologies can read its content. */
@Directive({
  selector: '[clrFocusOnViewInit]',
})
export class ClrFocusOnViewInit implements AfterViewInit, OnDestroy {
  private document: Document;
  private directFocus = true; // true if the element gets focused without need to set tabindex;
  private destroy$ = new Subject<void>();
  private _isEnabled: boolean;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(FOCUS_ON_VIEW_INIT) private focusOnViewInit: boolean,
    @Inject(DOCUMENT) document: any,
    private renderer: Renderer2,
    ngZone: NgZone
  ) {
    this._isEnabled = focusOnViewInit;

    // Angular compiler doesn't understand the type Document
    // when working out the metadata for injectable parameters,
    // even though it understands the injection token DOCUMENT
    // https://github.com/angular/angular/issues/20351
    this.document = document;

    ngZone.runOutsideAngular(() =>
      fromEvent(el.nativeElement, 'focusout')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (!this.directFocus) {
            // manually set attributes and styles should be removed
            renderer.removeAttribute(el.nativeElement, 'tabindex');
            renderer.setStyle(el.nativeElement, 'outline', null);
          }
        })
    );
  }

  @Input('clrFocusOnViewInit')
  set isEnabled(value: boolean | string) {
    if (this.focusOnViewInit && typeof value === 'boolean') {
      this._isEnabled = value;
    }
  }

  ngAfterViewInit() {
    this.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private focus() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this._isEnabled) {
      return;
    }
    if (this.document && this.document.activeElement !== this.el.nativeElement) {
      this.el.nativeElement.focus();
      if (this.document.activeElement !== this.el.nativeElement) {
        // if it's not directly focused now, it means it was a non-interactive element
        // so we need to give it a tabindex.
        this.directFocus = false;
        this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
        this.renderer.setStyle(this.el.nativeElement, 'outline', 'none');
        this.el.nativeElement.focus();
      }
    }
  }
}
