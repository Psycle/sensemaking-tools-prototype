/**
 * @fileoverview Constants used by the Banner component.
 */
var CssClasses;
(function(CssClasses) {
CssClasses['BANNER'] = 'glue-banner';
CssClasses['BANNER_CONTENT'] = 'glue-banner__content';
CssClasses['BANNER_CLOSE_BUTTON'] = 'glue-banner__close-btn';
CssClasses['BANNER_HIDDEN'] = 'glue-banner--hidden';
})(CssClasses || (CssClasses = {}));
var Numbers;
(function(Numbers) {
Numbers[Numbers['BANNER_CLOSE_DELAY'] = 300] = 'BANNER_CLOSE_DELAY';
})(Numbers || (Numbers = {}));
var Strings;
(function(Strings) {
Strings['DEFAULT_CLOSE_BUTTON_ARIA_LABEL'] = 'Hide the banner';
Strings['DEFAULT_EMPHASIS'] = 'low';
})(Strings || (Strings = {}));
export {CssClasses, Numbers, Strings};
