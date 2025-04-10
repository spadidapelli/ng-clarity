/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { assertEqualDates } from '../utils/test-utils';
import { DayModel } from './day.model';

export default function (): void {
  describe('DayModel', function () {
    const dayModel1: DayModel = new DayModel(2018, 0, 1);
    const dayModel2: DayModel = new DayModel(2018, 5, 21);
    const dayModel3: DayModel = new DayModel(2018, 0, 1);

    function incrementDayModelAndCompare(dayModel: DayModel, incrementBy: number) {
      const date: Date = dayModel.toDate();
      const testDate: Date = dayModel.incrementBy(incrementBy).toDate();

      date.setDate(date.getDate() + incrementBy);
      expect(assertEqualDates(date, testDate)).toBe(true);
    }

    it('2 DayModels are equal when the month, year and date matches', () => {
      expect(dayModel1.isEqual(dayModel3)).toBe(true);
      expect(dayModel3.isEqual(dayModel1)).toBe(true);

      expect(dayModel1.isEqual(dayModel2)).toBe(false);
      expect(dayModel2.isEqual(dayModel1)).toBe(false);

      expect(dayModel3.isEqual(dayModel2)).toBe(false);
      expect(dayModel2.isEqual(dayModel3)).toBe(false);

      expect(dayModel1.isEqual(null)).toBe(false);
    });

    it('converts a DayModel into the javascript date object', () => {
      const date1: Date = dayModel1.toDate();
      const date2: Date = dayModel2.toDate();

      expect(date1).not.toBeNull();
      expect(date2).not.toBeNull();

      expect(date1.getTime()).toEqual(new Date(2018, 0, 1).getTime());
      expect(date2.getTime()).toEqual(new Date(2018, 5, 21).getTime());
    });

    it('provides a method to increment or decrement it a DayModel by a number of days', () => {
      incrementDayModelAndCompare(dayModel2, 20);
      incrementDayModelAndCompare(dayModel2, -20);

      incrementDayModelAndCompare(dayModel2, 40);
      incrementDayModelAndCompare(dayModel2, -40);

      incrementDayModelAndCompare(dayModel1, 1);
      incrementDayModelAndCompare(dayModel1, -1);
    });

    it('returns a clone of the DayModel', () => {
      let testDayModel: DayModel = dayModel1.clone();

      expect(testDayModel).not.toBe(dayModel1);

      expect(assertEqualDates(testDayModel.toDate(), dayModel1.toDate())).toBe(true);

      testDayModel = dayModel2.clone();
      expect(assertEqualDates(testDayModel.toDate(), dayModel2.toDate())).toBe(true);
    });

    it('provides a toDateString method that returns the local date string', () => {
      const testString = dayModel1.toDateString();
      expect(testString).toEqual('Monday, January 1, 2018');
    });

    it('provides a toComparisonString method to compare dates', () => {
      const testString = dayModel1.toComparisonString();
      // Remember, months are 0 indexed
      expect(testString).toEqual('20180001');
    });
  });
}
