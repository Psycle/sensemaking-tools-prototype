"use strict";
(self["webpackChunksensemaking_tools_prototype"] = self["webpackChunksensemaking_tools_prototype"] || []).push([["src_pages_homepage_index_tsx"],{

/***/ "./node_modules/typed-html/dist/src/elements.js":
/*!******************************************************!*\
  !*** ./node_modules/typed-html/dist/src/elements.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


/// <reference path="./jsx/element-types.d.ts" />
/// <reference path="./jsx/events.d.ts" />
/// <reference path="./jsx/intrinsic-elements.d.ts" />
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createElement = void 0;
const capitalACharCode = 'A'.charCodeAt(0);
const capitalZCharCode = 'Z'.charCodeAt(0);
const isUpper = (input, index) => {
    const charCode = input.charCodeAt(index);
    return capitalACharCode <= charCode && capitalZCharCode >= charCode;
};
const toKebabCase = (camelCased) => {
    let kebabCased = '';
    for (let i = 0; i < camelCased.length; i++) {
        const prevUpperCased = i > 0 ? isUpper(camelCased, i - 1) : true;
        const currentUpperCased = isUpper(camelCased, i);
        const nextUpperCased = i < camelCased.length - 1 ? isUpper(camelCased, i + 1) : true;
        if (!prevUpperCased && currentUpperCased || currentUpperCased && !nextUpperCased) {
            kebabCased += '-';
            kebabCased += camelCased[i].toLowerCase();
        }
        else {
            kebabCased += camelCased[i];
        }
    }
    return kebabCased;
};
const escapeAttrNodeValue = (value) => {
    return value.replace(/(&)|(")|(\u00A0)/g, function (_, amp, quote) {
        if (amp)
            return '&amp;';
        if (quote)
            return '&quot;';
        return '&nbsp;';
    });
};
const attributeToString = (attributes) => (name) => {
    const value = attributes[name];
    const formattedName = toKebabCase(name);
    const makeAttribute = (value) => `${formattedName}="${value}"`;
    if (value instanceof Date) {
        return makeAttribute(value.toISOString());
    }
    else
        switch (typeof value) {
            case 'boolean':
                // https://www.w3.org/TR/2008/WD-html5-20080610/semantics.html#boolean
                if (value) {
                    return formattedName;
                }
                else {
                    return '';
                }
            default:
                return makeAttribute(escapeAttrNodeValue(value.toString()));
        }
};
const attributesToString = (attributes) => {
    if (attributes) {
        return ' ' + Object.keys(attributes)
            .filter(attribute => attribute !== 'children') // filter out children attributes
            .map(attributeToString(attributes))
            .filter(attribute => attribute.length) // filter out negative boolean attributes
            .join(' ');
    }
    else {
        return '';
    }
};
const contentsToString = (contents) => {
    if (contents) {
        return contents
            .map(elements => Array.isArray(elements) ? elements.join('\n') : elements)
            .join('\n');
    }
    else {
        return '';
    }
};
const isVoidElement = (tagName) => {
    return [
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr'
    ].indexOf(tagName) > -1;
};
function createElement(name, attributes = {}, ...contents) {
    const children = attributes && attributes.children || contents;
    if (typeof name === 'function') {
        return name(children ? { children, ...attributes } : attributes, contents);
    }
    else {
        const tagName = toKebabCase(name);
        if (isVoidElement(tagName) && !contents.length) {
            return `<${tagName}${attributesToString(attributes)}>`;
        }
        else {
            return `<${tagName}${attributesToString(attributes)}>${contentsToString(contents)}</${tagName}>`;
        }
    }
}
exports.createElement = createElement;
//# sourceMappingURL=elements.js.map

/***/ }),

/***/ "./src/pages/homepage/index.tsx":
/*!**************************************!*\
  !*** ./src/pages/homepage/index.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Home)
/* harmony export */ });
/* harmony import */ var typed_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typed-html */ "./node_modules/typed-html/dist/src/elements.js");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ "./src/pages/homepage/styles.scss");


function Home() {
    setTimeout(() => {
        const button = document.querySelector("#button-homepage");
        if (button) {
            button.addEventListener("click", () => {
                window.open("https://www.google.com", "_blank");
            });
        }
    }, 200);
    return (typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { class: "glue-spacer-6-top", id: "content" },
        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { class: "demo-homepage__content" },
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { class: "glue-headline glue-headline--headline-1" }, "Lorem, ipsum dolor."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { class: "glue-headline glue-headline--headline-4 glue-spacer-4-top glue-spacer-2-bottom" }, "This is a subheadline. Isn't it glorious?"),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { class: "glue-body--large" }, "And now let\u2019s get in to some placeholder copy so you can scroll down the page and see how the header interacts with page content. Where is it from? What does it MEAN? So mysterious. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc finibus placerat viverra. Quisque nec congue mi. Curabitur porttitor lorem metus, vel condimentum tortor ultricies ac. Pellentesque in ex augue. Proin in sapien eget mauris ultricies molestie. Pellentesque ac tortor at nibh euismod tristique ac non augue. In euismod pellentesque augue, a varius leo. Morbi nisi diam, sollicitudin at quam suscipit, maximus ultricies enim. Mauris et lectus consectetur, maximus dui a, sagittis elit. Duis volutpat felis a dui hendrerit lobortis. Integer et semper ligula."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { class: "glue-body--large" }, "In malesuada blandit lectus quis pretium. Suspendisse semper neque vel risus aliquam, eget molestie nisi porttitor. Sed tincidunt tellus at erat blandit, in vulputate ante tempor. Nulla dapibus tempus sodales. Vestibulum pharetra rutrum magna, quis efficitur quam luctus cursus. Nam nec porttitor metus. Fusce eleifend, diam non egestas luctus, erat lectus consectetur nunc, et convallis arcu nisl a nibh. Sed malesuada justo vel velit mattis, non tempus arcu tincidunt. Vivamus aliquet a dui eu efficitur."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { class: "glue-body--large demo-hide-in-percy" }, "Donec porta, nulla nec luctus condimentum, odio dui tempor arcu, non tincidunt eros ligula vitae justo. Aenean rhoncus tincidunt diam, id imperdiet purus pellentesque eget. Sed eleifend efficitur justo vel lobortis. Proin posuere, massa sed viverra luctus, est ligula ultrices dui, vel sollicitudin urna arcu sed elit. In a facilisis massa. Proin euismod placerat metus, non viverra felis bibendum nec. Aliquam id ante augue. Vestibulum sollicitudin, dui a tincidunt dapibus, ante mi malesuada ipsum, finibus facilisis ex ligula sagittis ligula. Pellentesque quis sapien nisl. Nullam metus odio, tempus scelerisque pulvinar nec, vestibulum in odio. Praesent justo tellus, condimentum sed molestie sed, hendrerit a elit. Nulla ac nibh sed odio ultricies luctus. Maecenas tempus, eros sit amet blandit viverra, nunc urna euismod ligula, non maximus mi magna non nisi. Sed dignissim arcu ac tortor aliquam, a fringilla massa maximus. Mauris maximus luctus justo, id laoreet ex venenatis vitae."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { class: "glue-body--large demo-hide-in-percy" }, "In malesuada blandit lectus quis pretium. Suspendisse semper neque vel risus aliquam, eget molestie nisi porttitor. Sed tincidunt tellus at erat blandit, in vulputate ante tempor. Nulla dapibus tempus sodales. Vestibulum pharetra rutrum magna, quis efficitur quam luctus cursus. Nam nec porttitor metus. Fusce eleifend, diam non egestas luctus, erat lectus consectetur nunc, et convallis arcu nisl a nibh. Sed malesuada justo vel velit mattis, non tempus arcu tincidunt. Vivamus aliquet a dui eu efficitur."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { class: "glue-body--large demo-hide-in-percy" }, "Donec porta, nulla nec luctus condimentum, odio dui tempor arcu, non tincidunt eros ligula vitae justo. Aenean rhoncus tincidunt diam, id imperdiet purus pellentesque eget. Sed eleifend efficitur justo vel lobortis. Proin posuere, massa sed viverra luctus, est ligula ultrices dui, vel sollicitudin urna arcu sed elit. In a facilisis massa. Proin euismod placerat metus, non viverra felis bibendum nec. Aliquam id ante augue. Vestibulum sollicitudin, dui a tincidunt dapibus, ante mi malesuada ipsum, finibus facilisis ex ligula sagittis ligula. Pellentesque quis sapien nisl. Nullam metus odio, tempus scelerisque pulvinar nec, vestibulum in odio. Praesent justo tellus, condimentum sed molestie sed, hendrerit a elit. Nulla ac nibh sed odio ultricies luctus. Maecenas tempus, eros sit amet blandit viverra, nunc urna euismod ligula, non maximus mi magna non nisi. Sed dignissim arcu ac tortor aliquam, a fringilla massa maximus. Mauris maximus luctus justo, id laoreet ex venenatis vitae."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { class: "glue-body--large demo-hide-in-percy" }, "In malesuada blandit lectus quis pretium. Suspendisse semper neque vel risus aliquam, eget molestie nisi porttitor. Sed tincidunt tellus at erat blandit, in vulputate ante tempor. Nulla dapibus tempus sodales. Vestibulum pharetra rutrum magna, quis efficitur quam luctus cursus. Nam nec porttitor metus. Fusce eleifend, diam non egestas luctus, erat lectus consectetur nunc, et convallis arcu nisl a nibh. Sed malesuada justo vel velit mattis, non tempus arcu tincidunt. Vivamus aliquet a dui eu efficitur."),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { id: "button-homepage", class: "glue-button glue-button--medium-emphasis" }, "Demo Link"))));
}


/***/ }),

/***/ "./src/pages/homepage/styles.scss":
/*!****************************************!*\
  !*** ./src/pages/homepage/styles.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=src_pages_homepage_index_tsx.js.map