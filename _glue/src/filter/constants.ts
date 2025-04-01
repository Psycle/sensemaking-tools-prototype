enum CssClasses {
  ROOT = 'glue-filter',
  ROOT_MWS = 'glue-filter--mws',
  APPLY_FILTERS = 'glue-filter__apply-filters',
  CATEGORIES = 'glue-filter__categories',
  CATEGORY = 'glue-filter__category',
  CATEGORY_COUNT = 'glue-filter__category-count',
  CATEGORY_ITEM = 'glue-filter__category-item',
  CHIP = 'glue-filter__chip',
  CHIP_ISACTIVE = 'glue-filter__chip--is-active',
  CHIP_CHECKMARK = 'glue-filter__chip-checkmark',
  CHIP_CLOSEBTN = 'glue-filter__chip-close-btn',
  CHIPS = 'glue-filter__chips',
  CHIPS_BAR = 'glue-filter__chips-bar',
  CHIPS_HEADER = 'glue-filter__chips-header',
  CHIPS_PRIMARY = 'glue-filter__chips--primary',
  CONTROLS = 'glue-filter__filter-controls',
  EXPANSIONPANELS = 'glue-filter__panels',
  MODAL = 'glue-filter__modal',
  MODAL_CONTENT = 'glue-filter__modal-content',
  MODAL_CONTROLS = 'glue-filter__modal-controls',
  MODAL_TOGGLE = 'glue-filter__modal-toggle',
  MODAL_VIEWRESULTS = 'glue-filter__view-results',
  RESET_ALL = 'glue-filter__reset-all',
  RESET_ALL_FILTERED = 'glue-filter__reset-all--filtered',
  RESULT = 'glue-filter__result',
  RESULT_IS_MATCHING = 'glue-filter__result--is-matching',
  RESULTS = 'glue-filter__results',
  RESULTS_COUNT = 'glue-filter__results-count',
  RESULTS_STATUS = 'glue-filter__results-status',
  SHOW_RESULTS = 'glue-filter__show-results',
  TITLE = 'glue-filter__filter-title',
}

enum MaterialClasses {
  CHECKBOX = 'mdc-checkbox__native-control',
  RADIO = 'mdc-radio__native-control',
  LIST_ITEM = 'mdc-list-item',
  FORM_FIELD = 'mdc-form-field',
  LABEL = 'mdc-floating-label',
  SELECT = 'mdc-select',
  SELECT_LABEL = 'mdc-list-item__text',
  MWC3_CHECKBOX = 'glue-mwc3-checkbox',
  MWC3_RADIO = 'glue-mwc3-radio',
  MWC3_SELECT = 'glue-mwc3-select',
}

enum Strings {
  // data parameters
  CATEGORIES = 'glueFilterCategories',
  CATEGORY = 'glueFilterCategory',
  CATEGORY_ITEM = 'glueFilterCategoryItem',
  CHIPS_LABEL_ADD = 'glueFilterChipsLabelAdd',
  CHIPS_LABEL_REMOVE = 'glueFilterChipsLabelRemove',
  CHIPS_LABEL_RESET = 'glueFilterChipsLabelReset',
  RESULT_MATCH = 'glueFilterResultMatch',
  DATA_VALUE = 'value',
  STRATEGY = 'glueFilterStrategy',
  PREFIX = 'data-glue-filter-',
  // Layout
  RTL = 'rtl',
  // Events
  UPDATE_STATUS = 'gluefilterupdatestatus',
  MATERIALSELECT_CHANGE = 'MDCSelect:change',
  // Defaults
  CLEAR_FILTERS = 'Clear filters',
  ADD_FILTER = 'Add filter',
  REMOVE_FILTER = 'Remove filter',
  RESULTS_COUNT = '[COUNT] results',
  MODAL_TOGGLE_TEXT = 'Filter',
  MODAL_CLOSE_TEXT = 'Close filter modal',
  MODAL_RESULTS_COUNT = 'Show [COUNT] results',
  PANELS_COLLAPSE_LABEL = 'Collapse this filter category',
  PANELS_EXPAND_LABEL = 'Expand this filter category',
  APPLIED_FILTERS = 'Applied filters',
  // Error messages
  ERROR_MISSING_CATEGORY = 'Filter category is not set on the element.',
  ERROR_MISSING_MATERIAL = 'Material input was not found on this element',
  ERROR_MISSING_VALUE = 'Attribute "value" is not set on the element.',
  // Layout types
  LAYOUT_VERTICAL = 'vertical',
  LAYOUT_HORIZONTAL_DROPDOWN = 'horizontal-dropdown',
  LAYOUT_HORIZONTAL_CHIPS = 'horizontal-chips',
  // ID generators
  CATEGORY_COUNT_ID = 'glue-filter-category-count',
}

/**
 * Filter data model.
 */
interface FilterDataModel {
  [propName: string]: boolean;
}

export {CssClasses, MaterialClasses, Strings, type FilterDataModel};
