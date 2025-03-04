/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrDatalistContainer } from './datalist-container';
import { ClrDatalistInput } from './datalist-input';

@Component({
  template: `<input clrDatalistInput />`,
})
class InvalidUseTest {}

@Component({
  template: `
    <clr-datalist-container>
      <input clrDatalistInput class="test-class" name="Option" />
      <datalist>
        <option [value]="'item1'"></option>
        <option [value]="'item2'"></option>
        <option [value]="'item3'"></option>
      </datalist>
    </clr-datalist-container>
  `,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <clr-datalist-container>
        <input clrDatalistInput name="Option" class="test-class" formControlName="model" />
        <datalist>
          <option [value]="'item1'"></option>
          <option [value]="'item2'"></option>
          <option [value]="'item3'"></option>
        </datalist>
      </clr-datalist-container>
    </div>
  `,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('ClrDatalistInput', () => {
    describe('invalid use', () => {
      it('should throw an error when used without a datalist container', () => {
        TestBed.configureTestingModule({
          imports: [ClrDatalistInput],
          declarations: [InvalidUseTest],
        });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });
    TemplateDrivenSpec(ClrDatalistContainer, ClrDatalistInput, TemplateDrivenTest, 'clr-input');
    ReactiveSpec(ClrDatalistContainer, ClrDatalistInput, ReactiveTest, 'clr-input');

    describe('set datalist type', () => {
      let fixture, containerDE, containerEl;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, ClrCommonFormsModule, FormsModule],
          declarations: [ClrDatalistContainer, ClrDatalistInput, TemplateDrivenTest],
          providers: [IfControlStateService, NgControl, NgControlService, LayoutService],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);
        containerDE = fixture.debugElement.query(By.directive(ClrDatalistContainer));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('should set the list', () => {
        expect(containerEl.attributes.list).toEqual(containerDE.componentInstance.listValue);
      });
    });
  });
}
