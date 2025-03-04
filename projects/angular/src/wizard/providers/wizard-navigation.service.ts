/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { ClrWizardPage } from '../wizard-page';
import { ButtonHubService } from './button-hub.service';
import { PageCollectionService } from './page-collection.service';

/**
 * Performs navigation functions for a wizard and manages the current page. Presented as a
 * separate service to encapsulate the behavior of navigating and completing the wizard so
 * that it can be shared across the wizard and its sub-components.
 *
 * The easiest way to access the navigation service is there a reference on your wizard. The
 * Following example would allow you to access your instance of the wizard from your host
 * component and thereby access the navigation service via YourHostComponent.wizard.navService.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 */
@Injectable()
export class WizardNavigationService implements OnDestroy {
  /**
   * Is notified when a previous button is clicked in the wizard. Performs checks
   * before alerting the current page of the button click. Enacts navigation to
   * the previous page if not overridden at the page level.
   *
   * @memberof WizardNavigationService
   */
  previousButtonSubscription: Subscription;

  /**
   * Is notified when a Next button is clicked in the wizard.
   *
   * @memberof WizardNavigationService
   */
  nextButtonSubscription: Subscription;

  /**
   * Is notified when a danger button is clicked in the wizard.
   *
   * @memberof WizardNavigationService
   */
  dangerButtonSubscription: Subscription;

  /**
   * Is notified when a  finish button is clicked in the wizard.
   *
   * @memberof WizardNavigationService
   */
  finishButtonSubscription: Subscription;

  /**
   * Is notified when a Custom button is clicked in the wizard.
   *
   * @memberof WizardNavigationService
   */
  customButtonSubscription: Subscription;

  /**
   * Is notified when a Cancel button is clicked in the wizard. Notifies the wizard,
   * which handles all cancel functionality, if cancel is not overridden at the page
   * level.
   *
   * @memberof WizardNavigationService
   */
  cancelButtonSubscription: Subscription;

  /**
   * Resets navigation to make the first page current when the page collection service
   * emits an event notifying WizardNavigationService that it has reset all pages
   * to their pristine, incomplete state.
   *
   * @memberof WizardNavigationService
   */
  pagesResetSubscription: Subscription;

  /**
   * A Boolean flag used by the ClrWizardPage to avoid a race condition when pages are
   * loading and there is no current page defined.
   *
   * @memberof WizardNavigationService
   */
  navServiceLoaded = false;

  /**
   * A boolean flag shared across the Wizard subcomponents that follows the value
   * of the Wizard.forceForward (clrWizardForceForwardNavigation) input. When true,
   * navigating backwards in the stepnav menu will reset any skipped pages' completed
   * state to false.
   *
   * This is useful when a wizard executes validation on a page-by-page basis when
   * the next button is clicked.
   *
   * @memberof WizardNavigationService
   */
  forceForwardNavigation = false;

  /**
   * A boolean flag shared across the Wizard subcomponents that follows the value
   * of the Wizard.stopCancel (clrWizardPreventDefaultCancel) input. When true, the cancel
   * routine is subverted and must be reinstated in the host component calling Wizard.close()
   * at some point.
   *
   * @memberof WizardNavigationService
   */
  wizardHasAltCancel = false;

  /**
   * A boolean flag shared across the Wizard subcomponents that follows the value
   * of the Wizard.stopNext (clrWizardPreventDefaultNext) input. When true, the next and finish
   * routines are subverted and must be reinstated in the host component calling Wizard.next(),
   * Wizard.forceNext(), Wizard.finish(), or Wizard.forceFinish().
   *
   * @memberof WizardNavigationService
   */
  wizardHasAltNext = false;

  /**
   * A boolean flag shared across the Wizard subcomponents that follows the value
   * of the Wizard.stopNavigation (clrWizardPreventNavigation) input. When true, all
   * navigational elements in the wizard are disabled.
   *
   * This is intended to freeze the wizard in place. Events are not fired so this is
   * not a way to implement alternate functionality for navigation.
   *
   * @memberof WizardNavigationService
   */
  wizardStopNavigation = false;

  /**
   * A boolean flag shared with the stepnav items that prevents user clicks on
   * stepnav items from navigating the wizard.
   *
   * @memberof WizardNavigationService
   */
  wizardDisableStepnav = false;

  /**
   * @memberof WizardNavigationService
   */
  private _currentPage: ClrWizardPage;

  /**
   *
   * @memberof WizardNavigationService
   */
  private _currentChanged = new Subject<ClrWizardPage>();

  /**
   * @memberof WizardNavigationService
   */
  private _movedToNextPage = new Subject<boolean>();

  /**
   * @memberof WizardNavigationService
   */
  private _wizardFinished = new Subject<void>();

  /**
   * @memberof WizardNavigationService
   */
  private _movedToPreviousPage = new Subject<boolean>();

  /**
   * @memberof WizardNavigationService
   */
  private _cancelWizard = new Subject<void>();

  /**
   * Creates an instance of WizardNavigationService. Also sets up subscriptions
   * that listen to the button service to determine when a button has been clicked
   * in the wizard. Is also responsible for taking action when the page collection
   * requests that navigation be reset to its pristine state.
   *
   * @memberof WizardNavigationService
   */
  constructor(public pageCollection: PageCollectionService, public buttonService: ButtonHubService) {
    this.previousButtonSubscription = buttonService.previousBtnClicked.subscribe(() => {
      const currentPage = this.currentPage;
      if (this.currentPageIsFirst || currentPage.previousStepDisabled) {
        return;
      }
      currentPage.previousButtonClicked.emit(currentPage);
      if (!currentPage.preventDefault) {
        this.previous();
      }
    });

    this.nextButtonSubscription = buttonService.nextBtnClicked.subscribe(() => {
      this.checkAndCommitCurrentPage('next');
    });

    this.dangerButtonSubscription = buttonService.dangerBtnClicked.subscribe(() => {
      this.checkAndCommitCurrentPage('danger');
    });

    this.finishButtonSubscription = buttonService.finishBtnClicked.subscribe(() => {
      this.checkAndCommitCurrentPage('finish');
    });

    this.customButtonSubscription = buttonService.customBtnClicked.subscribe((type: string) => {
      if (!this.wizardStopNavigation) {
        this.currentPage.customButtonClicked.emit(type);
      }
    });

    this.cancelButtonSubscription = buttonService.cancelBtnClicked.subscribe(() => {
      if (this.wizardStopNavigation) {
        return;
      }

      if (this.currentPage.preventDefault) {
        this.currentPage.pageOnCancel.emit(this.currentPage);
      } else {
        this.cancel();
      }
    });

    this.pagesResetSubscription = pageCollection.pagesReset.subscribe(() => {
      this.setFirstPageCurrent();
    });
  }

  /**
   * An Observable that is predominantly used amongst the subcomponents and services
   * of the wizard. It is recommended that users listen to the ClrWizardPage.onLoad
   * (clrWizardPageOnLoad) output instead of this Observable.
   *
   * @memberof WizardNavigationService
   */
  get currentPageChanged(): Observable<ClrWizardPage> {
    // TODO: MAKE SURE EXTERNAL OUTPUTS SAY 'CHANGE' NOT 'CHANGED'
    // A BREAKING CHANGE SO AWAITING MINOR RELEASE
    return this._currentChanged.asObservable();
  }

  /**
   * @memberof WizardNavigationService
   */
  get currentPageTitle(): TemplateRef<any> {
    // when the querylist of pages is empty. this is the first place it fails...
    if (!this.currentPage) {
      return null;
    }
    return this.currentPage.title;
  }

  /**
   * Returns a Boolean that tells you whether or not the current page is the first
   * page in the Wizard.
   *
   * This is helpful for determining whether a page is navigable.
   *
   * @memberof WizardNavigationService
   */
  get currentPageIsFirst(): boolean {
    return this.pageCollection.firstPage === this.currentPage;
  }

  /**
   * Returns a Boolean that tells you whether or not the current page is the
   * last page in the Wizard.
   *
   * This is used to determine which buttons should display in the wizard footer.
   *
   * @memberof WizardNavigationService
   */
  get currentPageIsLast(): boolean {
    return this.pageCollection.lastPage === this.currentPage;
  }

  /**
   * Returns the ClrWizardPage object of the current page or null.
   *
   * @memberof WizardNavigationService
   */
  get currentPage(): ClrWizardPage {
    if (!this._currentPage) {
      return null;
    }
    return this._currentPage;
  }

  /**
   * Accepts a ClrWizardPage object, since that object to be the current/active
   * page in the wizard, and emits the ClrWizardPage.onLoad (clrWizardPageOnLoad)
   * event for that page.
   *
   * Note that all of this work is bypassed if the ClrWizardPage object is already
   * the current page.
   *
   * @memberof WizardNavigationService
   */
  set currentPage(page: ClrWizardPage) {
    if (this._currentPage !== page && !this.wizardStopNavigation) {
      this._currentPage = page;
      page.onLoad.emit(page.id);
      this._currentChanged.next(page);
    }
  }

  /**
   * An observable used internally to alert the wizard that forward navigation
   * has occurred. It is recommended that you use the Wizard.onMoveNext
   * (clrWizardOnNext) output instead of this one.
   *
   * @memberof WizardNavigationService
   */
  get movedToNextPage(): Observable<boolean> {
    return this._movedToNextPage.asObservable();
  }

  /**
   * An observable used internally to alert the wizard that the nav service
   * has approved completion of the wizard.
   *
   * It is recommended that you use the Wizard.wizardFinished (clrWizardOnFinish)
   * output instead of this one.
   *
   * @memberof WizardNavigationService
   */
  get wizardFinished(): Observable<void> {
    return this._wizardFinished.asObservable();
  }

  /**
   * Notifies the wizard when backwards navigation has occurred via the
   * previous button.
   *
   * @memberof WizardNavigationService
   */
  get movedToPreviousPage(): Observable<boolean> {
    return this._movedToPreviousPage.asObservable();
  }

  /**
   * Notifies the wizard that a user is trying to cancel it.
   *
   * @memberof WizardNavigationService
   */
  get notifyWizardCancel(): Observable<any> {
    return this._cancelWizard.asObservable();
  }

  /**
   *
   * @memberof WizardNavigationService
   */
  ngOnDestroy(): void {
    this.previousButtonSubscription.unsubscribe();
    this.nextButtonSubscription.unsubscribe();
    this.dangerButtonSubscription.unsubscribe();
    this.finishButtonSubscription.unsubscribe();
    this.customButtonSubscription.unsubscribe();
    this.cancelButtonSubscription.unsubscribe();
    this.pagesResetSubscription.unsubscribe();
  }

  /**
   * This is a public function that can be used to programmatically advance
   * the user to the next page.
   *
   * When invoked, this method will move the wizard to the next page after
   * successful validation. Note that this method goes through all checks
   * and event emissions as if Wizard.next(false) had been called.
   *
   * In most cases, it makes more sense to use Wizard.next(false).
   *
   * @memberof WizardNavigationService
   */
  next(): void {
    if (this.currentPageIsLast) {
      this.checkAndCommitCurrentPage('finish');
    } else {
      this.checkAndCommitCurrentPage('next');
    }
  }

  /**
   * Bypasses checks and most event emissions to force a page to navigate forward.
   *
   * Comparable to calling Wizard.next() or Wizard.forceNext().
   *
   * @memberof WizardNavigationService
   */
  forceNext(): void {
    const currentPage: ClrWizardPage = this.currentPage;
    const nextPage: ClrWizardPage = this.pageCollection.getNextPage(currentPage);

    // catch errant null or undefineds that creep in
    if (!nextPage) {
      throw new Error('The wizard has no next page to go to.');
    }

    if (this.wizardStopNavigation) {
      return;
    }

    if (!currentPage.completed) {
      // this is a state that alt next flows can get themselves in...
      this.pageCollection.commitPage(currentPage);
    }
    this.currentPage = nextPage;
  }

  /**
   * Accepts a button/action type as a parameter. Encapsulates all logic for
   * event emissions, state of the current page, and wizard and page level overrides.
   *
   * Avoid calling this function directly unless you really know what you're doing.
   *
   * @memberof WizardNavigationService
   */
  checkAndCommitCurrentPage(buttonType: string): void {
    const currentPage: ClrWizardPage = this.currentPage;

    if (!currentPage.readyToComplete || this.wizardStopNavigation) {
      return;
    }

    const iAmTheLastPage = this.currentPageIsLast;

    const isNext = buttonType === 'next';
    const isDanger = buttonType === 'danger';
    const isDangerNext = isDanger && !iAmTheLastPage;
    const isDangerFinish = isDanger && iAmTheLastPage;
    const isFinish = buttonType === 'finish' || isDangerFinish;

    if (isFinish && !iAmTheLastPage) {
      return;
    }

    currentPage.primaryButtonClicked.emit(buttonType);

    if (isFinish) {
      currentPage.finishButtonClicked.emit(currentPage);
    } else if (isDanger) {
      currentPage.dangerButtonClicked.emit();
    } else if (isNext) {
      currentPage.nextButtonClicked.emit();
    }

    if (currentPage.stopNext || currentPage.preventDefault) {
      currentPage.onCommit.emit(currentPage.id);
      return;
    }

    // order is very important with these emitters!
    if (isFinish) {
      // mark page as complete
      if (!this.wizardHasAltNext) {
        this.pageCollection.commitPage(currentPage);
      }
      this._wizardFinished.next();
    }

    if (this.wizardHasAltNext) {
      this.pageCollection.commitPage(currentPage);

      if (isNext || isDangerNext) {
        this._movedToNextPage.next(true);
      }
      // jump out here, no matter what type we're looking at
      return;
    }

    if (isNext || isDangerNext) {
      this.forceNext();
    }

    if (!this.wizardHasAltNext && !this.wizardStopNavigation) {
      this._movedToNextPage.next(true);
    }
  }

  /**
   * This is a public function that can be used to programmatically conclude
   * the wizard.
   *
   * When invoked, this method will  initiate the work involved with finalizing
   * and finishing the wizard workflow. Note that this method goes through all
   * checks and event emissions as if Wizard.finish(false) had been called.
   *
   * In most cases, it makes more sense to use Wizard.finish(false).
   *
   * @memberof WizardNavigationService
   */
  finish(): void {
    this.checkAndCommitCurrentPage('finish');
  }

  /**
   * Programmatically moves the wizard to the page before the current page.
   *
   * In most instances, it makes more sense to call Wizard.previous()
   * which does the same thing.
   *
   * @memberof WizardNavigationService
   */
  previous(): void {
    if (this.currentPageIsFirst || this.wizardStopNavigation) {
      return;
    }

    const previousPage = this.pageCollection.getPreviousPage(this.currentPage);

    if (!previousPage) {
      return;
    }

    this._movedToPreviousPage.next(true);

    if (this.forceForwardNavigation) {
      this.currentPage.completed = false;
    }

    this.currentPage = previousPage;
  }

  /**
   * Allows a hook into the cancel workflow of the wizard from the nav service. Note that
   * this route goes through all checks and event emissions as if a cancel button had
   * been clicked.
   *
   * In most cases, users looking for a hook into the cancel routine are actually looking
   * for a way to close the wizard from their host component because they have prevented
   * the default cancel action.
   *
   * In this instance, it is recommended that you use Wizard.close() to avoid any event
   * emission loop resulting from an event handler calling back into routine that will
   * again evoke the events it handles.
   *
   * @memberof WizardNavigationService
   */
  cancel(): void {
    this._cancelWizard.next();
  }

  /**
   * Performs all required checks to determine if a user can navigate to a page. Checking at each
   * point if a page is navigable -- completed where the page immediately after the last completed
   * page.
   *
   * Takes two parameters. The first one must be either the ClrWizardPage object or the ID of the
   * ClrWizardPage object that you want to make the current page.
   *
   * The second parameter is optional and is a Boolean flag for "lazy completion". What this means
   * is the Wizard will mark all pages between the current page and the page you want to navigate
   * to as completed. This is useful for informational wizards that do not require user action,
   * allowing an easy means for users to jump ahead.
   *
   * To avoid checks on navigation, use ClrWizardPage.makeCurrent() instead.
   *
   * @memberof WizardNavigationService
   */
  goTo(pageToGoToOrId: any, lazyComplete = false) {
    const myPages = this.pageCollection;
    const pageToGoTo = typeof pageToGoToOrId === 'string' ? myPages.getPageById(pageToGoToOrId) : pageToGoToOrId;
    const currentPage = this.currentPage;

    // no point in going to the current page. you're there already!
    // also hard block on any navigation when stopNavigation is true
    if (pageToGoTo === currentPage || this.wizardStopNavigation) {
      return;
    }

    const currentPageIndex = myPages.getPageIndex(currentPage);
    const goToPageIndex = myPages.getPageIndex(pageToGoTo);
    const goingForward = goToPageIndex > currentPageIndex;
    const pagesToCheck = myPages.getPageRangeFromPages(this.currentPage, pageToGoTo);
    const okayToMove = lazyComplete || this.canGoTo(pagesToCheck);

    if (!okayToMove) {
      return;
    }

    if (goingForward && lazyComplete) {
      pagesToCheck.forEach((page: ClrWizardPage) => {
        if (page !== pageToGoTo) {
          page.completed = true;
        }
      });
    } else if (!goingForward && this.forceForwardNavigation) {
      pagesToCheck.forEach((page: ClrWizardPage) => {
        page.completed = false;
      });
    }

    this.currentPage = pageToGoTo;
  }

  /**
   * Accepts a range of ClrWizardPage objects as a parameter. Performs the work of checking
   * those objects to determine if navigation can be accomplished.
   *
   * @memberof WizardNavigationService
   */
  canGoTo(pagesToCheck: ClrWizardPage[]): boolean {
    let okayToMove = true;
    const myPages = this.pageCollection;

    // previous page can be important when moving because if it's completed it
    // allows us to move to the page even if it's incomplete...
    let previousPagePasses: boolean;

    if (!pagesToCheck || pagesToCheck.length < 1) {
      return false;
    }

    pagesToCheck.forEach((page: ClrWizardPage) => {
      if (!okayToMove) {
        return;
      }

      if (page.completed) {
        // default is true. just jump out instead of complicating it.
        return;
      }

      // so we know our page is not completed...
      const previousPage = myPages.getPageIndex(page) > 0 ? myPages.getPreviousPage(page) : null;
      previousPagePasses = previousPage === null || previousPage.completed === true;

      // we are false if not the current page AND previous page is not completed
      // (but must have a previous page)
      if (!page.current && !previousPagePasses) {
        okayToMove = false;
      }
      // falls through to true as default
    });

    return okayToMove;
  }

  /**
   * Looks through the collection of pages to find the first one that is incomplete
   * and makes that page the current/active page.
   *
   * @memberof WizardNavigationService
   */
  setLastEnabledPageCurrent(): void {
    const allPages: ClrWizardPage[] = this.pageCollection.pagesAsArray;
    let lastCompletedPageIndex: number = null;

    allPages.forEach((page: ClrWizardPage, index: number) => {
      if (page.completed) {
        lastCompletedPageIndex = index;
      }
    });

    if (lastCompletedPageIndex === null) {
      // always is at least the first item...
      lastCompletedPageIndex = 0;
    } else if (lastCompletedPageIndex + 1 < allPages.length) {
      lastCompletedPageIndex = lastCompletedPageIndex + 1;
    }

    this.currentPage = allPages[lastCompletedPageIndex];
  }

  /**
   * Finds the first page in the collection of pages and makes that page the
   * current/active page.
   *
   * @memberof WizardNavigationService
   */
  setFirstPageCurrent(): void {
    this.currentPage = this.pageCollection.pagesAsArray[0];
  }

  /**
   * Updates the stepnav on the left side of the wizard when pages are dynamically
   * added or removed from the collection of pages.
   *
   * @memberof WizardNavigationService
   */
  updateNavigation(): void {
    let toSetCurrent: ClrWizardPage;

    this.pageCollection.updateCompletedStates();

    const currentPageRemoved = this.pageCollection.pagesAsArray.indexOf(this.currentPage) < 0;
    if (currentPageRemoved) {
      toSetCurrent = this.pageCollection.findFirstIncompletePage();
      this.currentPage = toSetCurrent;
    }
  }
}
