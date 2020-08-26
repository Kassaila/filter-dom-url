class Filter {
  constructor(options) {
    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;
    this.$form = document.querySelector(`[${this.formAttr}]`);
    this.url = new URL(window.location.href);
    this.filtersUrl = new URLSearchParams(decodeURIComponent(this.url.searchParams));
  }

  static _updateUrl() {
    this.url = new URL(window.location.href);
    this.filtersUrl = new URLSearchParams(this.url.searchParams);
  }

  static _checkInputType(input) {
    const tagName = input.tagName.toLowerCase();
    const inputType = null;

    if (tagName === 'select') {
      inputType = input.multiple ? 'select-multi' : 'select-single';
    } else if (tagName === 'input') {
      inputType = input.type === 'radio' ? 'radio' : 'checkbox';
    }

    return inputType;
  }

  static _parseFiltersFromUrl(paramsUrl) {
    const params = [...paramsUrl.entries()];
    const objectFilters = {
      filters: {},
    };

    if (params.length === 0) return objectFilters;

    params.forEach((param) => {
      objectFilters.filters[param[0]] = param[1].split(' ');
    });

    return objectFilters;
  }

  static _updateInputsFromUrl(paramsUrl) {
    objectFilters = Filter._parseFiltersFromUrl(paramsUrl);

    if (objectFilters.filters.length === 0) return;

    Object.keys(objectFilters.filters).forEach((type) => {
      const filter = document.querySelector(`[${this.filterAttr}="${type}"]`);
      const filterType = Filter._checkInputType(filter);

      if (filterType === 'select-single') {
        document.querySelector(`[${this.filterAttr}="${type}"]`).value = objectFilters.filters[type][0];
      } else if (filterType === 'radio') {
        document.querySelector(`[${this.filterAttr}="${type}"][value="${objectFilters.filters[type][0]}"]`).checked = true;
      } else if (filterType === 'checkbox') {
        objectFilters.filters[type].forEach((val) => {
          document.querySelector(`[${this.filterAttr}="${type}"][value="${val}"]`).checked = true;
        });
      }
    });
  }

  static _updateUrlFromInputs(e) {
    const { target } = e;
    const filterName = target.getAttribute(`${this.filterAttr}`);
    const filterValue = target.value;
    const filterType = Filter._checkInputType(target);
    const isFilterChecked = target.checked;
    const filterParams = `${filtersUrl.get(filterName)}`.split(' ');

    if ((filterType === 'select-single') || filterType === 'radio') {
      if (filtersUrl.has(filterName)) {
        if (filterValue !== '') {
          filtersUrl.set(filterName, filterValue);
        } else {
          filtersUrl.delete(filterName);
        }
      } else {
        filtersUrl.append(filterName, filterValue);
      }
    } else if (filterType === 'checkbox') {
      if (filtersUrl.has(filterName)) {
        if (isFilterChecked) {
          filtersUrl.set(filterName, `${filtersUrl.get(filterName)} ${filterValue}`);
        } else if (filterParams.length > 1) {
          filtersUrl.delete(filterName);
          filterParams.splice(filterParams.indexOf(filterValue), 1);
          filtersUrl.set(filterName, filterParams.join(' '));
        } else {
          filtersUrl.delete(filterName);
        }
      } else {
        filtersUrl.append(filterName, filterValue);
      }
    }
  }

  static _setFiltersToUrl(newUrl, setFiltersUrl) {
    const filterUrl = new URL(newUrl);

    filterUrl.search = setFiltersUrl;
    window.history.pushState(null, null, filterUrl);

    Filter._updateUrl();
  }

  static _resetUrl() {
    _resetUrl.emptyFiltersUrl = new URLSearchParams('');

    Filter._setFiltersToUrl(this.url, _resetUrl.emptyFiltersUrl);
  }

  static _resetInputs() {
    this.$form.reset();
  }
  static _eventListeners() {
    // Inputs change
    $form.querySelectorAll(`[${this.filterAttr}]`).forEach(($el) => {
      $el.addEventListener('change', (e) => {
        Filter._updateUrlFromInputs(e);
      });
    });

    // Browser history
    window.addEventListener('popstate', () => {
      Filter._updateUrl();

      Filter._resetInputs();

      Filter._updateInputsFromUrl(this.filtersUrl);
    });
  }

  initFilters() {
    Filter._updateInputsFromUrl(filtersUrl);

    Filter._eventListeners();
  }

  updateInputs() {
    Filter._updateInputsFromUrl(filtersUrl);
  }

  resetUrl() {
    Filter._resetUrl();
  }

  resetInputs(form) {
    Filter._resetInputs(form);
  }

  setFilters(newUrl) {
    Filter._setFiltersToUrl(newUrl, filtersUrl);
  }

  getFilters() {
    return Filter._parseFiltersFromUrl(filtersUrl);
  }
}

export default Filter;
