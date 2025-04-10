/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * This file is just my OCD coding in my place.
 *
 * The goal is to have the tests properly grouped in the reporter, instead of having them all
 * over the place because we load them asynchronously.
 */

import DomAdapterSpecs from '../../utils/dom-adapter/dom-adapter.spec';
import DatagridPropertyComparatorSpecs from './built-in/comparators/datagrid-property-comparator.spec';
import DatagridNumericFilterImplSpecs from './built-in/filters/datagrid-numeric-filter-impl.spec';
import DatagridNumericFilterSpecs from './built-in/filters/datagrid-numeric-filter.spec';
import DatagridPropertyNumericFilterSpecs from './built-in/filters/datagrid-property-numeric-filter.spec';
import DatagridPropertyStringFilterSpecs from './built-in/filters/datagrid-property-string-filter.spec';
import DatagridStringFilterImplSpecs from './built-in/filters/datagrid-string-filter-impl.spec';
import DatagridStringFilterSpecs from './built-in/filters/datagrid-string-filter.spec';
import NestedPropertySpecs from './built-in/nested-property.spec';
import DatagridActionBarSpecs from './datagrid-action-bar.spec';
import DatagridActionOverflowSpecs from './datagrid-action-overflow.spec';
import DatagridCellSpecs from './datagrid-cell.spec';
import DatagridColumnSeparatorSpecs from './datagrid-column-separator.spec';
import DatagridColumnToggleButtonSpecs from './datagrid-column-toggle-button.spec';
import DatagridColumnToggleSpecs from './datagrid-column-toggle.spec';
import DatagridColumnSpecs from './datagrid-column.spec';
import DatagridDetailSpecs from './datagrid-detail.spec';
import DatagridFilterSpecs from './datagrid-filter.spec';
import DatagridFooterSpecs from './datagrid-footer.spec';
import DatagridHideableColumnDirectiveSpec from './datagrid-hideable-column.spec';
import DatagridItemsSpecs from './datagrid-items.spec';
import DatagridPageSizeSpecs from './datagrid-page-size.spec';
import DatagridPaginationIntegrationSpecs from './datagrid-pagination.integration.spec';
import DatagridPaginationSpecs from './datagrid-pagination.spec';
import DatagridPlaceholderSpecs from './datagrid-placeholder.spec';
import DatagridRowDetailSpecs from './datagrid-row-detail.spec';
import DatagridRowSpecs from './datagrid-row.spec';
import DatagridVirtualScrollSpec from './datagrid-virtual-scroll.directive.spec';
import DatagridSpecs from './datagrid.spec';
import { addHelpers } from './helpers.spec';
import ColumnResizerServiceSpecs from './providers/column-resizer.service.spec';
import DisplayModeServiceSpecs from './providers/display-mode.service.spec';
import FiltersProviderSpecs from './providers/filters.spec';
import ItemsProviderSpecs from './providers/items.spec';
import PageProviderSpecs from './providers/page.spec';
import SelectionProviderSpecs from './providers/selection.spec';
import SortProviderSpecs from './providers/sort.spec';
import StateProviderSpecs from './providers/state.provider.spec';
import TableSizeServiceSpec from './providers/table-size.service.spec';
import DatagridCellRendererSpecs from './render/cell-renderer.spec';
import DatagridHeaderRendererSpecs from './render/header-renderer.spec';
import DatagridMainRendererSpecs from './render/main-renderer.spec';
import NoopDomAdapterSpecs from './render/noop-dom-adapter.spec';
import DatagridRenderOrganizerSpecs from './render/render-organizer.spec';
import DatagridRowRendererSpecs from './render/row-renderer.spec';
import KeyNavigationSpec from './utils/key-navigation-grid.controller.spec';
import WrappedCellSpec from './wrapped-cell.spec';
import WrappedColumnSpec from './wrapped-column.spec';
import WrappedRowSpec from './wrapped-row.spec';

describe('Datagrid', function () {
  addHelpers();

  describe('Providers', function () {
    SortProviderSpecs();
    StateProviderSpecs();
    FiltersProviderSpecs();
    PageProviderSpecs();
    ItemsProviderSpecs();
    SelectionProviderSpecs();
    DisplayModeServiceSpecs();
    TableSizeServiceSpec();
    ColumnResizerServiceSpecs();
  });

  describe('Components', function () {
    DatagridActionBarSpecs();
    DatagridActionOverflowSpecs();
    DatagridCellSpecs();
    DatagridFilterSpecs();
    DatagridColumnSpecs();
    DatagridDetailSpecs();
    DatagridColumnSeparatorSpecs();
    DatagridItemsSpecs();
    DatagridRowSpecs();
    DatagridRowDetailSpecs();
    DatagridPageSizeSpecs();
    DatagridPaginationSpecs();
    DatagridPaginationIntegrationSpecs();
    DatagridFooterSpecs();
    DatagridPlaceholderSpecs();
    DatagridSpecs();
    KeyNavigationSpec();
    DatagridVirtualScrollSpec();
    DatagridColumnToggleSpecs();
    DatagridColumnToggleButtonSpecs();
    DatagridHideableColumnDirectiveSpec();
    WrappedCellSpec();
    WrappedColumnSpec();
    WrappedRowSpec();
  });

  describe('Render', function () {
    DomAdapterSpecs();
    NoopDomAdapterSpecs();
    DatagridRenderOrganizerSpecs();
    DatagridCellRendererSpecs();
    DatagridRowRendererSpecs();
    DatagridHeaderRendererSpecs();
    DatagridMainRendererSpecs();
  });

  describe('Built-in', function () {
    NestedPropertySpecs();
    DatagridPropertyComparatorSpecs();
    DatagridPropertyStringFilterSpecs();
    DatagridPropertyNumericFilterSpecs();
    DatagridStringFilterSpecs();
    DatagridStringFilterImplSpecs();
    DatagridNumericFilterSpecs();
    DatagridNumericFilterImplSpecs();
  });
});
