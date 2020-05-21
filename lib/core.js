"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = core;

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function camel2Underline(_str) {
  // 驼峰转下划线_命名
  var str = _str[0].toLowerCase() + _str.substr(1);

  return str.replace(/([A-Z])/g, function ($1) {
    return "_".concat($1.toLowerCase());
  });
}

function camel2Dash(_str) {
  // 驼峰转破折号-命名
  var str = _str[0].toLowerCase() + _str.substr(1);

  return str.replace(/([A-Z])/g, function ($1) {
    return "-".concat($1.toLowerCase());
  });
}

function core() {
  return function (_ref) {
    var types = _ref.types;
    return {
      visitor: {
        ImportDeclaration: function ImportDeclaration(path, _ref2) {
          var opts = _ref2.opts;

          /* opts
          libraryName: '@dp/bee-ui',
          camel2DashComponentName: true,
          customSourceFunc: [Function: customSourceFunc],
          camel2UnderlineComponentName: false */
          var specifiers = path.node.specifiers;
          var source = path.node.source;

          if (Array.isArray(opts)) {
            opts.forEach(function (opt) {
              (0, _assert["default"])(opt.libraryName, 'libraryName should be provided');
            });
            if (!opts.find(function (opt) {
              return opt.libraryName === source.value;
            })) return;
          } else {
            (0, _assert["default"])(opts.libraryName, 'libraryName should be provided');
            if (opts.libraryName !== source.value) return;
          }

          var opt = Array.isArray(opts) ? opts.find(function (opt) {
            return opt.libraryName === source.value;
          }) : opts;
          opt.camel2UnderlineComponentName = typeof opt.camel2UnderlineComponentName === 'undefined' ? false : opt.camel2UnderlineComponentName;
          opt.camel2DashComponentName = typeof opt.camel2DashComponentName === 'undefined' ? false : opt.camel2DashComponentName;

          if (!types.isImportDefaultSpecifier(specifiers[0]) && !types.isImportNamespaceSpecifier(specifiers[0])) {
            var declarations = specifiers.map(function (specifier) {
              var transformedSourceName = opt.camel2UnderlineComponentName ? camel2Underline(specifier.imported.name) : opt.camel2DashComponentName ? camel2Dash(specifier.imported.name) : specifier.imported.name;
              return types.ImportDeclaration([types.ImportDefaultSpecifier(specifier.local)], types.StringLiteral(opt.customSourceFunc(transformedSourceName)));
            });
            path.replaceWithMultiple(declarations);
          }
        }
      }
    };
  };
}