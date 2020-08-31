class Filter {
  constructor(options) {
    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;

    this.$form = document.querySelector(`[${this.formAttr}]`);
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(
      decodeURIComponent(this.url.searchParams),
    );
  }

  // Static methods
  static _checkFilterType($filter) {
    const tagName = $filter.tagName.toLowerCase();
    let filterType = null;

    if (tagName === 'select') {
      filterType = $filter.multiple ? 'select-multiple' : 'select-single';
    } else if (tagName === 'input') {
      filterType = $filter.type;
    }

    return filterType;
  }

  static _parseFiltersFromUrl(urlParams) {
    const params = [...urlParams.entries()];
    const objectFilters = {};

    if (params.length === 0) return objectFilters;

    params.forEach((param) => {
      objectFilters[param[0]] = param[1].split(' ');
    });

    return objectFilters;
  }

  // Private methods
  _updateUrl() {
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(this.url.searchParams);
  }

  _updateFiltersFromUrl(urlParams) {
    const objectFilters = Filter._parseFiltersFromUrl(urlParams);

    if (Object.keys(objectFilters).length === 0) return;

    Object.keys(objectFilters).forEach((type) => {
      const $filter = this.$form.querySelector(`[${this.filterAttr}="${type}"]`);
      const filterType = Filter._checkFilterType($filter);

      switch (filterType) {
        case 'select-single':
        case 'color':
        case 'range':
        case 'date':
        case 'month':
        case 'week':
        case 'time': {
          this.$form.querySelector(`[${this.filterAttr}="${type}"]`).value = [...objectFilters[type]];
          break;
        }
        case 'select-multiple': {
          const $selectOptions = [...this.$form.querySelector(`[${this.filterAttr}="${type}"]`).options];

          $selectOptions.forEach(($selectOption) => {
            const $option = $selectOption;

            if (objectFilters[type].indexOf($option.value) >= 0) {
              $option.selected = true;
            }
          });
          break;
        }
        case 'radio': {
          this.$form.querySelector(
            `[${this.filterAttr}="${type}"][value="${[...objectFilters[type]]}"]`,
          ).checked = true;
          break;
        }
        case 'checkbox': {
          objectFilters[type].forEach((value) => {
            this.$form.querySelector(
              `[${this.filterAttr}="${type}"][value="${value}"]`,
            ).checked = true;
          });
          break;
        }
        default: {
          console.warn(`Type '${filterType}' is not yet supported.`);
          break;
        }
      }
    });
  }

  _updateUrlFromFilters(e) {
    const $filter = e.target;
    const filterName = $filter.getAttribute(`${this.filterAttr}`);
    const filterType = Filter._checkFilterType($filter);

    switch (filterType) {
      case 'select-single':
      case 'radio':
      case 'color':
      case 'range':
      case 'date':
      case 'month':
      case 'week':
      case 'time': {
        if ($filter.value !== '') {
          this.urlFilters.set(filterName, $filter.value);
        } else {
          this.urlFilters.delete(filterName);
        }
        break;
      }
      case 'select-multiple': {
        const filterValues = [...$filter.options]
          .filter((option) => option.selected)
          .map((option) => option.value);

        this.urlFilters.set(filterName, filterValues.join(' '));
        break;
      }
      case 'checkbox': {
        const filterParams = `${this.urlFilters.get(filterName)}`.split(' ');

        if (this.urlFilters.has(filterName)) {
          if ($filter.checked) {
            this.urlFilters.set(
              filterName,
              `${this.urlFilters.get(filterName)} ${$filter.value}`,
            );
          } else if (filterParams.length > 1) {
            this.urlFilters.delete(filterName);
            filterParams.splice(filterParams.indexOf($filter.value), 1);
            this.urlFilters.set(filterName, filterParams.join(' '));
          } else {
            this.urlFilters.delete(filterName);
          }
        } else {
          this.urlFilters.append(filterName, $filter.value);
        }
        break;
      }
      default: {
        console.warn(`Type '${filterType}' is not yet supported.`);
        break;
      }
    }
  }

  _setFiltersToUrl(newUrl, setUrlFilters) {
    const updatableUrl = new URL(newUrl);

    updatableUrl.search = setUrlFilters;
    window.history.pushState(null, null, updatableUrl);

    this._updateUrl();
  }

  _resetUrl() {
    const emptyUrlFilters = new URLSearchParams('');

    this._setFiltersToUrl(this.url, emptyUrlFilters);
  }

  _resetFilters() {
    this.$form.reset();
  }

  _eventListeners() {
    this.$form.querySelectorAll(`[${this.filterAttr}]`).forEach(($filter) => {
      $filter.addEventListener('change', (e) => {
        this._updateUrlFromFilters(e);
      });
    });

    window.addEventListener('popstate', () => {
      this._updateUrl();

      this._resetFilters();

      this._updateFiltersFromUrl(this.urlFilters);
    });
  }

  // Public methods
  initFilters() {
    this._updateFiltersFromUrl(this.urlFilters);

    this._eventListeners();
  }

  updateFilters() {
    this._updateFiltersFromUrl(this.urlFilters);
  }

  resetUrl() {
    this._resetUrl();
  }

  resetFilters() {
    this._resetFilters();
  }

  setFiltersToUrl(newUrl) {
    this._setFiltersToUrl(newUrl, this.urlFilters);
  }

  getFiltersFromUrl() {
    return Filter._parseFiltersFromUrl(this.urlFilters);
  }
}

export default Filter;
