import Filter from '../../../dist/filter-inputs-url';

window.addEventListener('load', () => {
  const $form = document.querySelector('[data-filter-form="example"]');
  const $filters = $form.querySelectorAll('[data-filter]');
  const $btnApply = $form.querySelector('[data-filter-apply]');
  const $btnReset = $form.querySelector('[data-filter-reset]');

  const filterExample = new Filter({
    formAttr: 'data-filter-form="example"',
    filterAttr: 'data-filter',
  });

  function _sendRequest() {
    const baseUrl = new URL(window.location.href);

    filterExample.setFiltersToUrl(baseUrl);

    const request = filterExample.getFilters();

    // log request
    console.log(request);
  }

  function _updateFormButtons() {
    const isFiltersSelected = Object.entries(filterExample.getFilters()).length > 0
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
      _sendRequest();
      _updateFormButtons();
    });

    // Button reset
    $btnReset.addEventListener('click', () => {
      filterExample.resetDom();
      filterExample.resetUrl();

      _sendRequest();
      _updateFormButtons();
    });

    $filters.forEach(($filter) => {
      $filter.addEventListener('change', () => {
        _updateFormButtons();
      });
    });
  }

  filterExample.init();

  _updateFormButtons();

  _eventListeners();
});
