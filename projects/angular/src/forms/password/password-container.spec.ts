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
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';

@Component({
  template: `
    <clr-password-container [clrToggle]="toggler">
      <input type="password" name="test" clrPassword required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-password-container>
  `,
})
class TemplateDrivenTest {
  disabled = false;
  model = '';
  toggler = true;
}

@Component({
  template: `
    <clr-password-container>
      <input clrPassword [(ngModel)]="model" />
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-password-container>
  `,
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-password-container>
        <input clrPassword formControlName="model" />
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-password-container>
    </form>
  `,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

export default function (): void {
  describe('ClrPasswordContainer', () => {
    ContainerNoLabelSpec(ClrPasswordContainer, ClrPassword, NoLabelTest);
    TemplateDrivenSpec(ClrPasswordContainer, ClrPassword, TemplateDrivenTest, '.clr-input-wrapper [clrPassword]');
    ReactiveSpec(ClrPasswordContainer, ClrPassword, ReactiveTest, '.clr-input-wrapper [clrPassword]');

    describe('password toggle', () => {
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

      it('toggles the visibility of the password', () => {
        const button = containerEl.querySelector('button');
        expect(containerEl.querySelector('input').type).toEqual('password');
        button.click();
        fixture.detectChanges();
        expect(containerEl.querySelector('input').type).toEqual('text');
      });

      it('should disable toggling', () => {
        expect(containerEl.querySelector('button')).toBeTruthy();
        fixture.componentInstance.toggler = false;
        fixture.detectChanges();
        expect(containerEl.querySelector('button')).toBeFalsy();
      });

      it('should provide screen-reader only text for toggle button', () => {
        const button: HTMLButtonElement = containerEl.querySelector('button');
        expect(button.textContent.trim()).toEqual('Show password for Hello World');
        button.click();
        fixture.detectChanges();
        expect(button.textContent.trim()).toEqual('Hide password for Hello World');
      });
    });
  });
}
