/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-datalist-demo',
  templateUrl: './datalist.demo.html',
})
export class DatalistDemo {
  disabled = true;
  items: string[] = ['Item1', 'Item2', 'Item3'];
  model = new FormGroup({
    item: new FormControl(''),
  });
  vertical = {
    one: '',
    two: '',
    three: '',
    four: '',
  };

  logIt() {
    console.log(this);
  }

  submit() {
    console.log(this.model);
  }
}
