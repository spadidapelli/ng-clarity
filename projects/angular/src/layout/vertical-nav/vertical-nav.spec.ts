/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrIconModule } from '../../icon/icon.module';
import { commonStringsDefault } from '../../utils';
import { VerticalNavService } from './providers/vertical-nav.service';
import { ClrVerticalNav } from './vertical-nav';
import { ClrVerticalNavModule } from './vertical-nav.module';

export default function (): void {
  describe('Vertical Nav', () => {
    let fixture: ComponentFixture<any>;
    let compiled: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrVerticalNavModule, ClrIconModule, NoopAnimationsModule],
        declarations: [
          NoIconsNoNavGroupTestComponent,
          IconsButNoNavGroupTestComponent,
          IconsAndNavGroupTestComponent,
          OnlyNavGroupTestComponent,
          ViewBasicsTestComponent,
          APITestComponent,
          ResponsiveVerticalNavTestComponent,
        ],
      });
    });

    describe('Nav Internals', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(NoIconsNoNavGroupTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('hides the .nav-trigger when the nav is not collapsible', () => {
        expect(vertNavService.collapsible).toBe(false);

        expect(compiled.querySelector('.nav-trigger')).toBeNull();
      });

      it('shows the .nav-trigger when the nav is collapsible', () => {
        expect(vertNavService.collapsible).toBe(false);

        expect(compiled.querySelector('.nav-trigger')).toBeNull();

        vertNavService.collapsible = true;
        fixture.detectChanges();

        expect(compiled.querySelector('.nav-trigger')).not.toBeNull();
      });

      it('should display the .nav-btn button when the nav is collapsed', () => {
        expect(vertNavService.collapsible).toBe(false);

        expect(compiled.querySelector('.nav-btn')).toBeNull();

        vertNavService.collapsible = true;

        fixture.detectChanges();

        expect(compiled.querySelector('.nav-btn')).toBeNull();

        vertNavService.collapsed = true;

        fixture.detectChanges();

        expect(compiled.querySelector('.nav-btn')).not.toBeNull();
      });

      it('opens the vertical nav when the .nav-btn is clicked', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        const vertNav: HTMLElement = compiled.querySelector('.nav-btn');
        vertNav.click();

        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(false);
      });

      it('updates the  aria-expanded attribute when the vertical nav is expanded/collapsed', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;
        fixture.detectChanges();

        const toggleVertNavBtn: HTMLElement = compiled.querySelector('.nav-trigger');

        expect(toggleVertNavBtn.getAttribute('aria-expanded')).toBe('false');

        vertNavService.collapsed = false;
        fixture.detectChanges();

        expect(toggleVertNavBtn.getAttribute('aria-expanded')).toBe('true');
      });

      it('should add tabindex=-1 and aria-hidden to helper button inside .nav-content to prevent focusing', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;
        fixture.detectChanges();
        const toggleVertNavBtnHelper: HTMLElement = compiled.querySelector('.nav-btn');
        expect(toggleVertNavBtnHelper.getAttribute('tabindex')).toBe('-1');
        expect(toggleVertNavBtnHelper.getAttribute('aria-hidden')).toBe('true');
      });
    });

    describe('Nav Internals - No Icons + No Nav Groups', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(NoIconsNoNavGroupTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('shows the .nav-links when the nav is expanded', () => {
        expect(compiled.querySelector('.nav-link')).not.toBeNull();
      });

      it('hides the .nav-links when the nav is collapsed', () => {
        vertNavService.collapsible = true;

        vertNavService.collapsed = true;
        fixture.detectChanges();

        const displayStyle: string = window
          .getComputedStyle(compiled.querySelector('.nav-link') as HTMLElement)
          .getPropertyValue('display');

        expect(displayStyle).toBe('none');
      });
    });

    describe('Nav Internals - Icons + No Nav Groups', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(IconsButNoNavGroupTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('shows the .nav-links & icons when the nav is expanded', () => {
        expect(compiled.querySelector('.nav-link')).not.toBeNull();
        expect(compiled.querySelector('cds-icon')).not.toBeNull();
      });

      it('shows the cds-icon when the nav is collapsed', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        expect(compiled.querySelector('cds-icon')).not.toBeNull();
      });
    });

    describe('Nav Internals - Only Nav Groups', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(OnlyNavGroupTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('does not show .nav-group when nav is collapsed', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        const displayStyle: string = window
          .getComputedStyle(compiled.querySelector('.nav-group') as HTMLElement)
          .getPropertyValue('display');

        expect(displayStyle).toBe('none');
      });
    });

    describe('Nav Internals - Icons + Nav Groups', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(IconsAndNavGroupTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('shows the .nav-groups when the nav is expanded', () => {
        expect(compiled.querySelector('.nav-group')).not.toBeNull();
      });

      it('shows the .nav-groups when the nav is collapsed', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        expect(compiled.querySelector('.nav-group')).not.toBeNull();
      });

      it('clicking on .nav-group when nav is collapsed, expands the nav', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        const navGroupTrigger: HTMLElement = compiled.querySelector('.nav-group-trigger');
        navGroupTrigger.click();

        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(false);
      });
    });

    describe('Responsive Nav Compatibility', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(ResponsiveVerticalNavTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('shows the .nav-links when the nav is expanded', () => {
        expect(compiled.querySelector('.nav-link')).not.toBeNull();
      });

      it('hides the .nav-links when the nav is collapsed', () => {
        vertNavService.collapsible = true;

        vertNavService.collapsed = true;
        fixture.detectChanges();

        const displayStyle: string = window
          .getComputedStyle(compiled.querySelector('.nav-link') as HTMLElement)
          .getPropertyValue('display');

        expect(displayStyle).toBe('none');
      });

      it('shows the .nav-links in responsive mode - level 1', () => {
        vertNavService.collapsible = true;

        vertNavService.collapsed = true;
        fixture.componentInstance.hamburgerMenu = true;

        fixture.detectChanges();

        const displayStyle: string = window
          .getComputedStyle(compiled.querySelector('.nav-link') as HTMLElement)
          .getPropertyValue('display');

        expect(displayStyle).not.toBe('none');
      });

      it('shows the .nav-links in responsive mode - level 2', () => {
        vertNavService.collapsible = true;

        vertNavService.collapsed = true;
        fixture.componentInstance.overflowMenu = true;

        fixture.detectChanges();

        const displayStyle: string = window
          .getComputedStyle(compiled.querySelector('.nav-link') as HTMLElement)
          .getPropertyValue('display');

        expect(displayStyle).not.toBe('none');
      });
    });

    describe('View Basics', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(ViewBasicsTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('adds the .is-collapsed class when the nav is collapsed', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        const nav: HTMLElement = compiled.querySelector('clr-vertical-nav');

        expect(nav.classList.contains('is-collapsed')).toBe(true);
      });

      it('removes the .is-collapsed class when the nav is expanded', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        const nav: HTMLElement = compiled.querySelector('clr-vertical-nav');

        expect(nav.classList.contains('is-collapsed')).toBe(true);

        vertNavService.collapsed = false;

        fixture.detectChanges();

        expect(nav.classList.contains('is-collapsed')).toBe(false);
      });

      it('adds the .has-icons class when the nav has icons', () => {
        const nav: HTMLElement = compiled.querySelector('clr-vertical-nav');

        expect(nav.classList.contains('has-icons')).toBe(true);
      });

      it('removes the .has-icons class when the nav has icons', () => {
        const nav: HTMLElement = compiled.querySelector('clr-vertical-nav');

        expect(nav.classList.contains('has-icons')).toBe(true);

        fixture.componentInstance.groupToggle = false;
        fixture.componentInstance.iconToggle = false;

        fixture.detectChanges();

        expect(nav.classList.contains('has-icons')).toBe(false);
      });

      it('adds the .has-nav-groups class when the nav has icons', () => {
        const nav: HTMLElement = compiled.querySelector('clr-vertical-nav');

        expect(nav.classList.contains('has-nav-groups')).toBe(true);
      });

      it('removes the .has-nav-groups class when the nav has icons', () => {
        const nav: HTMLElement = compiled.querySelector('clr-vertical-nav');

        expect(nav.classList.contains('has-nav-groups')).toBe(true);

        fixture.componentInstance.groupToggle = false;

        fixture.detectChanges();

        expect(nav.classList.contains('groups')).toBe(false);
      });
    });

    describe('Typescript API', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(ViewBasicsTestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('supports a toggle method which toggles the collapsed state in a collapsible nav', () => {
        vertNavService.collapsible = true;
        fixture.componentInstance.nav.toggleByButton();

        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(true);

        fixture.componentInstance.nav.toggleByButton();

        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(false);
      });

      it("toggle method doesn't update collapsed state if nav is not collapsible", () => {
        expect(vertNavService.collapsed).toBe(false);

        fixture.componentInstance.nav.toggleByButton();

        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(false);

        fixture.componentInstance.nav.toggleByButton();

        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(false);
      });

      it('supports the hasIcons method', () => {
        expect(fixture.componentInstance.nav.hasIcons).toBe(true);

        fixture.componentInstance.iconToggle = false;

        fixture.detectChanges();

        expect(fixture.componentInstance.nav.hasIcons).toBe(true);

        fixture.componentInstance.groupToggle = false;

        fixture.detectChanges();

        expect(fixture.componentInstance.nav.hasIcons).toBe(false);
      });

      it('supports the hasNavGroups method', () => {
        expect(fixture.componentInstance.nav.hasNavGroups).toBe(true);

        fixture.componentInstance.groupToggle = false;

        fixture.detectChanges();

        expect(fixture.componentInstance.nav.hasNavGroups).toBe(false);
      });
    });

    describe('Template API', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(APITestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('supports an input to change aria-label on collapsible vertical nav toggle', () => {
        fixture.componentInstance.collapsible = true;
        fixture.componentInstance.collapsed = true;
        fixture.detectChanges();

        const trigger: HTMLElement = compiled.querySelector('.nav-trigger');
        const vertNav: HTMLElement = compiled.querySelector('.nav-btn');

        expect(trigger.getAttribute('aria-label')).toBe(commonStringsDefault.verticalNavToggle);
        expect(vertNav.getAttribute('aria-label')).toBe(commonStringsDefault.verticalNavToggle);

        const verticalNavTriggerLabel = 'Changed label string';
        fixture.componentInstance.toggleLabel = verticalNavTriggerLabel;
        fixture.detectChanges();

        expect(trigger.getAttribute('aria-label')).toBe(verticalNavTriggerLabel);
        expect(vertNav.getAttribute('aria-label')).toBe(verticalNavTriggerLabel);
      });

      it('collapsible vertical nav toggle buttons should have aria-control pointing to nav content id', () => {
        fixture.componentInstance.collapsible = true;
        fixture.componentInstance.collapsed = true;
        fixture.detectChanges();

        const trigger: HTMLElement = compiled.querySelector('.nav-trigger');
        const vertNav: HTMLElement = compiled.querySelector('.nav-btn');
        const content: HTMLElement = compiled.querySelector('.nav-content');

        expect(trigger.getAttribute('aria-controls')).toBe(content.id);
        expect(vertNav.getAttribute('aria-controls')).toBe(content.id);
      });

      it('supports an input to enable the collapsible behavior of the nav', () => {
        expect(vertNavService.collapsible).toBe(false);

        fixture.componentInstance.collapsible = true;
        fixture.detectChanges();

        expect(vertNavService.collapsible).toBe(true);
      });

      it('does not set the collapsed state when the nav is not collapsible', () => {
        expect(vertNavService.collapsible).toBe(false);

        fixture.componentInstance.collapsed = true;
        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(false);
      });

      it('supports an input to set the collapsed behavior of the nav', () => {
        vertNavService.collapsible = true;
        expect(vertNavService.collapsed).toBe(false);

        fixture.componentInstance.collapsed = true;
        fixture.detectChanges();

        expect(vertNavService.collapsed).toBe(true);
      });

      it('emits the collapsed state', fakeAsync(function () {
        expect(fixture.componentInstance.collapsedChange).toBeUndefined();
        vertNavService.collapsible = true;

        fixture.detectChanges();

        const trigger: HTMLElement = compiled.querySelector('.nav-trigger');
        trigger.click();

        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.collapsedChange).toBe(true);

        trigger.click();

        fixture.detectChanges();
        tick();

        expect(fixture.componentInstance.collapsedChange).toBe(false);
      }));
    });

    describe('Accessibility', () => {
      let vertNavService: VerticalNavService;

      beforeEach(() => {
        fixture = TestBed.createComponent(NoIconsNoNavGroupTestComponent);
        fixture.detectChanges();

        compiled = fixture.nativeElement;
        vertNavService = fixture.debugElement.query(By.directive(ClrVerticalNav)).injector.get(VerticalNavService);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('expect buttons to have correct aria-label', () => {
        vertNavService.collapsible = true;
        vertNavService.collapsed = true;

        fixture.detectChanges();

        const toggleVertNavBtn: HTMLElement = compiled.querySelector('.nav-trigger');
        const navBtn: HTMLElement = compiled.querySelector('.nav-btn');

        expect(toggleVertNavBtn.getAttribute('aria-label')).toBe('Toggle vertical navigation');
        expect(navBtn.getAttribute('aria-label')).toBe('Toggle vertical navigation');
      });
    });
  });
}

@Component({
  template: `
    <div class="main-container">
      <clr-vertical-nav>
        <a href="#" clrVerticalNavLink>Link</a>
      </clr-vertical-nav>
    </div>
  `,
})
class NoIconsNoNavGroupTestComponent {
  collapsible = false;
}

@Component({
  template: `
    <clr-vertical-nav>
      <a href="#" clrVerticalNavLink>
        <cds-icon clrVerticalNavIcon shape="home"></cds-icon>
        Link
      </a>
    </clr-vertical-nav>
  `,
})
class IconsButNoNavGroupTestComponent {}

@Component({
  template: `
    <div class="main-container">
      <clr-vertical-nav>
        <clr-vertical-nav-group>
          <a href="#" clrVerticalNavLink>Link</a>
        </clr-vertical-nav-group>
      </clr-vertical-nav>
    </div>
  `,
})
class OnlyNavGroupTestComponent {}

@Component({
  template: `
    <clr-vertical-nav>
      <clr-vertical-nav-group>
        <cds-icon clrVerticalNavIcon shape="home"></cds-icon>
        Group
        <a href="#" clrVerticalNavLink>Link</a>
      </clr-vertical-nav-group>
    </clr-vertical-nav>
  `,
})
class IconsAndNavGroupTestComponent {}

@Component({
  template: `
    <clr-vertical-nav #nav>
      <clr-vertical-nav-group *ngIf="groupToggle">
        <cds-icon clrVerticalNavIcon></cds-icon>
        Group
        <a href="#" clrVerticalNavLink>Text</a>
      </clr-vertical-nav-group>
      <a href="#" clrVerticalNavLink *ngIf="iconToggle">
        <cds-icon clrVerticalNavIcon></cds-icon>
        Text
      </a>
    </clr-vertical-nav>
  `,
})
class ViewBasicsTestComponent {
  @ViewChild('nav') nav: ClrVerticalNav;

  groupToggle = true;
  iconToggle = true;
}

@Component({
  template: `
    <clr-vertical-nav
      #nav
      [clrVerticalNavCollapsible]="collapsible"
      [clrVerticalNavCollapsed]="collapsed"
      [clrVerticalNavToggleLabel]="toggleLabel"
      (clrVerticalNavCollapsedChange)="updateCollapsed($event)"
    ></clr-vertical-nav>
  `,
})
class APITestComponent {
  collapsible = false;
  collapsed = false;
  toggleLabel: string;
  collapsedChange: boolean;

  @ViewChild('nav') nav: ClrVerticalNav;

  updateCollapsed(val: boolean) {
    this.collapsedChange = val;
  }
}

@Component({
  template: `
    <div class="main-container" [class.open-overflow-menu]="overflowMenu" [class.open-hamburger-menu]="hamburgerMenu">
      <clr-vertical-nav>
        <clr-vertical-nav-group>
          <a href="#" clrVerticalNavLink>Link</a>
        </clr-vertical-nav-group>
        <a href="#" clrVerticalNavLink></a>
      </clr-vertical-nav>
    </div>
  `,
})
class ResponsiveVerticalNavTestComponent {
  overflowMenu = false;
  hamburgerMenu = false;
}
