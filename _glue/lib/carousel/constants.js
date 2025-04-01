/**
 * @fileoverview Constants used by the Carousel component.
 */
var CssClasses;
(function(CssClasses) {
CssClasses['ACTIVE'] = 'glue-is-active';
CssClasses['BUTTON'] = 'glue-carousel__button';
CssClasses['BUTTON_NEXT'] = 'glue-carousel__button--next';
CssClasses['BUTTON_PREV'] = 'glue-carousel__button--prev';
CssClasses['CARDS'] = 'glue-carousel--cards';
CssClasses['CAROUSEL'] = 'glue-carousel';
CssClasses['DISABLE_GRAB'] = 'glue-carousel__list--disable-grab';
CssClasses['HAS_NAVIGATION'] = 'glue-carousel--has-navigation';
CssClasses['INACTIVE'] = 'glue-is-inactive';
CssClasses['ITEM'] = 'glue-carousel__item';
CssClasses['LIST'] = 'glue-carousel__list';
CssClasses['MODALS'] = 'glue-carousel__modals';
CssClasses['NAVIGATION'] = 'glue-carousel__navigation';
CssClasses['NAVIGATION_DOT'] = 'glue-carousel__dot';
CssClasses['PEEK_OUT'] = 'glue-carousel--peek-out';
CssClasses['VIEWPORT'] = 'glue-carousel__viewport';
})(CssClasses || (CssClasses = {}));
var Icons;
(function(Icons) {
Icons['CHEVRON_RIGHT'] = 'chevron-right';
Icons['CHEVRON_LEFT'] = 'chevron-left';
})(Icons || (Icons = {}));
var Numbers;
(function(Numbers) {
/**
 * A threshold value that corresponds to the Carousel viewport width.
 * It is factor, a value between 0 to 1.
 * E.g. drag threshold is 0.2 * containerWidth.
 */
Numbers[Numbers['DRAG_THRESHOLD'] = 0.2] = 'DRAG_THRESHOLD';
/**
 * The minimum distance that the user needs to move before the carousel
 * recognizes the gesture as a drag (rather than a click, etc).
 */
Numbers[Numbers['DRAGSTART_THRESHOLD_PX'] = 10] = 'DRAGSTART_THRESHOLD_PX';
/**
 * Distance in pixels for the card carousel to peek out on small viewport
 */
Numbers[Numbers['PEEK_DISTANCE'] = 24] = 'PEEK_DISTANCE';
/**
 * When determining the number of slides per page, if the resulting value is
 * within this range from an integer, round up, otherwise round down.
 * E.g. 1.9999962591720426 => 2
 */
Numbers[Numbers['ROUNDING_THRESHOLD'] = 0.05] = 'ROUNDING_THRESHOLD';
})(Numbers || (Numbers = {}));
var Strings;
(function(Strings) {
Strings['DATA_CAROUSEL_ANIMATION_ATTR'] = 'data-glue-carousel-animation';
Strings['DATA_CAROUSEL_NAVIGATION_LABEL_ATTR'] =
    'data-glue-carousel-navigation-label';
Strings['DATA_DOT'] = 'dot';
Strings['DATA_NAVIGATION_LABEL'] = 'glueCarouselNavigationLabel';
Strings['NAVIGATION_ARIA_LABEL_DEFAULT'] = 'Choose slide to display';
Strings['NAVIGATION_LABEL_DEFAULT'] =
    'Selected tab $glue_carousel_page_number$ of $glue_carousel_page_total$';
Strings['NAVIGATION_LABEL_NUMBER_VAR_NAME'] = '$glue_carousel_page_number$';
Strings['NAVIGATION_LABEL_TOTAL_VAR_NAME'] = '$glue_carousel_page_total$';
Strings['NAVIGATION_NEXT_LABEL_DEFAULT'] = 'Go to the next slide';
Strings['NAVIGATION_PREV_LABEL_DEFAULT'] = 'Go to the previous slide';
Strings['RTL'] = 'rtl';
Strings['SLIDE_CHANGE'] = 'gluecarouselslidechange';
Strings['TRANSITION_NONE'] = 'none';
})(Strings || (Strings = {}));
var CarouselType;
(function(CarouselType) {
CarouselType['CARDS'] = 'cards';
CarouselType['IMAGE'] = 'image';
CarouselType['CUSTOM'] = 'custom';
})(CarouselType || (CarouselType = {}));
export {CarouselType, CssClasses, Icons, Numbers, Strings};
