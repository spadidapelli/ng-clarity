/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

import { TooltipIdService } from './tooltip-id.service';

interface TestContext {
  idService: TooltipIdService;
}

export default function (): void {
  describe('Tooltip Id Service', function () {
    beforeEach(function (this: TestContext) {
      this.idService = new TooltipIdService();
    });

    it('should set an id', function (this: TestContext) {
      let currentId;
      this.idService.id.subscribe(newId => {
        currentId = newId;
      });
      this.idService.updateId('clr-id-1');
      expect(currentId).toBe('clr-id-1');
    });

    it('exposes and observable for latest id', function (this: TestContext) {
      const idObservable = this.idService.id;
      expect(idObservable).toBeDefined();
      expect(idObservable instanceof Observable).toBe(true);
    });
  });
}
