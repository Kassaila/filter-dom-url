<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import Filter from '../../../../src/index';

const $form = ref<HTMLFormElement | null>(null);
const search = ref('');
const filters = ref<Record<string, string[]>>({});
let filter: Filter | null = null;

const refresh = (): void => {
  search.value = window.location.search;
  filters.value = filter?.getFilters() ?? {};
};

const onChange = (): void => {
  refresh();
};

const onPopState = (): void => {
  refresh();
};

const handleApply = (): void => {
  filter?.setFiltersToUrl(new URL(window.location.href));
  refresh();
};

const handleReset = (): void => {
  filter?.resetUrl();
  refresh();
};

onMounted(() => {
  filter = new Filter({
    formAttr: 'data-filter-form="live-demo"',
    filterAttr: 'data-filter',
  });

  filter.init();
  refresh();

  $form.value?.addEventListener('change', onChange);
  window.addEventListener('popstate', onPopState);
});

onBeforeUnmount(() => {
  $form.value?.removeEventListener('change', onChange);
  window.removeEventListener('popstate', onPopState);
});
</script>

<template>
  <form ref="$form" class="filter-demo" data-filter-form="live-demo" @submit.prevent>
    <div class="filter-demo__grid">
      <div class="filter-demo__group">
        <p>Checkbox</p>
        <label v-for="i in 5" :key="`cb-${i}`">
          <input
            :id="`demo-cb-${i}`"
            :value="`checkbox-${i}`"
            data-filter="checkbox"
            type="checkbox"
          />
          <span>checkbox {{ i }}</span>
        </label>
      </div>

      <div class="filter-demo__group">
        <p>Radio</p>
        <label v-for="i in 5" :key="`r-${i}`">
          <input
            :id="`demo-r-${i}`"
            :value="`radio-${i}`"
            name="demo-radio"
            data-filter="radio"
            type="radio"
          />
          <span>radio {{ i }}</span>
        </label>
      </div>

      <div class="filter-demo__group">
        <p>Select</p>
        <label v-for="i in 3" :key="`s-${i}`">
          <span>select {{ i }}</span>
          <select :id="`demo-s-${i}`" :data-filter="`select-${i}`">
            <option value="">—</option>
            <option v-for="j in 3" :key="j" :value="`option-${i}-${j}`">
              option-{{ i }}-{{ j }}
            </option>
          </select>
        </label>
      </div>

      <div class="filter-demo__group">
        <p>Select multiple</p>
        <label>
          <select id="demo-sm" data-filter="select-multiple" multiple size="5">
            <option v-for="i in 5" :key="i" :value="`option-${i}`">option-{{ i }}</option>
          </select>
        </label>
      </div>

      <div class="filter-demo__group">
        <p>Other inputs</p>
        <label>
          <span>color</span>
          <input id="demo-color" data-filter="color" type="color" />
        </label>
        <label>
          <span>range</span>
          <input id="demo-range" data-filter="range" type="range" min="0" max="100" step="10" />
        </label>
        <label>
          <span>date</span>
          <input id="demo-date" data-filter="date" type="date" />
        </label>
        <label>
          <span>month</span>
          <input id="demo-month" data-filter="month" type="month" />
        </label>
        <label>
          <span>week</span>
          <input id="demo-week" data-filter="week" type="week" />
        </label>
        <label>
          <span>time</span>
          <input id="demo-time" data-filter="time" type="time" />
        </label>
      </div>
    </div>

    <div class="filter-demo__actions">
      <button type="reset" @click="handleReset">Reset</button>
      <button type="button" @click="handleApply">Apply</button>
    </div>

    <pre class="filter-demo__state"><strong>location.search:</strong> {{ search || '(empty)' }}
<strong>getFilters():</strong> {{ JSON.stringify(filters, null, 2) }}</pre>
  </form>
</template>
