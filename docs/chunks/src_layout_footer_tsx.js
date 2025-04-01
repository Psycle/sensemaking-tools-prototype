"use strict";
(self["webpackChunksensemaking_tools_prototype"] = self["webpackChunksensemaking_tools_prototype"] || []).push([["src_layout_footer_tsx"],{

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

/***/ "./src/layout/footer.tsx":
/*!*******************************!*\
  !*** ./src/layout/footer.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var typed_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typed-html */ "./node_modules/typed-html/dist/src/elements.js");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
    return (typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("footer", { class: "glue-footer glue-spacer-3-top" },
        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { class: "glue-visually-hidden" }, "Footer links"),
        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { class: "glue-footer__global" },
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { class: "glue-footer__logo" },
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { href: "https://www.google.com", title: "Google" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { role: "presentation", "aria-hidden": "true", class: "glue-footer__logo-img" },
                        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("use", { href: "./assets/img/glue-icons.svg#google-solid-logo" })))),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", { class: "glue-footer__global-links glue-no-bullet", role: "list" },
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { class: "glue-footer__global-links-list-item" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { class: "glue-footer__link", href: "https://about.google/" }, "About Google")),
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { class: "glue-footer__global-links-list-item" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { class: "glue-footer__link", href: "https://about.google/products/" }, "Google products")),
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { class: "glue-footer__global-links-list-item" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { class: "glue-footer__link", href: "https://policies.google.com/privacy" }, "Privacy")),
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { class: "glue-footer__global-links-list-item" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { class: "glue-footer__link", href: "https://policies.google.com/terms" }, "Terms"))),
            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", { class: "glue-footer__global-links glue-footer__global-links--extra glue-no-bullet", role: "list" },
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { class: "glue-footer__global-links-list-item\n          glue-footer__global-links-list-item--extra" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { class: "glue-footer__link", href: "https://support.google.com/?hl=en" },
                        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { role: "presentation", "aria-hidden": "true", class: "glue-icon\n              glue-icon--24px glue-icon--footer-help" },
                            typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("use", { href: "./assets/img/glue-icons.svg#help" })),
                        "Help")),
                typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { class: "glue-footer__global-links-list-item\n          glue-footer__global-links-list-item--extra" },
                    typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("select", { "aria-label": "Change language", name: "lang-selector", id: "lang-selector", class: "glue-form__dropdown glue-footer__lang-dropdown" },
                        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "https://www.google.com/intl/en/mysite" }, "English"),
                        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "https://www.google.com/intl/pt-BR/mysite" }, "Portugu\u00EAs \u2013 Brasil"),
                        typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "https://www.google.com/intl/ja/mysite" }, "\u65E5\u672C\u8A9E")))))));
}


/***/ })

}]);
//# sourceMappingURL=src_layout_footer_tsx.js.map