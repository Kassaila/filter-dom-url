export interface FilterOptions {
  filterAttr: string;
  formAttr: string;
}

export type SupportedFilterDomType =
  | 'select-single'
  | 'select-multiple'
  | 'checkbox'
  | 'radio'
  | 'color'
  | 'range'
  | 'date'
  | 'month'
  | 'week'
  | 'time';

export type FilterDomType = SupportedFilterDomType | (string & {});

export type FiltersMap = Record<string, string[]>;

export class Filter {
  readonly filterAttr: string;
  readonly formAttr: string;
  private $form: HTMLFormElement | null;
  private url: URL;
  private urlFilters: URLSearchParams;

  #checkAttrErrorMessage = `Filter initializing error.
  Please enter correct attribute for DOM element`;

  constructor(options: FilterOptions) {
    this.filterAttr = options.filterAttr;
    this.formAttr = options.formAttr;

    this.$form = document.querySelector<HTMLFormElement>(`[${this.formAttr}]`);
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(decodeURIComponent(this.url.searchParams.toString()));
  }

  static checkFilterDomType($filter: Element): FilterDomType | null {
    const tagName = $filter.tagName.toLowerCase();
    let filterDomType: FilterDomType | null = null;

    switch (tagName) {
      case 'select': {
        filterDomType = ($filter as HTMLSelectElement).multiple
          ? 'select-multiple'
          : 'select-single';

        break;
      }
      case 'input': {
        filterDomType = ($filter as HTMLInputElement).type;

        break;
      }
      default: {
        console.warn(`DOM element tag name '${tagName}' is not yet supported.`);

        break;
      }
    }

    return filterDomType;
  }

  #checkDomElementAttr(attr: string): boolean {
    const isExists =
      typeof attr === 'string' && document.querySelectorAll(`[${attr}]`).length !== 0;

    if (!isExists) {
      console.warn(`DOM element [${attr}] - is not exists`);
    }

    return isExists;
  }

  #parseFiltersFromUrl(urlFilters: URLSearchParams): FiltersMap {
    const filters = [...urlFilters.entries()];
    const objectFilters: FiltersMap = {};

    if (filters.length === 0) {
      return objectFilters;
    }

    new Map(filters).forEach((VALUES, type) => {
      if (!this.#checkDomElementAttr(`${this.filterAttr}="${type}"`)) {
        return;
      }

      objectFilters[type] = VALUES.split(' ');
    });

    return objectFilters;
  }

  #updateUrl(): void {
    this.url = new URL(window.location.href);
    this.urlFilters = new URLSearchParams(this.url.searchParams);
  }

  #updateFiltersDomFromUrl(urlFilters: URLSearchParams): void {
    const objectFilters = this.#parseFiltersFromUrl(urlFilters);

    if (Object.keys(objectFilters).length === 0) {
      return;
    }

    const $form = this.$form;

    if (!$form) {
      return;
    }

    Object.keys(objectFilters).forEach((type) => {
      const $filter = $form.querySelector(`[${this.filterAttr}="${type}"]`);

      if (!$filter) {
        return;
      }

      const filterType = Filter.checkFilterDomType($filter);

      switch (filterType) {
        case 'select-single':
        case 'color':
        case 'range':
        case 'date':
        case 'month':
        case 'week':
        case 'time': {
          ($filter as HTMLInputElement | HTMLSelectElement).value = objectFilters[type][0];

          break;
        }
        case 'select-multiple': {
          const $selectOptions = [...($filter as HTMLSelectElement).options];

          $selectOptions.forEach(($selectOption) => {
            const $option = $selectOption;

            if (objectFilters[type].indexOf($option.value) >= 0) {
              $option.selected = true;
            }
          });

          break;
        }
        case 'radio': {
          const radio = $form.querySelector<HTMLInputElement>(
            `[${this.filterAttr}="${type}"][value="${objectFilters[type][0]}"]`,
          );

          if (radio) {
            radio.checked = true;
          }

          break;
        }
        case 'checkbox': {
          objectFilters[type].forEach((value) => {
            const cb = $form.querySelector<HTMLInputElement>(
              `[${this.filterAttr}="${type}"][value="${value}"]`,
            );

            if (cb) {
              cb.checked = true;
            }
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

  #updateUrlFromFiltersDom(e: Event): void {
    const $filter = e.target as HTMLInputElement | HTMLSelectElement;
    const filterName = $filter.getAttribute(`${this.filterAttr}`);

    if (filterName === null) {
      return;
    }

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
        const filterValues = [...($filter as HTMLSelectElement).options]
          .filter((option) => option.selected)
          .map((option) => option.value);

        this.urlFilters.set(filterName, filterValues.join(' '));

        break;
      }
      case 'checkbox': {
        const cb = $filter as HTMLInputElement;
        const filterParams = `${this.urlFilters.get(filterName)}`.split(' ');

        if (this.urlFilters.has(filterName)) {
          if (cb.checked) {
            this.urlFilters.set(filterName, `${this.urlFilters.get(filterName)} ${cb.value}`);
          } else if (filterParams.length > 1) {
            this.urlFilters.delete(filterName);
            filterParams.splice(filterParams.indexOf(cb.value), 1);
            this.urlFilters.set(filterName, filterParams.join(' '));
          } else {
            this.urlFilters.delete(filterName);
          }
        } else {
          this.urlFilters.append(filterName, cb.value);
        }

        break;
      }
      default: {
        console.warn(`DOM element type '${filterType}' is not yet supported.`);

        break;
      }
    }
  }

  #setFiltersToUrl(newUrl: URL, setUrlFilters: URLSearchParams): void {
    const updatableUrl = new URL(newUrl);

    updatableUrl.search = setUrlFilters.toString();

    window.history.pushState(null, '', updatableUrl);

    this.#updateUrl();
  }

  #resetUrl(): void {
    Object.keys(this.#parseFiltersFromUrl(this.urlFilters)).forEach((filter) => {
      this.urlFilters.delete(filter);
    });

    this.#setFiltersToUrl(this.url, this.urlFilters);
  }

  #resetDom(): void {
    this.$form?.reset();
  }

  #eventListeners(): void {
    if (!this.$form) {
      return;
    }

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

  init(): void {
    if (!this.#checkDomElementAttr(this.formAttr)) {
      throw new Error(this.#checkAttrErrorMessage);
    }

    this.#updateFiltersDomFromUrl(this.urlFilters);

    this.#eventListeners();
  }

  updateDom(): void {
    this.#updateFiltersDomFromUrl(this.urlFilters);
  }

  resetUrl(): void {
    this.#resetUrl();
  }

  resetDom(): void {
    this.#resetDom();
  }

  setFiltersToUrl(newUrl: URL): void {
    this.#setFiltersToUrl(newUrl, this.urlFilters);
  }

  getFilters(): FiltersMap {
    return this.#parseFiltersFromUrl(this.urlFilters);
  }
}

export default Filter;
