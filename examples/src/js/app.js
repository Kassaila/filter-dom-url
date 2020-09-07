import Filter from '../../../dist/filter-inputs-url';

// When DOM is ready
window.addEventListener('load', () => {
  const $form = document.querySelector('[data-filter-form="example"]');
  const $filters = $form.querySelectorAll('[data-filter]');
  const $btnApply = $form.querySelector('[data-filter-apply]');
  const $btnReset = $form.querySelector('[data-filter-reset]');

  const filtersCreating = new Filter({
    formAttr: 'data-filter-form="example"',
    filterAttr: 'data-filter',
  });

  function _renderFromRequest() {
    const baseUrl = new URL(window.location.href);

    filtersCreating.setFiltersToUrl(baseUrl);

    const object = filtersCreating.getFiltersFromUrl();

    const params = Object.entries(object);
    const objectRequest = {};

    params.forEach((el) => {
      objectRequest[el[0]] = el[1].join('+');
    });

    // log request
    console.log(objectRequest);
  }

  function _updateFormButtons() {
    const isFiltersSelected = Object.entries(filtersCreating.getFiltersFromUrl()).length > 0
      || window.location.search.length > 0;

    if (!isFiltersSelected) {
      $btnApply.setAttribute('disabled', 'disabled');

      $btnReset.setAttribute('disabled', 'disabled');
    } else {
      $btnApply.removeAttribute('disabled');

      $btnReset.removeAttribute('disabled');
    }
  }

  function _eventListeners() {
    // Button apply
    $btnApply.addEventListener('click', () => {
      _renderFromRequest();
      _updateFormButtons();
    });

    // Button reset
    $btnReset.addEventListener('click', () => {
      filtersCreating.resetFilters();
      filtersCreating.resetUrl();

      _renderFromRequest();
      _updateFormButtons();
    });

    $filters.forEach(($filter) => {
      $filter.addEventListener('change', () => {
        _updateFormButtons();
      });
    });
  }

  function init() {
    filtersCreating.initFilters();

    _updateFormButtons();

    _eventListeners();
  }

  init();
});
