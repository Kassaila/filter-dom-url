/** Class representing a Filter */
class Filter {
  // Error message
  #checkAttrErrorMessage = `Filter initializing error.
  Please enter correct attribute for DOM element`;

  /**
     * Create the Filter instance
     * @param {object} options - identification attributes
     * @param {string} options.filterAttr - filters identification attribute
     * @param {string} options.formAttr - filters form identification attribute
     */
  constructor(options) {
    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;

    this.$form = document.querySelector(`[${this.formAttr}]`);
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(
      decodeURIComponent(this.url.searchParams),
    );
  }

  /**
   * Check filter DOM type
   * @public
   * @param {object} $filter - DOM element
   * @returns {null | string} - filter DOM type
   * @example
   * Filter.checkFilterDomType(document.querySelector('[data-filter="example"]'));
   */
  static checkFilterDomType($filter) {
    const tagName = $filter.tagName.toLowerCase();
    let filterDomType = null;

    switch (tagName) {
      case 'select': {
        filterDomType = $filter.multiple ? 'select-multiple' : 'select-single';
        break;
      }
      case 'input': {
        filterDomType = $filter.type;
        break;
      }
      default: {
        console.warn(`DOM element tag name '${tagName}' is not yet supported.`);
        break;
      }
    }

    return filterDomType;
  }

  /**
     * Check attribute and DOM element
     * @private
     * @param {string} attr - DOM element attribute
     * @returns {boolean}
     * @example
     * #checkDomElementAttr('data-filter');
     */
  #checkDomElementAttr (attr) {
    const isExists = typeof attr === 'string' && document.querySelectorAll(`[${attr}]`).length !== 0;

    if (!isExists) {
      console.warn(`DOM element [${attr}] - is not exists`);
    }

    return isExists;
  }

  /**
   * Parse URLSearchParam
   * @private
   * @param {object} urlFilters - URLSearchParam prototype
   * @returns {object} - {
   *  filter-type: ['filter-value'],
   * }
   */
  #parseFiltersFromUrl (urlFilters) {
    const filters = [...urlFilters.entries()];
    const objectFilters = {};

    if (filters.length === 0) return objectFilters;

    new Map(filters).forEach((VALUES, type) => {
      if (!this.#checkDomElementAttr(`${this.filterAttr}="${type}"`)) return;

      objectFilters[type] = VALUES.split(' ');
    });

    return objectFilters;
  }

  /**
   * Update url & urlFilters
   * @private
   */
  #updateUrl () {
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(this.url.searchParams);
  }

  /**
   * Update DOM elements from url
   * @private
   * @param {object} urlFilters - URLSearchParam prototype
   */
  #updateFiltersDomFromUrl (urlFilters) {
    const objectFilters = this.#parseFiltersFromUrl(urlFilters);

    if (Object.keys(objectFilters).length === 0) return;

    Object.keys(objectFilters).forEach((type) => {
      const $filter = this.$form.querySelector(`[${this.filterAttr}="${type}"]`);

      const filterType = Filter.checkFilterDomType($filter);

      switch (filterType) {
        case 'select-single':
        case 'color':
        case 'range':
        case 'date':
        case 'month':
        case 'week':
        case 'time': {
          $filter.value = [...objectFilters[type]];
          break;
        }
        case 'select-multiple': {
          const $selectOptions = [...$filter.options];

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
          console.warn(`DOM element type '${filterType}' is not yet supported.`);
          break;
        }
      }
    });
  }

  /**
   * Update url from DOM elements
   * @private
   * @param {object} e - DOM element event
   */
  #updateUrlFromFiltersDom (e) {
    const $filter = e.target;
    const filterName = $filter.getAttribute(`${this.filterAttr}`);
    const filterType = Filter.checkFilterDomType($filter);

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
        console.warn(`DOM element type '${filterType}' is not yet supported.`);
        break;
      }
    }
  }

  /**
   * Set filters to window.location URL & update history
   * @private
   * @param {object} newUrl - URL prototype
   * @param {object} setUrlFilters - URLSearchParams prototype
   */
  #setFiltersToUrl (newUrl, setUrlFilters) {
    const updatableUrl = new URL(newUrl);

    updatableUrl.search = setUrlFilters;
    window.history.pushState(null, null, updatableUrl);

    this.#updateUrl();
  }

  /**
  * Reset url & window.location URL
  * @private
  */
  #resetUrl () {
    Object.keys(this.#parseFiltersFromUrl(this.urlFilters)).forEach((filter) => {
      this.urlFilters.delete(filter);
    });

    this.#setFiltersToUrl(this.url, this.urlFilters);
  }

  /**
  * Reset DOM elements
  * @private
  */
  #resetDom () {
    this.$form.reset();
  }

  /**
  * Event listeners
  * @private
  */
  #eventListeners () {
    this.$form.querySelectorAll(`[${this.filterAttr}]`).forEach(($filter) => {
      $filter.addEventListener('change', (e) => {
        this.#updateUrlFromFiltersDom(e);
      });
    });

    window.addEventListener('popstate', () => {
      this.#updateUrl();

      this.#resetDom();

      this.#updateFiltersDomFromUrl(this.urlFilters);
    });
  }

  /**
  * Instance initialization
  * @public
  */
  init() {
    if (!this.#checkDomElementAttr(this.formAttr)) {
      throw new Error(this.#checkAttrErrorMessage);
    }

    this.#updateFiltersDomFromUrl(this.urlFilters);

    this.#eventListeners();
  }

  /**
  * Update DOM elements filters
  * @public
  */
  updateDom() {
    this.#updateFiltersDomFromUrl(this.urlFilters);
  }

  /**
  * Reset url & window.location URL
  * @public
  */
  resetUrl() {
    this.#resetUrl();
  }

  /**
  * Reset DOM elements filters
  * @public
  */
  resetDom() {
    this.#resetDom();
  }

  /**
  * Set URLSearchParams to window.location URL
  * @public
  * @param {object} newUrl - URL prototype
  */
  setFiltersToUrl(newUrl) {
    this.#setFiltersToUrl(newUrl, this.urlFilters);
  }

  /**
  * Get filters types & values
  * @public
  * @returns {object} - {
  *  filter-type: ['filter-value'],
  * }
  */
  getFilters() {
    return this.#parseFiltersFromUrl(this.urlFilters);
  }
}

export default Filter;
