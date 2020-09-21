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

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _parseFiltersFromUrl = new WeakSet();

var _updateUrl = new WeakSet();

var _updateFiltersDomFromUrl = new WeakSet();

var _updateUrlFromFiltersDom = new WeakSet();

var _setFiltersToUrl = new WeakSet();

var _resetUrl = new WeakSet();

var _resetDom = new WeakSet();

var _eventListeners = new WeakSet();

/** Class representing a Filter */
var Filter = /*#__PURE__*/function () {
  /**
     * Create the Filter instance
     * @param {string} options.filterAttr - filters identification attribute
     * @param {string} options.formAttr - filters form identification attribute
     */
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

    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;
    this.$form = document.querySelector("[".concat(this.formAttr, "]"));
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(decodeURIComponent(this.url.searchParams));
  }
  /**
   * Check filter DOM type
   * @public
   * @param {object} $filter - DOM element
   * @returns {string} - filter DOM type
   * @example
   * Filter.checkFilterDomType(document.querySelector('[data-filter="example"]'));
   */


  _createClass(Filter, [{
    key: "init",

    /**
    * Instance initialization
    * @public
    */
    value: function init() {
      _classPrivateMethodGet(this, _updateFiltersDomFromUrl, _updateFiltersDomFromUrl2).call(this, this.urlFilters);

      _classPrivateMethodGet(this, _eventListeners, _eventListeners2).call(this);
    }
    /**
    * Update DOM elements filters
    * @public
    */

  }, {
    key: "updateDom",
    value: function updateDom() {
      _classPrivateMethodGet(this, _updateFiltersDomFromUrl, _updateFiltersDomFromUrl2).call(this, this.urlFilters);
    }
    /**
    * Reset url & window location URL
    * @public
    */

  }, {
    key: "resetUrl",
    value: function resetUrl() {
      _classPrivateMethodGet(this, _resetUrl, _resetUrl2).call(this);
    }
    /**
    * Reset DOM elements filters
    * @public
    */

  }, {
    key: "resetDom",
    value: function resetDom() {
      _classPrivateMethodGet(this, _resetDom, _resetDom2).call(this);
    }
    /**
    * Set URLSearchParams to window.location
    * @public
    * @param {object} newUrl - URL prototype
    */

  }, {
    key: "setFiltersToUrl",
    value: function setFiltersToUrl(newUrl) {
      _classPrivateMethodGet(this, _setFiltersToUrl, _setFiltersToUrl2).call(this, newUrl, this.urlFilters);
    }
    /**
    * Get filters types & values
    * @public
    * @returns {object} - {
    *  filter-type: ['filter-value'],
    * }
    */

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

      if (tagName === 'select') {
        filterDomType = $filter.multiple ? 'select-multiple' : 'select-single';
      } else if (tagName === 'input') {
        filterDomType = $filter.type;
      }

      return filterDomType;
    }
    /**
     * Parse URLSearchParam
     * @private
     * @param {object} urlFilters - URLSearchParam prototype
     * @returns {object} - {
     *  filter-type: ['filter-value'],
     * }
     */

  }]);

  return Filter;
}();

var _parseFiltersFromUrl2 = function _parseFiltersFromUrl2(urlFilters) {
  var _this = this;

  var filters = _toConsumableArray(urlFilters.entries());

  var objectFilters = {};
  if (filters.length === 0) return objectFilters;
  filters.forEach(function (filter) {
    var type = filter[0];
    var VALUES = filter[1];
    var isFilterExist = document.querySelector("[".concat(_this.filterAttr, "=\"").concat(type, "\"]"));
    if (!isFilterExist) return;
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

    if (!$filter) return;
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
          _this2.$form.querySelector("[".concat(_this2.filterAttr, "=\"").concat(type, "\"]")).value = _toConsumableArray(objectFilters[type]);
          break;
        }

      case 'select-multiple':
        {
          var $selectOptions = _toConsumableArray(_this2.$form.querySelector("[".concat(_this2.filterAttr, "=\"").concat(type, "\"]")).options);

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
          console.warn("Type '".concat(filterType, "' is not yet supported."));
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
        console.warn("Type '".concat(filterType, "' is not yet supported."));
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