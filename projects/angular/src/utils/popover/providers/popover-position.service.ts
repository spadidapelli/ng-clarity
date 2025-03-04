/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ClrAxis } from '../enums/axis.enum';
import { ClrViewportViolation } from '../enums/viewport-violation.enum';
import { ClrPopoverContentOffset } from '../interfaces/popover-content-offset.interface';
import { ClrPopoverPosition } from '../interfaces/popover-position.interface';
import { align, flipSides, flipSidesAndNudgeContent, nudgeContent, testVisibility } from '../position-operators';
import { ClrPopoverEventsService } from './popover-events.service';

@Injectable()
export class ClrPopoverPositionService {
  position: ClrPopoverPosition;
  shouldRealign: Observable<void>;

  private currentAnchorCoords: ClientRect;
  private currentContentCoords: ClientRect;
  private contentOffsets: ClrPopoverContentOffset;
  private _shouldRealign = new Subject<void>();

  constructor(private eventService: ClrPopoverEventsService, @Inject(PLATFORM_ID) public platformId: any) {
    this.shouldRealign = this._shouldRealign.asObservable();
  }

  realign() {
    this._shouldRealign.next();
  }

  alignContent(content: HTMLElement): ClrPopoverContentOffset {
    if (!isPlatformBrowser(this.platformId)) {
      // Only position when in a browser.
      // Default to the browser origin and prevent getBoundingClientRect from running.
      return {
        xOffset: 0,
        yOffset: 0,
      };
    }

    this.currentAnchorCoords = this.eventService.anchorButtonRef.nativeElement.getBoundingClientRect();
    this.currentContentCoords = content.getBoundingClientRect();
    this.contentOffsets = align(this.position, this.currentAnchorCoords, this.currentContentCoords);

    const visibilityViolations: ClrViewportViolation[] = testVisibility(this.contentOffsets, this.currentContentCoords);
    /**
     * Calculate the sum of viewport errors. This calculation is used below with the provided Axis in the given
     * ClrPopoverPosition. Its worth putting the ClrViewportViolation enum values here:
     *
     *   BOTTOM = 0,
     *   LEFT = 1,
     *   RIGHT = 2,
     *   TOP = 3,
     *
     *   So, this.visibilityViolations.length tells us how many sides of the viewport that the popover content was
     *   clipped on. We can only help when the content has an issue on one or two sides.
     *   errorSum is calculated to determine _how_ to change the position. Looking at both the axis and the number
     *   of violations I can use the errorSum to determine how to transform the position (on the fly) and adjust
     *   where it can be improved.
     *
     *   Note, more than 3 viewport violations and there isn't anything we can do to help. Also when there are two
     *   violations, we can't help if the violations are TOP+BOTTOM || LEFT+RIGHT => There is no transformation we
     *   can make to the position that will help.
     *
     *   Some examples:
     *   There is only one error and Primary axis is VERTICAL
     *   - this.handleVerticalAxisOneViolation has a switch that will use the error sum to apply the correct
     *   transform to the position based on the reduction of visibilityViolations.
     *
     *   There are two errors and Primary axis is HORIZONTAL
     *   - handleHorizontalAxisTwoViolations has a switch that uses the error sum to apply both transforms needed to
     *   improve the content position based on the reduction of visibilityViolations.
     */

    const errorSum = visibilityViolations.reduce((count, current) => {
      return count + current;
    }, 0);

    if (visibilityViolations.length === 1 && this.position.axis === ClrAxis.VERTICAL) {
      // When primary axis is VERTICAL and there is one viewport violation
      this.handleVerticalAxisOneViolation(errorSum);
    } else if (visibilityViolations.length === 1 && this.position.axis === ClrAxis.HORIZONTAL) {
      // When primary axis is HORIZONTAL and there is one viewport violation
      this.handleHorizontalAxisOneViolation(errorSum);
    } else if (visibilityViolations.length === 2 && this.position.axis === ClrAxis.VERTICAL) {
      // When primary axis is VERTICAL and there are two viewport violations
      this.handleVerticalAxisTwoViolations(errorSum);
    } else if (visibilityViolations.length === 2 && this.position.axis === ClrAxis.HORIZONTAL) {
      // When primary axis is HORIZONTAL and there are two viewport violations
      this.handleHorizontalAxisTwoViolations(errorSum);
    }

    /**
     * Adjusts popover position based on scroll value by adding the negative 'top' value of currentContentCoords to yOffset for proper alignment.
     * - The negative value means that the 'top' of the content is scrolled out of view at the top of the viewport.
     */
    if (this.currentContentCoords.top < 0) {
      this.contentOffsets.yOffset += Math.abs(this.currentContentCoords.top);
    }

    /**
     * This detects the condition where the popover is flipped because it would violate the bottom of the viewport, but flipping it results in the
     * popover rendering above the top of the body (y coordinate outside the body). In that event, it should be rendered within the body
     * as much as possible, so this logic sets the top of popover to render touching the top of the body.
     */
    if (this.contentOffsets.yOffset + this.currentAnchorCoords.y < 0) {
      this.contentOffsets.yOffset = 0 - this.currentContentCoords.top;
    }

    return this.contentOffsets;
  }

  private handleVerticalAxisOneViolation(errorSum: number): void {
    switch (errorSum) {
      case 0:
      case 3: {
        // BOTTOM(0) or TOP(3) are primary violations and we can just flip sides
        this.contentOffsets = align(flipSides(this.position), this.currentAnchorCoords, this.currentContentCoords);
        break;
      }
      case 1: {
        // LEFT(1) is secondary and needs to nudge content right
        this.contentOffsets = align(this.position, this.currentAnchorCoords, this.currentContentCoords);

        /**
         * Even with the nudge we still have a problem. We need to check if the content is going to be clipped
         */
        if (this.contentOffsets.xOffset < 0) {
          this.contentOffsets.xOffset = 10;
        }

        break;
      }
      case 2: {
        // RIGHT(2) is secondary and  needs to nudge content left
        this.contentOffsets = align(
          nudgeContent(this.position, true),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  private handleVerticalAxisTwoViolations(errorSum: number): void {
    switch (errorSum) {
      // We know there are two violations. We can use the errorSum to determine which combination of sides were
      // violated and handle appropriately.
      case 5: {
        // TOP(3)+RIGHT(2) is case 5. We need to flip sides and nudge the content to the left
        const flipAndNudgeLeft = flipSidesAndNudgeContent(flipSides, nudgeContent, true);
        this.contentOffsets = align(
          flipAndNudgeLeft(this.position),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      case 4: {
        //TOP(3)+LEFT(1) is case 4, we need to flip sides and nudge content to the right
        const flipAndNudgeRight = flipSidesAndNudgeContent(flipSides, nudgeContent, false);
        this.contentOffsets = align(
          flipAndNudgeRight(this.position),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      case 3: {
        // TOP(3)+BOTTOM(0) || left(1)+RIGHT(2) is case 3. There is nothing we can do position wise to improve the
        // placement for this content.
        break;
      }
      case 2: {
        // BOTTOM(0)+RIGHT(2) is case 2. We need to flip sides and nudge the content to the left
        const flipAndNudgeLeft = flipSidesAndNudgeContent(flipSides, nudgeContent, true);
        this.contentOffsets = align(
          flipAndNudgeLeft(this.position),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      case 1: {
        // BOTTOM(0)+LEFT(1) is case 1. We need to flip sides and nudge to the right
        const flipAndNudgeRight = flipSidesAndNudgeContent(flipSides, nudgeContent, false);
        this.contentOffsets = align(
          flipAndNudgeRight(this.position),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  private handleHorizontalAxisOneViolation(errorSum: number): void {
    switch (errorSum) {
      case 1:
      case 2: {
        // LEFT(1) and RIGHT(2) are primary violations so we can flip sides
        this.contentOffsets = align(flipSides(this.position), this.currentAnchorCoords, this.currentContentCoords);
        break;
      }
      case 0: {
        // BOTTOM(0) is a secondary violation and we need to nudge content up
        this.contentOffsets = align(
          nudgeContent(this.position, true),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      case 3: {
        // TOP(3) is a secondary violation and we need to nudge content down
        this.contentOffsets = align(nudgeContent(this.position), this.currentAnchorCoords, this.currentContentCoords);
        break;
      }
      default: {
        break;
      }
    }
  }

  private handleHorizontalAxisTwoViolations(errorSum: number): void {
    switch (errorSum) {
      case 5:
      case 4: {
        // TOP(3)+LEFT(1) is case 4.
        // TOP(3)+RIGHT(2) is case 5.
        // In both of these cases we need to flip sides and nudge content down
        const flipAndNudgeDown = flipSidesAndNudgeContent(flipSides, nudgeContent, false);
        this.contentOffsets = align(
          flipAndNudgeDown(this.position),
          this.currentAnchorCoords,
          this.currentContentCoords
        );
        break;
      }
      case 3: {
        // TOP(3)+BOTTOM(0) || left(1)+RIGHT(2) is case 3. There is nothing we can do position wise to improve the
        // placement for this content.
        break;
      }
      case 2:
      case 1: {
        // BOTTOM(0)+RIGHT(2) is case 2.
        // BOTTOM(0)+LEFT(1) is case 1.
        // In both cases we  need to flip sides and nudge content up
        const flipAndNudgeUp = flipSidesAndNudgeContent(flipSides, nudgeContent, true);
        this.contentOffsets = align(flipAndNudgeUp(this.position), this.currentAnchorCoords, this.currentContentCoords);
        break;
      }
      default: {
        break;
      }
    }
  }
}
