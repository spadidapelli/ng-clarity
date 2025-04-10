/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrPopoverContent } from '../../utils/popover/popover-content';
import { ClrCommonFormsModule } from '../common/common.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrCombobox } from './combobox';
import { ClrComboboxContainer } from './combobox-container';
import { ComboboxContainerService } from './providers/combobox-container.service';

@Component({
  template: `
    <clr-combobox-container>
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-combobox-container>
  `,
})
class NoLabelTest {}

@Component({
  template: `
    <clr-combobox-container>
      <label>Hello World</label>
      <clr-combobox [(ngModel)]="model" [disabled]="disabled" required></clr-combobox>
      <clr-control-error>There was an error</clr-control-error>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Valid</clr-control-success>
    </clr-combobox-container>
  `,
})
class TemplateDrivenTest {
  inline = false;
  disabled = false;
  model = [];
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-combobox-container>
        <label>Hello World</label>
        <clr-combobox formControlName="model"></clr-combobox>
        <clr-control-error>There was an error</clr-control-error>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-success>Valid</clr-control-success>
      </clr-combobox-container>
    </form>
  `,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: 'Cookie', disabled: this.disabled }, Validators.required),
  });
}

export default function (): void {
  describe('ClrComboboxContainer', () => {
    ContainerNoLabelSpec(ClrComboboxContainer, [ClrCombobox], NoLabelTest);
    TemplateDrivenSpec(
      ClrComboboxContainer,
      [ClrCombobox, ClrPopoverContent],
      TemplateDrivenTest,
      '.clr-control-container clr-combobox'
    );
    ReactiveSpec(
      ClrComboboxContainer,
      [ClrCombobox, ClrPopoverContent],
      TemplateDrivenTest,
      '.clr-control-container clr-combobox'
    );

    describe('label offset', () => {
      let fixture, containerDE;
      let containerService: ComboboxContainerService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, ClrCommonFormsModule, FormsModule],
          declarations: [ClrComboboxContainer, ClrCombobox, ReactiveTest, ClrPopoverContent, TemplateDrivenTest],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);
        containerDE = fixture.debugElement.query(By.directive(ClrComboboxContainer));
        containerService = containerDE.injector.get(ComboboxContainerService);
        fixture.detectChanges();
      });

      it('adds label offset', () => {
        expect(containerService.labelOffset).not.toBe(0);
      });
    });
  });
}
