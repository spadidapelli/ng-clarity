/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, AnimationMetadata, style, transition } from '@angular/animations';

import { defaultAnimationTiming } from '../constants';

export function fade(opacity = 1): AnimationMetadata[] {
  return [
    transition('void => *', [style({ opacity: 0 }), animate(defaultAnimationTiming, style({ opacity: opacity }))]),
    transition('* => void', [animate(defaultAnimationTiming, style({ opacity: 0 }))]),
  ];
}
