"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _checkAttrErrorMessage = new WeakMap();

var _checkDomElementAttr = new WeakSet();

var _parseFiltersFromUrl = new WeakSet();

var _updateUrl = new WeakSet();

var _updateFiltersDomFromUrl = new WeakSet();

var _updateUrlFromFiltersDom = new WeakSet();

var _setFiltersToUrl = new WeakSet();

var _resetUrl = new WeakSet();

var _resetDom = new WeakSet();

var _eventListeners = new WeakSet();

var Filter = function () {
  function Filter(options) {
    _classCallCheck(this, Filter);

    _eventListeners.add(this);

    _resetDom.add(this);

    _resetUrl.add(this);

    _setFiltersToUrl.add(this);

    _updateUrlFromFiltersDom.add(this);

    _updateFiltersDomFromUrl.add(this);

    _updateUrl.add(this);

    _parseFiltersFromUrl.add(this);

    _checkDomElementAttr.add(this);

    _checkAttrErrorMessage.set(this, {
      writable: true,
      value: "Filter initializing error.\n  Please enter correct attribute for DOM element"
    });

    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;
    this.$form = document.querySelector("[".concat(this.formAttr, "]"));
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(decodeURIComponent(this.url.searchParams));
  }

  _createClass(Filter, [{
    key: "init",
    value: function init() {
      if (!_classPrivateMethodGet(this, _checkDomElementAttr, _checkDomElementAttr2).call(this, this.formAttr)) {
        throw new Error(_classPrivateFieldGet(this, _checkAttrErrorMessage));
      }

      _classPrivateMethodGet(this, _updateFiltersDomFromUrl, _updateFiltersDomFromUrl2).call(this, this.urlFilters);

      _classPrivateMethodGet(this, _eventListeners, _eventListeners2).call(this);
    }
  }, {
    key: "updateDom",
    value: function updateDom() {
      _classPrivateMethodGet(this, _updateFiltersDomFromUrl, _updateFiltersDomFromUrl2).call(this, this.urlFilters);
    }
  }, {
    key: "resetUrl",
    value: function resetUrl() {
      _classPrivateMethodGet(this, _resetUrl, _resetUrl2).call(this);
    }
  }, {
    key: "resetDom",
    value: function resetDom() {
      _classPrivateMethodGet(this, _resetDom, _resetDom2).call(this);
    }
  }, {
    key: "setFiltersToUrl",
    value: function setFiltersToUrl(newUrl) {
      _classPrivateMethodGet(this, _setFiltersToUrl, _setFiltersToUrl2).call(this, newUrl, this.urlFilters);
    }
  }, {
    key: "getFilters",
    value: function getFilters() {
      return _classPrivateMethodGet(this, _parseFiltersFromUrl, _parseFiltersFromUrl2).call(this, this.urlFilters);
    }
  }], [{
    key: "checkFilterDomType",
    value: function checkFilterDomType($filter) {
      var tagName = $filter.tagName.toLowerCase();
      var filterDomType = null;

      switch (tagName) {
        case 'select':
          {
            filterDomType = $filter.multiple ? 'select-multiple' : 'select-single';
            break;
          }

        case 'input':
          {
            filterDomType = $filter.type;
            break;
          }

        default:
          {
            console.warn("DOM element tag name '".concat(tagName, "' is not yet supported."));
            break;
          }
      }

      return filterDomType;
    }
  }]);

  return Filter;
}();

var _checkDomElementAttr2 = function _checkDomElementAttr2(attr) {
  var isExists = typeof attr === 'string' && document.querySelectorAll("[".concat(attr, "]")).length !== 0;

  if (!isExists) {
    console.warn("DOM element [".concat(attr, "] - is not exists"));
  }

  return isExists;
};

var _parseFiltersFromUrl2 = function _parseFiltersFromUrl2(urlFilters) {
  var _this = this;

  var filters = _toConsumableArray(urlFilters.entries());

  var objectFilters = {};
  if (filters.length === 0) return objectFilters;
  new Map(filters).forEach(function (VALUES, type) {
    if (!_classPrivateMethodGet(_this, _checkDomElementAttr, _checkDomElementAttr2).call(_this, "".concat(_this.filterAttr, "=\"").concat(type, "\""))) return;
    objectFilters[type] = VALUES.split(' ');
  });
  return objectFilters;
};

var _updateUrl2 = function _updateUrl2() {
  this.url = new URL(window.location.href);
  this.urlFilters = new URLSearchParams(this.url.searchParams);
};

var _updateFiltersDomFromUrl2 = function _updateFiltersDomFromUrl2(urlFilters) {
  var _this2 = this;

  var objectFilters = _classPrivateMethodGet(this, _parseFiltersFromUrl, _parseFiltersFromUrl2).call(this, urlFilters);

  if (Object.keys(objectFilters).length === 0) return;
  Object.keys(objectFilters).forEach(function (type) {
    var $filter = _this2.$form.querySelector("[".concat(_this2.filterAttr, "=\"").concat(type, "\"]"));

    var filterType = Filter.checkFilterDomType($filter);

    switch (filterType) {
      case 'select-single':
      case 'color':
      case 'range':
      case 'date':
      case 'month':
      case 'week':
      case 'time':
        {
          $filter.value = _toConsumableArray(objectFilters[type]);
          break;
        }

      case 'select-multiple':
        {
          var $selectOptions = _toConsumableArray($filter.options);

          $selectOptions.forEach(function ($selectOption) {
            var $option = $selectOption;

            if (objectFilters[type].indexOf($option.value) >= 0) {
              $option.selected = true;
            }
          });
          break;
        }

      case 'radio':
        {
          _this2.$form.querySelector("[".concat(_this2.filterAttr, "=\"").concat(type, "\"][value=\"").concat(_toConsumableArray(objectFilters[type]), "\"]")).checked = true;
          break;
        }

      case 'checkbox':
        {
          objectFilters[type].forEach(function (value) {
            _this2.$form.querySelector("[".concat(_this2.filterAttr, "=\"").concat(type, "\"][value=\"").concat(value, "\"]")).checked = true;
          });
          break;
        }

      default:
        {
          console.warn("DOM element type '".concat(filterType, "' is not yet supported."));
          break;
        }
    }
  });
};

var _updateUrlFromFiltersDom2 = function _updateUrlFromFiltersDom2(e) {
  var $filter = e.target;
  var filterName = $filter.getAttribute("".concat(this.filterAttr));
  var filterType = Filter.checkFilterDomType($filter);

  switch (filterType) {
    case 'select-single':
    case 'radio':
    case 'color':
    case 'range':
    case 'date':
    case 'month':
    case 'week':
    case 'time':
      {
        if ($filter.value !== '') {
          this.urlFilters.set(filterName, $filter.value);
        } else {
          this.urlFilters["delete"](filterName);
        }

        break;
      }

    case 'select-multiple':
      {
        var filterValues = _toConsumableArray($filter.options).filter(function (option) {
          return option.selected;
        }).map(function (option) {
          return option.value;
        });

        this.urlFilters.set(filterName, filterValues.join(' '));
        break;
      }

    case 'checkbox':
      {
        var filterParams = "".concat(this.urlFilters.get(filterName)).split(' ');

        if (this.urlFilters.has(filterName)) {
          if ($filter.checked) {
            this.urlFilters.set(filterName, "".concat(this.urlFilters.get(filterName), " ").concat($filter.value));
          } else if (filterParams.length > 1) {
            this.urlFilters["delete"](filterName);
            filterParams.splice(filterParams.indexOf($filter.value), 1);
            this.urlFilters.set(filterName, filterParams.join(' '));
          } else {
            this.urlFilters["delete"](filterName);
          }
        } else {
          this.urlFilters.append(filterName, $filter.value);
        }

        break;
      }

    default:
      {
        console.warn("DOM element type '".concat(filterType, "' is not yet supported."));
        break;
      }
  }
};

var _setFiltersToUrl2 = function _setFiltersToUrl2(newUrl, setUrlFilters) {
  var updatableUrl = new URL(newUrl);
  updatableUrl.search = setUrlFilters;
  window.history.pushState(null, null, updatableUrl);

  _classPrivateMethodGet(this, _updateUrl, _updateUrl2).call(this);
};

var _resetUrl2 = function _resetUrl2() {
  var _this3 = this;

  Object.keys(_classPrivateMethodGet(this, _parseFiltersFromUrl, _parseFiltersFromUrl2).call(this, this.urlFilters)).forEach(function (filter) {
    _this3.urlFilters["delete"](filter);
  });

  _classPrivateMethodGet(this, _setFiltersToUrl, _setFiltersToUrl2).call(this, this.url, this.urlFilters);
};

var _resetDom2 = function _resetDom2() {
  this.$form.reset();
};

var _eventListeners2 = function _eventListeners2() {
  var _this4 = this;

  this.$form.querySelectorAll("[".concat(this.filterAttr, "]")).forEach(function ($filter) {
    $filter.addEventListener('change', function (e) {
      _classPrivateMethodGet(_this4, _updateUrlFromFiltersDom, _updateUrlFromFiltersDom2).call(_this4, e);
    });
  });
  window.addEventListener('popstate', function () {
    _classPrivateMethodGet(_this4, _updateUrl, _updateUrl2).call(_this4);

    _classPrivateMethodGet(_this4, _resetDom, _resetDom2).call(_this4);

    _classPrivateMethodGet(_this4, _updateFiltersDomFromUrl, _updateFiltersDomFromUrl2).call(_this4, _this4.urlFilters);
  });
};

var _default = Filter;
exports["default"] = _default;