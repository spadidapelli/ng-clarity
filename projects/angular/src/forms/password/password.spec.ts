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
import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';

@Component({
  template: `<input type="password" clrPassword />`,
})
class InvalidUseTest {}

@Component({
  template: `
    <clr-password-container>
      <input type="text" clrPassword class="test-class" name="model" [(ngModel)]="model" />
      <clr-control-success>Valid</clr-control-success>
    </clr-password-container>
  `,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <clr-password-container>
        <input clrPassword class="test-class" formControlName="model" />
        <clr-control-success>Valid</clr-control-success>
      </clr-password-container>
    </div>
  `,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('ClrPassword', () => {
    describe('invalid use', () => {
      it('should throw an error when used without a password container', () => {
        TestBed.configureTestingModule({
          imports: [ClrPassword],
          declarations: [InvalidUseTest],
        });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });
    TemplateDrivenSpec(ClrPasswordContainer, ClrPassword, TemplateDrivenTest, 'clr-input');
    ReactiveSpec(ClrPasswordContainer, ClrPassword, ReactiveTest, 'clr-input');

    describe('set password type', () => {
      let fixture, containerDE, containerEl;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, ClrCommonFormsModule, FormsModule],
          declarations: [ClrPasswordContainer, ClrPassword, TemplateDrivenTest],
          providers: [IfControlStateService, NgControl, NgControlService, LayoutService],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);
        containerDE = fixture.debugElement.query(By.directive(ClrPasswordContainer));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('should set the password type attribute', () => {
        expect(containerEl.querySelector('input').type).toEqual('password');
      });
    });
  });
}
