(function () {
  const LARGEST_INTEGER = 2147483647;
  const DEFAULT_COUNT = 1;
  const DEFAULT_VALUE = 1;
  const DEFAULT_DIAMETER = 5;
  const DEFAULT_HEADSIZE = 1;
  const DEFAULT_TAILSIZE = 1;
  const DEFAULT_BLURSIZE = 0;
  const SMART_MODE_ENUM = ['hidden', 'disabled'];
  const ELLIPSIS_STYLE_ENUM = ['hidden', 'ellipsis', 'no-ellipsis'];
  ELLIPSIS_STYLE_ENUM.default = 'ellipsis';
  let propertyValueIsSleeping = true;

  // https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
  function isNonNegativeInteger(n) {
    // eslint-disable-next-line
    return n >>> 0 === parseFloat(n);
  }

  function isPositiveInteger(n) {
    return isNonNegativeInteger(n) && n > 0;
  }

  // TODO: diameter can be 1
  function pagination(currentPage, pageCount, {
    diameter = 5,
    headSize = 1,
    tailSize = 1,
    blurSize = 0,
  } = {}) {
    // validation
    if (!isPositiveInteger(pageCount)
      || !isNonNegativeInteger(currentPage)
      || parseInt(currentPage, 10) > parseInt(pageCount, 10)
    ) {
      return [];
    }
    // correct parameters
    const CURR = parseInt(currentPage, 10);
    const COUNT = parseInt(pageCount, 10);
    const DIAMETER = isPositiveInteger(diameter) && diameter <= COUNT && diameter > 1
      ? +diameter
      : 5;
    const HEADSIZE = isNonNegativeInteger(headSize) && headSize <= COUNT ? +headSize : 1;
    const TAILSIZE = isNonNegativeInteger(tailSize) && tailSize <= COUNT ? +tailSize : 1;
    const BLURSIZE = isNonNegativeInteger(blurSize) && blurSize <= COUNT ? +blurSize : 0;

    const FIRST = 1;
    const radius = Math.floor(DIAMETER / 2);
    const isEven = DIAMETER % 2 === 0;

    const set = new Set();

    for (let i = FIRST; i <= HEADSIZE && i <= COUNT; i += 1) {
      set.add(i);
    }
    for (let i = Math.max(CURR - DIAMETER, FIRST); i <= CURR + DIAMETER && i <= COUNT; i += 1) {
      if ((CURR <= radius && i <= DIAMETER)
        || (CURR >= COUNT - radius && i > COUNT - DIAMETER)
        || (i - CURR >= -radius + isEven && i - CURR <= radius)
      ) {
        set.add(i);
      }
    }
    for (let i = COUNT - TAILSIZE + 1; i <= COUNT && i >= FIRST; i += 1) {
      set.add(i);
    }

    const tmp = Array.from(set);
    const result = [];

    if (tmp[0] && tmp[0] > FIRST && tmp[0] - FIRST <= BLURSIZE) {
      for (let i = FIRST; i < tmp[0]; i += 1) {
        result.push(i);
      }
    } else if (tmp[0] && tmp[0] > FIRST) {
      result.push('...');
    }
    for (let i = 0; i < tmp.length; i += 1) {
      const it = tmp[i];
      result.push(it);

      const next = tmp[i + 1];
      if (next === undefined) break;

      if (next - it > 1 && next - it - 1 <= BLURSIZE) {
        for (let j = it + 1; j < next; j += 1) {
          result.push(j);
        }
      } else if (next - it > 1) {
        result.push('...');
      }
    }
    if (tmp[tmp.length - 1] < COUNT && COUNT - tmp[tmp.length - 1] <= BLURSIZE) {
      for (let i = tmp[tmp.length - 1] + 1; i <= COUNT; i += 1) {
        result.push(i);
      }
    } else if (tmp[tmp.length - 1] < COUNT) {
      result.push('...');
    }

    return result;
  }

  class ShadowPagination extends HTMLElement {
    #value = 1;

    #pagesFormatFn = null;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      shadowRoot.addEventListener('click', (event) => {
        let button;
        const slot = event.composedPath().find((v) => v.tagName === 'SLOT');
        if (slot) {
          button = event.composedPath().find((v) => v.tagName === 'BUTTON' && v.dataset.of === 'shadow-pagination');
        } else {
          button = event.target.closest('button');
        }

        if (!button || button.disabled) return;

        const pageValue = button.dataset.page;
        switch (pageValue) {
          case 'first':
            this.value = 1;
            this.dispatchEvent(new Event('firstpage'));
            break;
          case 'previous':
            this.value -= 1;
            this.dispatchEvent(new Event('previouspage'));
            break;
          case 'next':
            this.value += 1;
            this.dispatchEvent(new Event('nextpage'));
            break;
          case 'last':
            this.value = this.count;
            this.dispatchEvent(new Event('lastpage'));
            break;
          default:
            this.value = pageValue;
            break;
        }
      });
    }

    setPrivateValue(v) {
      let n = parseInt(v, 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_VALUE || 1;
      }

      if (n > this.count) {
        n = this.circular ? 1 : this.count;
      } else if (n < 1) {
        n = this.circular ? this.count : 1;
      }

      if (this.#value !== n) {
        this.#value = n;
        this.dispatchEvent(new Event('change'));
        this.render();
      }
    }

    get value() {
      return parseInt(this.#value, 10);
    }

    set value(v) {
      propertyValueIsSleeping = false;
      this.setPrivateValue(v);
    }

    // IDL attributes

    get count() {
      let n = parseInt(this.getAttribute('count'), 10);
      if (!(isNonNegativeInteger(n) && n >= 1 && n <= LARGEST_INTEGER)) {
        n = DEFAULT_COUNT || 1;
      }
      return n;
    }

    set count(v) {
      let n = parseInt(v, 10);
      if (n === 0) {
        throw new RangeError('The count cannot be 0.');
      }
      if (!(isNonNegativeInteger(n) && n >= 1 && n <= LARGEST_INTEGER)) {
        n = DEFAULT_COUNT || 1;
      }
      this.setAttribute('count', `${n}`);

      if (n < this.value) {
        this.value = DEFAULT_VALUE;
      }
    }

    get circular() {
      return this.hasAttribute('circular');
    }

    set circular(v) {
      if (v) {
        this.setAttribute('circular', '');
      } else {
        this.removeAttribute('circular');
      }
    }

    get showFirstButton() {
      return this.hasAttribute('show-first-button');
    }

    set showFirstButton(v) {
      if (v) {
        this.setAttribute('show-first-button', '');
      } else {
        this.removeAttribute('show-first-button');
      }
      this.render();
    }

    get showLastButton() {
      return this.hasAttribute('show-last-button');
    }

    set showLastButton(v) {
      if (v) {
        this.setAttribute('show-last-button', '');
      } else {
        this.removeAttribute('show-last-button');
      }
      this.render();
    }

    get hidePreviousButton() {
      return this.hasAttribute('hide-previous-button');
    }

    set hidePreviousButton(v) {
      if (v) {
        this.setAttribute('hide-previous-button', '');
      } else {
        this.removeAttribute('hide-previous-button');
      }
      this.render();
    }

    get hideNextButton() {
      return this.hasAttribute('hide-next-button');
    }

    set hideNextButton(v) {
      if (v) {
        this.setAttribute('hide-next-button', '');
      } else {
        this.removeAttribute('hide-next-button');
      }
      this.render();
    }

    get nextSmartMode() {
      const tmp = this.getAttribute('next-smart-mode');
      return SMART_MODE_ENUM.includes(tmp) ? tmp : '';
    }

    set nextSmartMode(v) {
      if (v === null) {
        this.removeAttribute('next-smart-mode');
      } else {
        this.setAttribute('next-smart-mode', v);
      }
    }

    get previousSmartMode() {
      const tmp = this.getAttribute('previous-smart-mode');
      return SMART_MODE_ENUM.includes(tmp) ? tmp : '';
    }

    set previousSmartMode(v) {
      if (v === null) {
        this.removeAttribute('previous-smart-mode');
      } else {
        this.setAttribute('previous-smart-mode', v);
      }
    }

    // TODO: Case-insensitive, no leading and tailing space.
    get ellipsisStyle() {
      const tmp = this.getAttribute('ellipsis-style');
      return ELLIPSIS_STYLE_ENUM.includes(tmp) ? tmp : ELLIPSIS_STYLE_ENUM.default;
    }

    set ellipsisStyle(v) {
      this.setAttribute('ellipsis-style', v);
    }

    get ellipsisDiameter() {
      let n = parseInt(this.getAttribute('ellipsis-diameter'), 10);
      if (!(isNonNegativeInteger(n) && n >= 1 && n <= LARGEST_INTEGER)) {
        n = DEFAULT_DIAMETER || 1;
      }
      return n;
    }

    set ellipsisDiameter(v) {
      let n = parseInt(v, 10);
      if (n === 0) {
        throw new RangeError('The ellipsis-diameter cannot be 0');
      }
      if (!(isNonNegativeInteger(n) && n >= 1 && n <= LARGEST_INTEGER)) {
        n = DEFAULT_DIAMETER || 1;
      }
      this.setAttribute('ellipsis-diameter', `${n}`);
    }

    get ellipsisHeadsize() {
      let n = parseInt(this.getAttribute('ellipsis-headsize'), 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_HEADSIZE || 0;
      }
      return n;
    }

    set ellipsisHeadsize(v) {
      let n = parseInt(v, 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_HEADSIZE || 0;
      }
      this.setAttribute('ellipsis-headsize', `${n}`);
    }

    get ellipsisTailsize() {
      let n = parseInt(this.getAttribute('ellipsis-tailsize'), 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_TAILSIZE || 0;
      }
      return n;
    }

    set ellipsisTailsize(v) {
      let n = parseInt(v, 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_TAILSIZE || 0;
      }
      this.setAttribute('ellipsis-tailsize', `${n}`);
    }

    get ellipsisBlursize() {
      let n = parseInt(this.getAttribute('ellipsis-blursize'), 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_BLURSIZE || 0;
      }
      return n;
    }

    set ellipsisBlursize(v) {
      let n = parseInt(v, 10);
      if (!(isNonNegativeInteger(n) && n <= LARGEST_INTEGER)) {
        n = DEFAULT_BLURSIZE || 0;
      }
      this.setAttribute('ellipsis-blursize', `${n}`);
    }

    get pagesFormatFn() {
      return this.#pagesFormatFn;
    }

    set pagesFormatFn(fn) {
      this.#pagesFormatFn = fn;
      this.render();
    }

    // Render methods

    render() {
      const {
        count,
        value,
        showFirstButton,
        showLastButton,
        hidePreviousButton,
        hideNextButton,
        nextSmartMode,
        previousSmartMode,
        ellipsisStyle,
        pagesFormatFn,
        ellipsisDiameter,
        ellipsisHeadsize,
        ellipsisTailsize,
        ellipsisBlursize,
      } = this || {};

      function makePreviousButton() {
        if (hidePreviousButton) return '';
        return `<button data-page="previous" data-of="shadow-pagination" part="previous" ${value === 1 ? previousSmartMode : ''}>
                  <slot name="previous">&#706;</slot>
                </button>`;
      }

      function makePages() {
        let pages = [];
        if (ellipsisStyle === 'no-ellipsis') {
          for (let i = 1; i <= count; i += 1) {
            pages.push(i);
          }
        } else {
          pages = pagination(value, count, {
            diameter: ellipsisDiameter,
            headSize: ellipsisHeadsize,
            tailSize: ellipsisTailsize,
            blurSize: ellipsisBlursize,
          });
        }

        let innerHTML = '';
        pages.forEach((v) => {
          const n = parseInt(v, 10);
          if (v === '...') {
            const text = ellipsisStyle === 'ellipsis' ? '...' : '';
            innerHTML += `<span part="ellipsis">${text}</span>`;
          } else if (isNonNegativeInteger(n)) {
            innerHTML += `<button data-page="${n}" class="page ${value === n ? 'active' : ''}" part="page ${value === n ? 'active' : ''}">
                            ${typeof pagesFormatFn === 'function' ? pagesFormatFn(n) : n}
                          </button>`;
          }
        });
        return innerHTML;
      }

      function makeNextButton() {
        if (hideNextButton) return '';
        return `<button data-page="next" data-of="shadow-pagination" part="next" ${value === count ? nextSmartMode : ''}>
                  <slot name="next">&#707;</slot>
                </button>`;
      }

      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host { display: block; }
          .page.active { background-color: #fff; }
        </style>
        <div>
          ${showFirstButton ? '<button data-page="first" data-of="shadow-pagination" part="first"><slot name="first">&larrb;</slot></button>' : ''}
          ${makePreviousButton()}
          ${makePages()}
          ${makeNextButton()}
          ${showLastButton ? '<button data-page="last" data-of="shadow-pagination" part="last"><slot name="last">&rarrb;</slot></button>' : ''}
        </div>
      `;

      this.shadowRoot.innerHTML = '';
      this.shadowRoot.append(template.content.cloneNode(true));
    }

    static get observedAttributes() {
      return [
        'count',
        'value',
        'show-first-button', // reflect to showFirstButton
        'show-last-button', // reflect to showLastButton
        'hide-previous-button', // reflect to hidePreviousButton
        'hide-next-button', // reflect to hideNextButton
        'next-smart-mode', // reflect to nextSmartMode
        'previous-smart-mode', // reflect to previousSmartMode
        'ellipsis-style', // reflect to ellipsisStyle
        'ellipsis-diameter', // reflect to ellipsisDiameter
        'ellipsis-headsize', // reflect to ellipsisHeadsize
        'ellipsis-tailsize', // reflect to ellipsisTailsize
        'ellipsis-blursize', // reflect to ellipsisBlursize
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value') {
        if (propertyValueIsSleeping) {
          this.setPrivateValue(newValue);
        }
        return;
      }

      if (oldValue === newValue) {
        return;
      }

      this.render();
    }
  }

  customElements.define('shadow-pagination', ShadowPagination);
}());
