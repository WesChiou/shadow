(function () {
  // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
  function isNumeric(value) {
    return !Number.isNaN(value - parseFloat(value));
  }

  function pagination(currentPage, pageCount, {
    diameter = 5,
    headSize = 1,
    tailSize = 1,
    blurSize = 0,
  } = {}) {
    // https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
    function isNonNegativeInteger(n) {
      // eslint-disable-next-line
      return n >>> 0 === parseFloat(n);
    }
    function isPositiveInteger(n) {
      return isNonNegativeInteger(n) && n > 0;
    }
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

  const SMART_MODE_ENUM = ['hidden', 'disabled'];
  const ELLIPSIS_STYLE_ENUM = ['hidden', 'ellipsis'];
  ELLIPSIS_STYLE_ENUM.default = 'ellipsis';

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

        const type = button.dataset.page;
        switch (type) {
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
            this.value = +type;
            break;
        }
      });
    }

    get count() {
      const pagesAttr = this.getAttribute('count');
      if (isNumeric(pagesAttr)) {
        return pagesAttr;
      }
      return 0;
    }

    set count(v) {
      if (isNumeric(v) && v >= 0) {
        this.setAttribute('count', v);
      }
    }

    get value() {
      return this.#value;
    }

    set value(v) {
      if (!isNumeric(v) || !isNumeric(this.count) || +this.#value === +v) {
        return;
      }

      if (v > 0 && v <= this.count) {
        this.#value = +v;
      } else if (v <= 0 && this.circular) {
        this.#value = this.count;
      } else if (v > this.count && this.circular) {
        this.#value = 1;
      } else {
        return; // avoid dispatchEvent and render
      }

      this.dispatchEvent(new Event('change'));
      this.render();
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
      return this.getAttribute('next-smart-mode');
    }

    set nextSmartMode(v) {
      this.setAttribute('next-smart-mode', v);
    }

    get previousSmartMode() {
      return this.getAttribute('previous-smart-mode');
    }

    set previousSmartMode(v) {
      this.setAttribute('previous-smart-mode', v);
    }

    get ellipsisStyle() {
      return this.getAttribute('ellipsis-style');
    }

    set ellipsisStyle(v) {
      this.setAttribute('ellipsis-style', v);
    }

    // TODO: 属性校验
    get ellipsisDiameter() {
      return this.getAttribute('ellipsis-diameter');
    }

    set ellipsisDiameter(v) {
      this.setAttribute('ellipsis-diameter', v);
    }

    get ellipsisHeadsize() {
      return this.getAttribute('ellipsis-headsize');
    }

    set ellipsisHeadsize(v) {
      this.setAttribute('ellipsis-headsize', v);
    }

    get ellipsisTailsize() {
      return this.getAttribute('ellipsis-tailsize');
    }

    set ellipsisTailsize(v) {
      this.setAttribute('ellipsis-tailsize', v);
    }

    get ellipsisBlursize() {
      return this.getAttribute('ellipsis-blursize');
    }

    set ellipsisBlursize(v) {
      this.setAttribute('ellipsis-blursize', v);
    }

    get pagesFormatFn() {
      return this.#pagesFormatFn;
    }

    set pagesFormatFn(fn) {
      if (!fn || typeof fn !== 'function') {
        return;
      }
      this.#pagesFormatFn = fn;
      this.render();
    }

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
        if (hidePreviousButton) {
          return '';
        }

        let attr = '';
        if (SMART_MODE_ENUM.includes(previousSmartMode)) {
          attr = previousSmartMode;
        }

        return `<button data-page="previous" data-of="shadow-pagination" part="previous" ${+value === 1 ? attr : ''}>
                  <slot name="previous">&#706;</slot>
                </button>`;
      }

      function makePages() {
        let innerHTML = '';
        if (isNumeric(count)) {
          const diameter = isNumeric(ellipsisDiameter) ? ellipsisDiameter : 5;
          const headSize = isNumeric(ellipsisHeadsize) ? ellipsisHeadsize : 1;
          const tailSize = isNumeric(ellipsisTailsize) ? ellipsisTailsize : 1;
          const blurSize = isNumeric(ellipsisBlursize) ? ellipsisBlursize : 0;
          const pages = pagination(value, count, {
            diameter,
            headSize,
            tailSize,
            blurSize,
          });
          pages.forEach((v) => {
            if (isNumeric(v)) {
              innerHTML += `<button data-page="${v}" class="page ${+value === +v ? 'active' : ''}" part="page ${+value === +v ? 'active' : ''}">
                              ${pagesFormatFn && typeof pagesFormatFn === 'function' ? pagesFormatFn(+v) : +v}
                            </button>`;
            } else if (v === '...') {
              let ellipsis = ELLIPSIS_STYLE_ENUM.default;
              if (ELLIPSIS_STYLE_ENUM.includes(ellipsisStyle)) {
                ellipsis = ellipsisStyle;
              }

              const text = ellipsis === 'ellipsis' ? '...' : '';
              innerHTML += `<span part="ellipsis">${text}</span>`;
            }
          });
        }
        return innerHTML;
      }

      function makeNextButton() {
        if (hideNextButton) {
          return '';
        }

        let attr = '';
        if (SMART_MODE_ENUM.includes(nextSmartMode)) {
          attr = nextSmartMode;
        }

        return `<button data-page="next" data-of="shadow-pagination" part="next" ${+value === +count ? attr : ''}>
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
          ${makePages()}⁨⁨
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
        'show-first-button',
        'show-last-button',
        'hide-previous-button',
        'hide-next-button',
        'next-smart-mode',
        'previous-smart-mode',
        'ellipsis-style',
        'ellipsis-diameter',
        'ellipsis-headsize',
        'ellipsis-tailsize',
        'ellipsis-blursize',
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value') {
        this.value = newValue;
      }

      if (oldValue !== newValue) {
        this.render();
      }
    }
  }

  customElements.define('shadow-pagination', ShadowPagination);
}());
