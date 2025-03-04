/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: './disabled.html',
})
export class FormsDisabledDemo {
  items: string[] = ['one', 'two'];

  disabled = true;

  data = {
    input: '',
    textarea: '',
    password: '',
    radio: '',
    checkbox: '',
    select: '',
    range: '',
    datalist: '',
  };
}
