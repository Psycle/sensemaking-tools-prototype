"use strict";
(self["webpackChunksensemaking_tools_prototype"] = self["webpackChunksensemaking_tools_prototype"] || []).push([["src_pages_homepage_tsx"],{

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

/***/ "./src/pages/homepage.tsx":
/*!********************************!*\
  !*** ./src/pages/homepage.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Home)
/* harmony export */ });
/* harmony import */ var typed_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typed-html */ "./node_modules/typed-html/dist/src/elements.js");

function Home() {
    return (typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", null, "Home Page"),
        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Welcome to our site!")));
}


/***/ })

}]);
//# sourceMappingURL=src_pages_homepage_tsx.js.map