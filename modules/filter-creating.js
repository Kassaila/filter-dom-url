class Filter {
  constructor(params) {
    this.filterAttr = params.filterAttr;
    this.formAttr = params.formAttr;
    this.url = new URL(window.location.href);
    this.filtersUrl = new URLSearchParams(decodeURIComponent(this.url.searchParams));
  }

  static _updateUrl() {
    this.url = new URL(window.location.href);
    this.filtersUrl = new URLSearchParams(this.url.searchParams);
  }

  static _checkInputType(input) {
    this.tagName = input.tagName.toLowerCase();
    this.inputType = null;

    if (this.tagName === 'select') {
      this.inputType = input.multiple ? 'select-multi' : 'select-single';
    } else if (this.tagName === 'input') {
      this.inputType = input.type === 'radio' ? 'radio' : 'checkbox';
    }

    return this.inputType;
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
}
