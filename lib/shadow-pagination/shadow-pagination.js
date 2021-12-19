"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

(function () {
  // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
  function isNumeric(value) {
    return !Number.isNaN(value - parseFloat(value));
  }

  function pagination(currentPage, pageCount) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$diameter = _ref.diameter,
        diameter = _ref$diameter === void 0 ? 5 : _ref$diameter,
        _ref$headSize = _ref.headSize,
        headSize = _ref$headSize === void 0 ? 1 : _ref$headSize,
        _ref$tailSize = _ref.tailSize,
        tailSize = _ref$tailSize === void 0 ? 1 : _ref$tailSize,
        _ref$blurSize = _ref.blurSize,
        blurSize = _ref$blurSize === void 0 ? 0 : _ref$blurSize;

    // https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
    function isNonNegativeInteger(n) {
      // eslint-disable-next-line
      return n >>> 0 === parseFloat(n);
    }

    function isPositiveInteger(n) {
      return isNonNegativeInteger(n) && n > 0;
    } // validation


    if (!isPositiveInteger(pageCount) || !isNonNegativeInteger(currentPage) || parseInt(currentPage, 10) > parseInt(pageCount, 10)) {
      return [];
    } // correct parameters


    var CURR = parseInt(currentPage, 10);
    var COUNT = parseInt(pageCount, 10);
    var DIAMETER = isPositiveInteger(diameter) && diameter <= COUNT && diameter > 1 ? +diameter : 5;
    var HEADSIZE = isNonNegativeInteger(headSize) && headSize <= COUNT ? +headSize : 1;
    var TAILSIZE = isNonNegativeInteger(tailSize) && tailSize <= COUNT ? +tailSize : 1;
    var BLURSIZE = isNonNegativeInteger(blurSize) && blurSize <= COUNT ? +blurSize : 0;
    var FIRST = 1;
    var radius = Math.floor(DIAMETER / 2);
    var isEven = DIAMETER % 2 === 0;
    var set = new Set();

    for (var i = FIRST; i <= HEADSIZE && i <= COUNT; i += 1) {
      set.add(i);
    }

    for (var _i = Math.max(CURR - DIAMETER, FIRST); _i <= CURR + DIAMETER && _i <= COUNT; _i += 1) {
      if (CURR <= radius && _i <= DIAMETER || CURR >= COUNT - radius && _i > COUNT - DIAMETER || _i - CURR >= -radius + isEven && _i - CURR <= radius) {
        set.add(_i);
      }
    }

    for (var _i2 = COUNT - TAILSIZE + 1; _i2 <= COUNT && _i2 >= FIRST; _i2 += 1) {
      set.add(_i2);
    }

    var tmp = Array.from(set);
    var result = [];

    if (tmp[0] && tmp[0] > FIRST && tmp[0] - FIRST <= BLURSIZE) {
      for (var _i3 = FIRST; _i3 < tmp[0]; _i3 += 1) {
        result.push(_i3);
      }
    } else if (tmp[0] && tmp[0] > FIRST) {
      result.push('...');
    }

    for (var _i4 = 0; _i4 < tmp.length; _i4 += 1) {
      var it = tmp[_i4];
      result.push(it);
      var next = tmp[_i4 + 1];
      if (next === undefined) break;

      if (next - it > 1 && next - it - 1 <= BLURSIZE) {
        for (var j = it + 1; j < next; j += 1) {
          result.push(j);
        }
      } else if (next - it > 1) {
        result.push('...');
      }
    }

    if (tmp[tmp.length - 1] < COUNT && COUNT - tmp[tmp.length - 1] <= BLURSIZE) {
      for (var _i5 = tmp[tmp.length - 1] + 1; _i5 <= COUNT; _i5 += 1) {
        result.push(_i5);
      }
    } else if (tmp[tmp.length - 1] < COUNT) {
      result.push('...');
    }

    return result;
  }

  var SMART_MODE_ENUM = ['hidden', 'disabled'];
  var ELLIPSIS_STYLE_ENUM = ['hidden', 'ellipsis', 'no-ellipsis'];
  ELLIPSIS_STYLE_ENUM["default"] = 'ellipsis';

  var _value = /*#__PURE__*/new WeakMap();

  var _pagesFormatFn = /*#__PURE__*/new WeakMap();

  var ShadowPagination = /*#__PURE__*/function (_HTMLElement) {
    _inherits(ShadowPagination, _HTMLElement);

    var _super = _createSuper(ShadowPagination);

    function ShadowPagination() {
      var _this;

      _classCallCheck(this, ShadowPagination);

      _this = _super.call(this);

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _value, {
        writable: true,
        value: 1
      });

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _pagesFormatFn, {
        writable: true,
        value: null
      });

      var shadowRoot = _this.attachShadow({
        mode: 'open'
      });

      shadowRoot.addEventListener('click', function (event) {
        var button;
        var slot = event.composedPath().find(function (v) {
          return v.tagName === 'SLOT';
        });

        if (slot) {
          button = event.composedPath().find(function (v) {
            return v.tagName === 'BUTTON' && v.dataset.of === 'shadow-pagination';
          });
        } else {
          button = event.target.closest('button');
        }

        if (!button || button.disabled) return;
        var type = button.dataset.page;

        switch (type) {
          case 'first':
            _this.value = 1;

            _this.dispatchEvent(new Event('firstpage'));

            break;

          case 'previous':
            _this.value -= 1;

            _this.dispatchEvent(new Event('previouspage'));

            break;

          case 'next':
            _this.value += 1;

            _this.dispatchEvent(new Event('nextpage'));

            break;

          case 'last':
            _this.value = _this.count;

            _this.dispatchEvent(new Event('lastpage'));

            break;

          default:
            _this.value = +type;
            break;
        }
      });
      return _this;
    }

    _createClass(ShadowPagination, [{
      key: "count",
      get: function get() {
        var pagesAttr = this.getAttribute('count');

        if (isNumeric(pagesAttr)) {
          return pagesAttr;
        }

        return 0;
      },
      set: function set(v) {
        if (isNumeric(v) && v >= 0) {
          this.setAttribute('count', v);
        }
      }
    }, {
      key: "value",
      get: function get() {
        return _classPrivateFieldGet(this, _value);
      },
      set: function set(v) {
        if (!isNumeric(v) || !isNumeric(this.count) || +_classPrivateFieldGet(this, _value) === +v) {
          return;
        }

        if (v > 0 && v <= this.count) {
          _classPrivateFieldSet(this, _value, +v);
        } else if (v <= 0 && this.circular) {
          _classPrivateFieldSet(this, _value, this.count);
        } else if (v > this.count && this.circular) {
          _classPrivateFieldSet(this, _value, 1);
        } else {
          return; // avoid dispatchEvent and render
        }

        this.dispatchEvent(new Event('change'));
        this.render();
      }
    }, {
      key: "circular",
      get: function get() {
        return this.hasAttribute('circular');
      },
      set: function set(v) {
        if (v) {
          this.setAttribute('circular', '');
        } else {
          this.removeAttribute('circular');
        }
      }
    }, {
      key: "showFirstButton",
      get: function get() {
        return this.hasAttribute('show-first-button');
      },
      set: function set(v) {
        if (v) {
          this.setAttribute('show-first-button', '');
        } else {
          this.removeAttribute('show-first-button');
        }

        this.render();
      }
    }, {
      key: "showLastButton",
      get: function get() {
        return this.hasAttribute('show-last-button');
      },
      set: function set(v) {
        if (v) {
          this.setAttribute('show-last-button', '');
        } else {
          this.removeAttribute('show-last-button');
        }

        this.render();
      }
    }, {
      key: "hidePreviousButton",
      get: function get() {
        return this.hasAttribute('hide-previous-button');
      },
      set: function set(v) {
        if (v) {
          this.setAttribute('hide-previous-button', '');
        } else {
          this.removeAttribute('hide-previous-button');
        }

        this.render();
      }
    }, {
      key: "hideNextButton",
      get: function get() {
        return this.hasAttribute('hide-next-button');
      },
      set: function set(v) {
        if (v) {
          this.setAttribute('hide-next-button', '');
        } else {
          this.removeAttribute('hide-next-button');
        }

        this.render();
      }
    }, {
      key: "nextSmartMode",
      get: function get() {
        return this.getAttribute('next-smart-mode');
      },
      set: function set(v) {
        this.setAttribute('next-smart-mode', v);
      }
    }, {
      key: "previousSmartMode",
      get: function get() {
        return this.getAttribute('previous-smart-mode');
      },
      set: function set(v) {
        this.setAttribute('previous-smart-mode', v);
      }
    }, {
      key: "ellipsisStyle",
      get: function get() {
        return this.getAttribute('ellipsis-style');
      },
      set: function set(v) {
        this.setAttribute('ellipsis-style', v);
      } // TODO: 属性校验

    }, {
      key: "ellipsisDiameter",
      get: function get() {
        return this.getAttribute('ellipsis-diameter');
      },
      set: function set(v) {
        this.setAttribute('ellipsis-diameter', v);
      }
    }, {
      key: "ellipsisHeadsize",
      get: function get() {
        return this.getAttribute('ellipsis-headsize');
      },
      set: function set(v) {
        this.setAttribute('ellipsis-headsize', v);
      }
    }, {
      key: "ellipsisTailsize",
      get: function get() {
        return this.getAttribute('ellipsis-tailsize');
      },
      set: function set(v) {
        this.setAttribute('ellipsis-tailsize', v);
      }
    }, {
      key: "ellipsisBlursize",
      get: function get() {
        return this.getAttribute('ellipsis-blursize');
      },
      set: function set(v) {
        this.setAttribute('ellipsis-blursize', v);
      }
    }, {
      key: "pagesFormatFn",
      get: function get() {
        return _classPrivateFieldGet(this, _pagesFormatFn);
      },
      set: function set(fn) {
        if (!fn || typeof fn !== 'function') {
          return;
        }

        _classPrivateFieldSet(this, _pagesFormatFn, fn);

        this.render();
      }
    }, {
      key: "render",
      value: function render() {
        var _ref2 = this || {},
            count = _ref2.count,
            value = _ref2.value,
            showFirstButton = _ref2.showFirstButton,
            showLastButton = _ref2.showLastButton,
            hidePreviousButton = _ref2.hidePreviousButton,
            hideNextButton = _ref2.hideNextButton,
            nextSmartMode = _ref2.nextSmartMode,
            previousSmartMode = _ref2.previousSmartMode,
            ellipsisStyle = _ref2.ellipsisStyle,
            pagesFormatFn = _ref2.pagesFormatFn,
            ellipsisDiameter = _ref2.ellipsisDiameter,
            ellipsisHeadsize = _ref2.ellipsisHeadsize,
            ellipsisTailsize = _ref2.ellipsisTailsize,
            ellipsisBlursize = _ref2.ellipsisBlursize;

        function makePreviousButton() {
          if (hidePreviousButton) {
            return '';
          }

          var attr = '';

          if (SMART_MODE_ENUM.includes(previousSmartMode)) {
            attr = previousSmartMode;
          }

          return "<button data-page=\"previous\" data-of=\"shadow-pagination\" part=\"previous\" ".concat(+value === 1 ? attr : '', ">\n                  <slot name=\"previous\">&#706;</slot>\n                </button>");
        }

        function makePages() {
          var innerHTML = '';
          var ellipsis = ELLIPSIS_STYLE_ENUM["default"];

          if (ELLIPSIS_STYLE_ENUM.includes(ellipsisStyle)) {
            ellipsis = ellipsisStyle;
          }

          if (isNumeric(count)) {
            var pages = [];

            if (ellipsis === 'no-ellipsis') {
              for (var i = 1; i <= count; i += 1) {
                pages.push(i);
              }
            } else {
              var diameter = isNumeric(ellipsisDiameter) ? ellipsisDiameter : 5;
              var headSize = isNumeric(ellipsisHeadsize) ? ellipsisHeadsize : 1;
              var tailSize = isNumeric(ellipsisTailsize) ? ellipsisTailsize : 1;
              var blurSize = isNumeric(ellipsisBlursize) ? ellipsisBlursize : 0;
              pages = pagination(value, count, {
                diameter: diameter,
                headSize: headSize,
                tailSize: tailSize,
                blurSize: blurSize
              });
            }

            pages.forEach(function (v) {
              if (isNumeric(v)) {
                innerHTML += "<button data-page=\"".concat(v, "\" class=\"page ").concat(+value === +v ? 'active' : '', "\" part=\"page ").concat(+value === +v ? 'active' : '', "\">\n                              ").concat(pagesFormatFn && typeof pagesFormatFn === 'function' ? pagesFormatFn(+v) : +v, "\n                            </button>");
              } else if (v === '...') {
                var text = ellipsis === 'ellipsis' ? '...' : '';
                innerHTML += "<span part=\"ellipsis\">".concat(text, "</span>");
              }
            });
          }

          return innerHTML;
        }

        function makeNextButton() {
          if (hideNextButton) {
            return '';
          }

          var attr = '';

          if (SMART_MODE_ENUM.includes(nextSmartMode)) {
            attr = nextSmartMode;
          }

          return "<button data-page=\"next\" data-of=\"shadow-pagination\" part=\"next\" ".concat(+value === +count ? attr : '', ">\n                  <slot name=\"next\">&#707;</slot>\n                </button>");
        }

        var template = document.createElement('template');
        template.innerHTML = "\n        <style>\n          :host { display: block; }\n          .page.active { background-color: #fff; }\n        </style>\n        <div>\n          ".concat(showFirstButton ? '<button data-page="first" data-of="shadow-pagination" part="first"><slot name="first">&larrb;</slot></button>' : '', "\n          ").concat(makePreviousButton(), "\n          ").concat(makePages(), "\u2068\u2068\n          ").concat(makeNextButton(), "\n          ").concat(showLastButton ? '<button data-page="last" data-of="shadow-pagination" part="last"><slot name="last">&rarrb;</slot></button>' : '', "\n        </div>\n      ");
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.append(template.content.cloneNode(true));
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
          this.value = newValue;
        }

        if (oldValue !== newValue) {
          this.render();
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['count', 'value', 'show-first-button', 'show-last-button', 'hide-previous-button', 'hide-next-button', 'next-smart-mode', 'previous-smart-mode', 'ellipsis-style', 'ellipsis-diameter', 'ellipsis-headsize', 'ellipsis-tailsize', 'ellipsis-blursize'];
      }
    }]);

    return ShadowPagination;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  customElements.define('shadow-pagination', ShadowPagination);
})();