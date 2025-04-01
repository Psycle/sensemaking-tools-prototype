/**
 * @fileoverview Constants used by the Header component.
 */
var CssClasses;
(function(CssClasses) {
CssClasses['ROOT'] = 'glue-header';
CssClasses['BAR'] = 'glue-header__bar';
CssClasses['TOGGLE_BTN'] = 'glue-header__drawer-toggle-btn';
CssClasses['DRAWER_EL'] = 'glue-header__drawer';
CssClasses['DRAWER_EL_BACKDROP'] = 'glue-header__drawer-backdrop';
CssClasses['HAMBURGER'] = 'glue-header__hamburger';
CssClasses['DRAWER_IS_SHOWN'] = 'glue-is-showing-drawer';
CssClasses['DOUBLE'] = 'glue-header--double';
CssClasses['SINGLE'] = 'glue-header--single';
CssClasses['WHOLLY_SCROLLED'] = 'glue-header-is-wholly-scrolled';
CssClasses['LOCK_UP'] = 'glue-header__lock-up';
CssClasses['ICON_LOCK_UP'] = 'glue-header--icon-lockup';
CssClasses['LINK_BAR'] = 'glue-header__link-bar';
CssClasses['LIST'] = 'glue-header__list';
CssClasses['LIST_ITEM'] = 'glue-header__item';
CssClasses['NESTED_LIST'] = 'glue-header__list--nested';
CssClasses['LINK_ITEM'] = 'glue-header__link';
CssClasses['LOGO'] = 'glue-header__logo';
CssClasses['LOGO_LINK'] = 'glue-header__logo-link';
CssClasses['LOGO_PRODUCT'] = 'glue-header__logo--product';
CssClasses['LOGO_CONTAINER'] = 'glue-header__logo-container';
CssClasses['LOGO_PRODUCT_CAMPAIGN'] = 'glue-header__logo--product-campaign';
CssClasses['LOGO_SVG'] = 'glue-header__logo-svg';
CssClasses['NO_DRAWER'] = 'glue-header-no-drawer';
CssClasses['STEPPED_NAV_ENABLE'] = 'glue-header-stepped-nav-enabled';
CssClasses['ACTIVE_MENU'] = 'glue-header--is-active';
CssClasses['ACTIVE_LINK'] = 'glue-header__item--active';
CssClasses['IS_ANIMATING'] = 'glue-is-animating';
CssClasses['BAR_DESKTOP'] = 'glue-header__bar--desktop';
CssClasses['BAR_MOBILE'] = 'glue-header__bar--mobile';
CssClasses['REWIND_SHADOW'] = 'glue-header--rewind-box-shadow';
CssClasses['HEADER_CONTAINER'] = 'glue-header__container';
CssClasses['HEADER_CONTAINER_LINKBAR'] = 'glue-header__container--linkbar';
CssClasses['HEADER_CONTAINER_CTA'] = 'glue-header__container--cta';
CssClasses['SKIP_BTN'] = 'glue-header__skip-content';
CssClasses['DEEP_NAV'] = 'glue-header__deep-nav';
CssClasses['TRANSPARENT'] = 'glue-header--transparent';
CssClasses['HOVERED'] = 'glue-header--hovered';
CssClasses['FOCUSED'] = 'glue-header--focused';
CssClasses['ACTIVE'] = 'glue-header--active';
CssClasses['TIER'] = 'glue-header__tier';
CssClasses['STACKED'] = 'glue-header--complex-stacked';
CssClasses['SIMPLE'] = 'glue-header--simple';
CssClasses['REVERSE'] = 'glue-header--reverse';
CssClasses['NO_CTA'] = 'glue-header--no-cta';
CssClasses['CTA'] = 'glue-header__cta';
CssClasses['SUPPLEMENTAL'] = 'glue-header__supplemental';
})(CssClasses || (CssClasses = {}));
var Strings;
(function(Strings) {
Strings['MISSING_ROOT_ELEMENT'] =
    'No element with "glue-header class" was found. Header component needs a root element.';
Strings['MISSING_HEADER_BAR_ELEMENT'] =
    'No element with "glue-header__bar" class was found. This is required by Header component.';
Strings['MISSING_DRAWER_ELEMENT'] =
    'No element with "glue-header__drawer" class was found. This is required by Header component.';
Strings['MISSING_TOGGLE_BTN_ELEMENT'] =
    'No element with "glue-header__drawer-toggle-btn" class was found. This is required by Header component.';
Strings['MISSING_LINK_BAR_ELEMENT'] =
    'No element with "glue-header__link-bar" class was found. This is required by Header component.';
Strings['UNKNOWN_CUSTOM_BREAKPOINT'] =
    'Unknown custom breakpoint. Valid values are "md", "lg", or "xl".';
Strings['SCROLL_UP'] = 'up';
Strings['SCROLL_DOWN'] = 'down';
Strings['INCORRECT_TYPE'] = 'Incorrect data type';
Strings['SHOW_EVENT'] = 'glueheadershow';
Strings['HIDE_EVENT'] = 'glueheaderhide';
})(Strings || (Strings = {}));
var Numbers;
(function(Numbers) {
Numbers[Numbers['MAX_PAGE_OFFSET'] = 500] = 'MAX_PAGE_OFFSET';
Numbers[Numbers['ANIMATING_STATE_BUFFER'] = 20] = 'ANIMATING_STATE_BUFFER';
Numbers[Numbers['SCROLL_THRESHOLD'] = 50] = 'SCROLL_THRESHOLD';
Numbers[Numbers['POSITION_CHANGE_BUFFER'] = 300] = 'POSITION_CHANGE_BUFFER';
})(Numbers || (Numbers = {}));
var Icons;
(function(Icons) {
Icons['DOWN_ARROW'] = 'expand-more';
Icons['RIGHT_ARROW'] = 'chevron-right';
Icons['LEFT_ARROW'] = 'chevron-left';
Icons['HAMBURGER'] = 'menu';
})(Icons || (Icons = {}));
export {CssClasses, Icons, Numbers, Strings};
