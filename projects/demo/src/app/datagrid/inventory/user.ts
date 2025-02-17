/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pokemon } from './pokemon';

export interface User {
  // Type for dynamic access to specific properties
  [key: string]: any;

  id: number;
  name: string;
  creation: Date;
  color: string;
  pokemon: Pokemon;
  expanded: boolean;
}
