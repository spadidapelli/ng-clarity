/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup } from '@angular/forms';

export function triggerAllFormControlValidation(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    } else if (control instanceof FormGroup) {
      triggerAllFormControlValidation(control);
    }
  });
}
