/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  chartCollectionIcons as ChartShapes,
  commerceCollectionIcons as CommerceShapes,
  coreCollectionIcons as CoreShapes,
  essentialCollectionIcons as EssentialShapes,
  mediaCollectionIcons as MediaShapes,
  socialCollectionIcons as SocialShapes,
  technologyCollectionIcons as TechnologyShapes,
  textEditCollectionIcons as TextEditShapes,
  travelCollectionIcons as TravelShapes,
} from '@cds/core/icon';

@Component({
  selector: 'clr-icon-selection-demo',
  styleUrls: ['./iconography.demo.scss'],
  templateUrl: './icon-selection.demo.html',
})
export class IconSelectionDemo {
  options = 'none';
  solid = false;

  allShapeSets = [
    { name: 'Core Shapes', shapes: CoreShapes.map(i => i[0]) },
    { name: 'Commerce Shapes', shapes: CommerceShapes.map(i => i[0]) },
    { name: 'Essential Shapes', shapes: EssentialShapes.map(i => i[0]) },
    { name: 'Media Shapes', shapes: MediaShapes.map(i => i[0]) },
    { name: 'Social Shapes', shapes: SocialShapes.map(i => i[0]) },
    { name: 'Travel Shapes', shapes: TravelShapes.map(i => i[0]) },
    { name: 'Technology Shapes', shapes: TechnologyShapes.map(i => i[0]) },
    { name: 'Chart Shapes', shapes: ChartShapes.map(i => i[0]) },
    { name: 'Text Edit Shapes', shapes: TextEditShapes.map(i => i[0]) },
  ];
}
