class Filter {
  constructor(options) {
    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;

    this.$form = document.querySelector(`[${this.formAttr}]`);
    this.url = new URL(window.location.href);
    this.filtersUrl = new URLSearchParams(
      decodeURIComponent(this.url.searchParams),
    );
  }

  // Private methods
  _updateUrl() {
    this.url = new URL(window.location.href);
    this.filtersUrl = new URLSearchParams(this.url.searchParams);
  }

  _checkInputType(input) {
    const tagName = input.tagName.toLowerCase();
    let inputType = null;

    if (tagName === 'select') {
      inputType = input.multiple ? 'select-multi' : 'select-single';
    } else if (tagName === 'input') {
      inputType = input.type === 'radio' ? 'radio' : 'checkbox';
    }

    return inputType;
  }

  _parseFiltersFromUrl(paramsUrl) {
    const params = [...paramsUrl.entries()];
    const objectFilters = {};

    if (params.length === 0) return objectFilters;

    params.forEach((param) => {
      objectFilters[param[0]] = param[1].split(' ');
    });

    return objectFilters;
  }

  _updateInputsFromUrl(paramsUrl) {
    const objectFilters = this._parseFiltersFromUrl(paramsUrl);

    if (Object.keys(objectFilters).length === 0) return;

    Object.keys(objectFilters).forEach((type) => {
      const filter = this.$form.querySelector(`[${this.filterAttr}="${type}"]`);
      const filterType = this._checkInputType(filter);

      if (filterType === 'select-single') {
        this.$form.querySelector(`[${this.filterAttr}="${type}"]`).value = objectFilters[type][0];
      } else if (filterType === 'radio') {
        this.$form.querySelector(
          `[${this.filterAttr}="${type}"][value="${objectFilters[type][0]}"]`,
        ).checked = true;
      } else if (filterType === 'checkbox') {
        objectFilters[type].forEach((val) => {
          this.$form.querySelector(
            `[${this.filterAttr}="${type}"][value="${val}"]`,
          ).checked = true;
        });
      }
    });
  }

  _updateUrlFromInputs(e) {
    const { target } = e;
    const filterName = target.getAttribute(`${this.filterAttr}`);
    const filterValue = target.value;
    const filterType = this._checkInputType(target);
    const isFilterChecked = target.checked;
    const filterParams = `${this.filtersUrl.get(filterName)}`.split(' ');

    if (filterType === 'select-single' || filterType === 'radio') {
      if (this.filtersUrl.has(filterName)) {
        if (filterValue !== '') {
          this.filtersUrl.set(filterName, filterValue);
        } else {
          this.filtersUrl.delete(filterName);
        }
      } else {
        this.filtersUrl.append(filterName, filterValue);
      }
    } else if (filterType === 'checkbox') {
      if (this.filtersUrl.has(filterName)) {
        if (isFilterChecked) {
          this.filtersUrl.set(
            filterName,
            `${this.filtersUrl.get(filterName)} ${filterValue}`,
          );
        } else if (filterParams.length > 1) {
          this.filtersUrl.delete(filterName);
          filterParams.splice(filterParams.indexOf(filterValue), 1);
          this.filtersUrl.set(filterName, filterParams.join(' '));
        } else {
          this.filtersUrl.delete(filterName);
        }
      } else {
        this.filtersUrl.append(filterName, filterValue);
      }
    }
  }

  _setFiltersToUrl(newUrl, setFiltersUrl) {
    const filterUrl = new URL(newUrl);

    filterUrl.search = setFiltersUrl;
    window.history.pushState(null, null, filterUrl);

    this._updateUrl();
  }

  _resetUrl() {
    const emptyFiltersUrl = new URLSearchParams('');

    this._setFiltersToUrl(this.url, emptyFiltersUrl);
  }

  _resetInputs() {
    this.$form.reset();
  }

  _eventListeners() {
    this.$form.querySelectorAll(`[${this.filterAttr}]`).forEach(($el) => {
      $el.addEventListener('change', (e) => {
        this._updateUrlFromInputs(e);
      });
    });

    window.addEventListener('popstate', () => {
      this._updateUrl();

      this._resetInputs();

      this._updateInputsFromUrl(this.filtersUrl);
    });
  }

  // Public methods
  initFilters() {
    this._updateInputsFromUrl(this.filtersUrl);

    this._eventListeners();
  }

  updateInputs() {
    this._updateInputsFromUrl(this.filtersUrl);
  }

  resetUrl() {
    this._resetUrl();
  }

  resetInputs() {
    this._resetInputs();
  }

  setFilters(newUrl) {
    this._setFiltersToUrl(newUrl, this.filtersUrl);
  }

  getFilters() {
    return this._parseFiltersFromUrl(this.filtersUrl);
  }
}

export default Filter;
