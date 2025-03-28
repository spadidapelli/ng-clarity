/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineStepIdService } from './providers/timeline-step-id.service';
import { ClrTimelineStepTitle } from './timeline-step-title';

export default function (): void {
  describe('ClrTimelineStepTitle', () => {
    let fixture: ComponentFixture<TestTimelineStepTitle>;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ClrTimelineStepTitle, TestTimelineStepTitle],
        providers: [TimelineStepIdService],
      });

      fixture = TestBed.createComponent(TestTimelineStepTitle);
      fixture.detectChanges();

      nativeElement = fixture.nativeElement.querySelector('clr-timeline-step-title');
    });

    describe('Template API', () => {
      it('should add host classes', () => {
        expect(nativeElement.className).toContain('clr-timeline-step-title');
      });

      it('adds the aria-hidden attribute', () => {
        expect(nativeElement.getAttribute('aria-hidden')).toBeTruthy();
      });
    });

    describe('View', () => {
      it('should project content', () => {
        expect(nativeElement.textContent.trim()).toContain('Title Content');
      });
    });
  });
}

@Component({
  template: `<clr-timeline-step-title>Title Content</clr-timeline-step-title>`,
})
class TestTimelineStepTitle {}
