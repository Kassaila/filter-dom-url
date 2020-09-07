import Filter from '../../../dist/filter-inputs-url';

// When DOM is ready
window.addEventListener('load', () => {
  const $form = document.querySelector('[data-filter-form="example"]');
  const $filters = $form.querySelectorAll('[data-filter]');
  const $btnApply = $form.querySelector('[data-filter-apply]');
  const $btnReset = $form.querySelector('[data-filter-reset]');

  const filterExample = new Filter({
    formAttr: 'data-filter-form="example"',
    filterAttr: 'data-filter',
  });

  function _renderFromRequest() {
    const baseUrl = new URL(window.location.href);

    filterExample.setFiltersToUrl(baseUrl);

    const object = filterExample.getFiltersFromUrl();

    const params = Object.entries(object);
    const objectRequest = {};

    params.forEach((el) => {
      objectRequest[el[0]] = el[1].join('+');
    });

    // log request
    console.log(objectRequest);
  }

  function _updateFormButtons() {
    const isFiltersSelected = Object.entries(filterExample.getFiltersFromUrl()).length > 0
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
      filterExample.resetFilters();
      filterExample.resetUrl();

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
    filterExample.initFilters();

    _updateFormButtons();

    _eventListeners();
  }

  init();
});
