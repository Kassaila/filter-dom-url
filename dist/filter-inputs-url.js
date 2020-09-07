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

var Filter = /*#__PURE__*/function () {
  function Filter(options) {
    _classCallCheck(this, Filter);

    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;
    this.$form = document.querySelector("[".concat(this.formAttr, "]"));
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(decodeURIComponent(this.url.searchParams));
  } // Static methods


  _createClass(Filter, [{
    key: "_parseFiltersFromUrl",
    // Private methods
    value: function _parseFiltersFromUrl(urlParams) {
      var _this = this;

      var params = _toConsumableArray(urlParams.entries());

      var objectFilters = {};
      if (params.length === 0) return objectFilters;
      params.forEach(function (param) {
        var type = param[0];
        var VALUES = param[1];
        var isFilterExist = document.querySelector("[".concat(_this.filterAttr, "=\"").concat(type, "\"]"));
        if (!isFilterExist) return;
        objectFilters[type] = VALUES.split(' ');
      });
      return objectFilters;
    }
  }, {
    key: "_updateUrl",
    value: function _updateUrl() {
      this.url = new URL(window.location.href);
      this.urlFilters = new URLSearchParams(this.url.searchParams);
    }
  }, {
    key: "_updateFiltersFromUrl",
    value: function _updateFiltersFromUrl(urlParams) {
      var _this2 = this;

      var objectFilters = this._parseFiltersFromUrl(urlParams);

      if (Object.keys(objectFilters).length === 0) return;
      Object.keys(objectFilters).forEach(function (type) {
        var $filter = _this2.$form.querySelector("[".concat(_this2.filterAttr, "=\"").concat(type, "\"]"));

        if (!$filter) return;

        var filterType = Filter._checkFilterType($filter);

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
    }
  }, {
    key: "_updateUrlFromFilters",
    value: function _updateUrlFromFilters(e) {
      var $filter = e.target;
      var filterName = $filter.getAttribute("".concat(this.filterAttr));

      var filterType = Filter._checkFilterType($filter);

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
    }
  }, {
    key: "_setFiltersToGlobalUrl",
    value: function _setFiltersToGlobalUrl(newUrl, setUrlFilters) {
      var updatableUrl = new URL(newUrl);
      updatableUrl.search = setUrlFilters;
      window.history.pushState(null, null, updatableUrl);

      this._updateUrl();
    }
  }, {
    key: "_resetGlobalUrl",
    value: function _resetGlobalUrl() {
      var _this3 = this;

      Object.keys(this._parseFiltersFromUrl(this.urlFilters)).forEach(function (filter) {
        _this3.urlFilters["delete"](filter);
      });

      this._setFiltersToGlobalUrl(this.url, this.urlFilters);
    }
  }, {
    key: "_resetFilters",
    value: function _resetFilters() {
      this.$form.reset();
    }
  }, {
    key: "_eventListeners",
    value: function _eventListeners() {
      var _this4 = this;

      this.$form.querySelectorAll("[".concat(this.filterAttr, "]")).forEach(function ($filter) {
        $filter.addEventListener('change', function (e) {
          _this4._updateUrlFromFilters(e);
        });
      });
      window.addEventListener('popstate', function () {
        _this4._updateUrl();

        _this4._resetFilters();

        _this4._updateFiltersFromUrl(_this4.urlFilters);
      });
    } // Public methods

  }, {
    key: "initFilters",
    value: function initFilters() {
      this._updateFiltersFromUrl(this.urlFilters);

      this._eventListeners();
    }
  }, {
    key: "updateFilters",
    value: function updateFilters() {
      this._updateFiltersFromUrl(this.urlFilters);
    }
  }, {
    key: "resetUrl",
    value: function resetUrl() {
      this._resetGlobalUrl();
    }
  }, {
    key: "resetFilters",
    value: function resetFilters() {
      this._resetFilters();
    }
  }, {
    key: "setFiltersToUrl",
    value: function setFiltersToUrl(newUrl) {
      this._setFiltersToGlobalUrl(newUrl, this.urlFilters);
    }
  }, {
    key: "getFiltersFromUrl",
    value: function getFiltersFromUrl() {
      return this._parseFiltersFromUrl(this.urlFilters);
    }
  }], [{
    key: "_checkFilterType",
    value: function _checkFilterType($filter) {
      var tagName = $filter.tagName.toLowerCase();
      var filterType = null;

      if (tagName === 'select') {
        filterType = $filter.multiple ? 'select-multiple' : 'select-single';
      } else if (tagName === 'input') {
        filterType = $filter.type;
      }

      return filterType;
    }
  }]);

  return Filter;
}();

var _default = Filter;
exports["default"] = _default;