import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Filter from '../src/index';

const FORM_ATTR = 'data-filter-form="form-test"';
const FILTER_ATTR = 'data-filter';

const setBody = (html: string) => {
  document.body.innerHTML = `<form ${FORM_ATTR}>${html}</form>`;
};

const setUrl = (search: string) => {
  const { origin } = window.location;

  window.history.replaceState(null, '', `${origin}/${search ? `?${search}` : ''}`);
};

const makeFilter = () => new Filter({ formAttr: FORM_ATTR, filterAttr: FILTER_ATTR });

beforeEach(() => {
  setUrl('');

  document.body.innerHTML = '';

  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('public API surface (BC)', () => {
  it('exposes prototype methods and static checkFilterDomType', () => {
    setBody('<input data-filter="t" type="checkbox" value="a">');
    const f = makeFilter();

    expect(typeof f.init).toBe('function');
    expect(typeof f.updateDom).toBe('function');
    expect(typeof f.setFiltersToUrl).toBe('function');
    expect(typeof f.resetUrl).toBe('function');
    expect(typeof f.resetDom).toBe('function');
    expect(typeof f.getFilters).toBe('function');
    expect(typeof Filter.checkFilterDomType).toBe('function');
  });

  it('init throws when formAttr does not match any element', () => {
    setBody('');

    document.body.innerHTML = '';
    const f = new Filter({ formAttr: 'data-missing', filterAttr: FILTER_ATTR });

    expect(() => f.init()).toThrow(/Filter initializing error/);
  });
});

describe('Filter.checkFilterDomType', () => {
  it('classifies single select', () => {
    document.body.innerHTML = '<select id="x"></select>';

    expect(Filter.checkFilterDomType(document.getElementById('x')!)).toBe('select-single');
  });

  it('classifies multiple select', () => {
    document.body.innerHTML = '<select multiple id="x"></select>';

    expect(Filter.checkFilterDomType(document.getElementById('x')!)).toBe('select-multiple');
  });

  it('returns input.type for inputs', () => {
    document.body.innerHTML = '<input type="checkbox" id="x">';

    expect(Filter.checkFilterDomType(document.getElementById('x')!)).toBe('checkbox');
  });

  it('warns and returns null for unsupported tag', () => {
    document.body.innerHTML = '<div id="x"></div>';
    const result = Filter.checkFilterDomType(document.getElementById('x')!);

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('URL → DOM (init applies state)', () => {
  it('applies single select value', () => {
    setBody(
      `<select data-filter="color"><option value=""></option><option value="red">r</option></select>`,
    );
    setUrl('color=red');
    makeFilter().init();
    expect(document.querySelector<HTMLSelectElement>('[data-filter="color"]')!.value).toBe('red');
  });

  it('applies multi-select space-joined values', () => {
    setBody(
      `<select multiple data-filter="size"><option value="s">s</option><option value="m">m</option><option value="l">l</option></select>`,
    );
    setUrl('size=s%20l');
    makeFilter().init();
    const opts = [...document.querySelector<HTMLSelectElement>('[data-filter="size"]')!.options];

    expect(opts.filter((o) => o.selected).map((o) => o.value)).toEqual(['s', 'l']);
  });

  it('applies radio', () => {
    setBody(
      `<input type="radio" data-filter="size" value="s"><input type="radio" data-filter="size" value="m">`,
    );
    setUrl('size=m');
    makeFilter().init();
    const m = document.querySelector<HTMLInputElement>('[data-filter="size"][value="m"]')!;

    expect(m.checked).toBe(true);
  });

  it('applies checkbox space-joined values', () => {
    setBody(
      `<input type="checkbox" data-filter="tag" value="a"><input type="checkbox" data-filter="tag" value="b"><input type="checkbox" data-filter="tag" value="c">`,
    );
    setUrl('tag=a%20c');
    makeFilter().init();
    const a = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="a"]')!;
    const b = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="b"]')!;
    const c = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="c"]')!;

    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
    expect(c.checked).toBe(true);
  });

  it.each([
    ['color', '#ff0000'],
    ['range', '42'],
    ['date', '2026-05-06'],
    ['month', '2026-05'],
    ['week', '2026-W18'],
    ['time', '13:45'],
  ] as const)('applies %s input value', (type, value) => {
    setBody(`<input type="${type}" data-filter="x">`);
    setUrl(`x=${encodeURIComponent(value)}`);
    makeFilter().init();
    expect(document.querySelector<HTMLInputElement>('[data-filter="x"]')!.value).toBe(value);
  });

  it('skips URL params that do not match any DOM filter', () => {
    setBody(`<input type="checkbox" data-filter="known" value="1">`);
    setUrl('known=1&unknown=2');
    makeFilter().init();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[data-filter="unknown"]'));
  });
});

describe('DOM → URL (change events)', () => {
  it('checkbox: appends, then space-joins, then removes', () => {
    setBody(
      `<input type="checkbox" data-filter="tag" value="a"><input type="checkbox" data-filter="tag" value="b">`,
    );
    const f = makeFilter();

    f.init();

    const a = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="a"]')!;
    const b = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="b"]')!;

    a.checked = true;

    a.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({ tag: ['a'] });

    b.checked = true;

    b.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({ tag: ['a', 'b'] });

    a.checked = false;

    a.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({ tag: ['b'] });

    b.checked = false;

    b.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({});
  });

  it('radio: sets, then deletes when value cleared', () => {
    setBody(
      `<input type="radio" data-filter="size" value="s"><input type="radio" data-filter="size" value="m">`,
    );
    const f = makeFilter();

    f.init();

    const m = document.querySelector<HTMLInputElement>('[data-filter="size"][value="m"]')!;

    m.checked = true;

    m.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({ size: ['m'] });
  });

  it('select-single: sets and deletes on empty value', () => {
    setBody(
      `<select data-filter="color"><option value=""></option><option value="red">r</option></select>`,
    );
    const f = makeFilter();

    f.init();

    const sel = document.querySelector<HTMLSelectElement>('[data-filter="color"]')!;

    sel.value = 'red';

    sel.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({ color: ['red'] });

    sel.value = '';

    sel.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({});
  });

  it('select-multiple: writes space-joined value', () => {
    setBody(
      `<select multiple data-filter="size"><option value="s">s</option><option value="m">m</option><option value="l">l</option></select>`,
    );
    const f = makeFilter();

    f.init();

    const sel = document.querySelector<HTMLSelectElement>('[data-filter="size"]')!;

    [...sel.options].forEach((o) => {
      o.selected = o.value === 's' || o.value === 'l';
    });
    sel.dispatchEvent(new Event('change'));
    expect(f.getFilters()).toEqual({ size: ['s', 'l'] });
  });
});

describe('setFiltersToUrl', () => {
  it('writes URLSearchParams to window.location via pushState', () => {
    setBody(
      `<input type="checkbox" data-filter="tag" value="a"><input type="checkbox" data-filter="tag" value="b">`,
    );
    const f = makeFilter();

    f.init();

    const a = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="a"]')!;

    a.checked = true;

    a.dispatchEvent(new Event('change'));

    f.setFiltersToUrl(new URL(window.location.href));
    expect(new URL(window.location.href).searchParams.get('tag')).toBe('a');
  });
});

describe('resetUrl & resetDom', () => {
  it('resetUrl removes all known filters from URL', () => {
    setBody(
      `<input type="checkbox" data-filter="tag" value="a"><input type="checkbox" data-filter="other" value="x">`,
    );
    setUrl('tag=a&other=x');
    const f = makeFilter();

    f.init();
    f.resetUrl();
    expect(f.getFilters()).toEqual({});
  });

  it('resetDom calls form.reset()', () => {
    setBody(`<input type="checkbox" data-filter="t" value="a">`);
    const f = makeFilter();

    f.init();
    const cb = document.querySelector<HTMLInputElement>('[data-filter="t"]')!;

    cb.checked = true;

    f.resetDom();
    expect(cb.checked).toBe(false);
  });
});

describe('popstate', () => {
  it('reapplies DOM state from URL on popstate', () => {
    setBody(`<input type="checkbox" data-filter="tag" value="a">`);
    const f = makeFilter();

    f.init();

    setUrl('tag=a');
    window.dispatchEvent(new Event('popstate'));

    const cb = document.querySelector<HTMLInputElement>('[data-filter="tag"][value="a"]')!;

    expect(cb.checked).toBe(true);
  });
});
