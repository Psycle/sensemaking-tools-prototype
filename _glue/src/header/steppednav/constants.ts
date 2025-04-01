import {ObserverDataObj} from '../../observer';

enum CssClasses {
  ROOT = 'glue-header__stepped-nav',
  CONTROLS_CONTAINER = 'glue-header__stepped-nav-controls-container',
  CONTROLS = 'glue-header__stepped-nav-controls',
  CONTROLS_ARROW = 'glue-header__stepped-nav-controls-arrow',
  CONTROLS_TITLE = 'glue-header__stepped-nav-controls-title',
  MENU_CONTAINER = 'glue-header__stepped-nav-menus',
  SUBNAV_ICON = 'glue-header__stepped-nav-subnav-icon',
  PARENT_POSITION = 'glue-header__stepped-nav-parent-position',
  PAGE = 'glue-stepped-page',
  PAGES = 'glue-stepped-pages',
}

enum Attributes {
  PARENT_INDEX = 'data-glue-stepped-nav-parent-index',
  PARENT_INDEX_CAMEL = 'glueSteppedNavParentIndex',
  STEPPED_PAGE = 'data-glue-stepped-page',
  STEPPED_PAGE_CAMEL = 'glueSteppedPage',
  STEPPEDNAV_LABEL = 'glueSteppednavLabel',
}

enum Strings {
  CURRENT_PAGE = 'currentPage',
  TOTAL_PAGES = 'totalPages',
  NEXT_EVENT = 'nextPage',
  CONTROLS_MODEL_ID = 'stepped-nav-controls',
  MISSING_CONTROLS = 'Some of the Stepped Nav controls elements are missing.',
  MISSING_PAGES_CONT = 'The container element for Stepped Nav Pages is missing.',
  MISSING_LINK_BAR = "Stepped Nav can't find the Link Bar Header element.",
  STEPPED_PAGE = 'glue-stepped-page',
  STEPPED_NAV_LABEL_VAR_NAME = '$glue_steppednav_label$',
  STEPPEDNAV_LABEL = `${STEPPED_NAV_LABEL_VAR_NAME}, Navigate back to parent menu, ${STEPPED_NAV_LABEL_VAR_NAME} opened`,
}

/**
 * Stepped Nav data model.
 */
declare interface DataModel extends ObserverDataObj {
  currentPage: number;
  totalPages: number;
}

export {Attributes, CssClasses, Strings, type DataModel};
