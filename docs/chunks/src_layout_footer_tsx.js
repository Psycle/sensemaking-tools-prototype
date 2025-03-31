"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunksensemaking_tools_prototype"] = self["webpackChunksensemaking_tools_prototype"] || []).push([["src_layout_footer_tsx"],{

/***/ "./node_modules/typed-html/dist/src/elements.js":
/*!******************************************************!*\
  !*** ./node_modules/typed-html/dist/src/elements.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n/// <reference path=\"./jsx/element-types.d.ts\" />\n/// <reference path=\"./jsx/events.d.ts\" />\n/// <reference path=\"./jsx/intrinsic-elements.d.ts\" />\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.createElement = void 0;\nconst capitalACharCode = 'A'.charCodeAt(0);\nconst capitalZCharCode = 'Z'.charCodeAt(0);\nconst isUpper = (input, index) => {\n    const charCode = input.charCodeAt(index);\n    return capitalACharCode <= charCode && capitalZCharCode >= charCode;\n};\nconst toKebabCase = (camelCased) => {\n    let kebabCased = '';\n    for (let i = 0; i < camelCased.length; i++) {\n        const prevUpperCased = i > 0 ? isUpper(camelCased, i - 1) : true;\n        const currentUpperCased = isUpper(camelCased, i);\n        const nextUpperCased = i < camelCased.length - 1 ? isUpper(camelCased, i + 1) : true;\n        if (!prevUpperCased && currentUpperCased || currentUpperCased && !nextUpperCased) {\n            kebabCased += '-';\n            kebabCased += camelCased[i].toLowerCase();\n        }\n        else {\n            kebabCased += camelCased[i];\n        }\n    }\n    return kebabCased;\n};\nconst escapeAttrNodeValue = (value) => {\n    return value.replace(/(&)|(\")|(\\u00A0)/g, function (_, amp, quote) {\n        if (amp)\n            return '&amp;';\n        if (quote)\n            return '&quot;';\n        return '&nbsp;';\n    });\n};\nconst attributeToString = (attributes) => (name) => {\n    const value = attributes[name];\n    const formattedName = toKebabCase(name);\n    const makeAttribute = (value) => `${formattedName}=\"${value}\"`;\n    if (value instanceof Date) {\n        return makeAttribute(value.toISOString());\n    }\n    else\n        switch (typeof value) {\n            case 'boolean':\n                // https://www.w3.org/TR/2008/WD-html5-20080610/semantics.html#boolean\n                if (value) {\n                    return formattedName;\n                }\n                else {\n                    return '';\n                }\n            default:\n                return makeAttribute(escapeAttrNodeValue(value.toString()));\n        }\n};\nconst attributesToString = (attributes) => {\n    if (attributes) {\n        return ' ' + Object.keys(attributes)\n            .filter(attribute => attribute !== 'children') // filter out children attributes\n            .map(attributeToString(attributes))\n            .filter(attribute => attribute.length) // filter out negative boolean attributes\n            .join(' ');\n    }\n    else {\n        return '';\n    }\n};\nconst contentsToString = (contents) => {\n    if (contents) {\n        return contents\n            .map(elements => Array.isArray(elements) ? elements.join('\\n') : elements)\n            .join('\\n');\n    }\n    else {\n        return '';\n    }\n};\nconst isVoidElement = (tagName) => {\n    return [\n        'area',\n        'base',\n        'br',\n        'col',\n        'command',\n        'embed',\n        'hr',\n        'img',\n        'input',\n        'keygen',\n        'link',\n        'meta',\n        'param',\n        'source',\n        'track',\n        'wbr'\n    ].indexOf(tagName) > -1;\n};\nfunction createElement(name, attributes = {}, ...contents) {\n    const children = attributes && attributes.children || contents;\n    if (typeof name === 'function') {\n        return name(children ? { children, ...attributes } : attributes, contents);\n    }\n    else {\n        const tagName = toKebabCase(name);\n        if (isVoidElement(tagName) && !contents.length) {\n            return `<${tagName}${attributesToString(attributes)}>`;\n        }\n        else {\n            return `<${tagName}${attributesToString(attributes)}>${contentsToString(contents)}</${tagName}>`;\n        }\n    }\n}\nexports.createElement = createElement;\n//# sourceMappingURL=elements.js.map\n\n//# sourceURL=webpack://sensemaking-tools-prototype/./node_modules/typed-html/dist/src/elements.js?");

/***/ }),

/***/ "./src/layout/footer.tsx":
/*!*******************************!*\
  !*** ./src/layout/footer.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var typed_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typed-html */ \"./node_modules/typed-html/dist/src/elements.js\");\n\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n    return typed_html__WEBPACK_IMPORTED_MODULE_0__.createElement(\"footer\", null, \"footer here.\");\n}\n\n\n//# sourceURL=webpack://sensemaking-tools-prototype/./src/layout/footer.tsx?");

/***/ })

}]);