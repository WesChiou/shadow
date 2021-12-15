(function () {
  // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
  function isNumeric(value) {
    return !Number.isNaN(value - parseFloat(value));
  }

  function pagination(current, last, diameter = 5, headSize = 1, tailSize = 1) {
    const radius = Math.floor(diameter / 2);
    const isEven = diameter % 2 === 0;

    const visible = [];

    for (let i = 1; i <= last; i += 1) {
      if ((i <= headSize)
        || (last - i < tailSize)
        || (current <= radius && i <= diameter)
        || (current >= last - radius && i > last - diameter)
        || (!isEven && i - current >= -radius && i - current <= radius)
        || (isEven && i - current >= -radius + 1 && i - current <= radius)
      ) {
        visible.push(i);
      }
    }

    const result = [];

    for (let i = 0; i < visible.length; i += 1) {
      result.push(`${visible[i]}`);
      if (visible[i + 1] && visible[i + 1] - visible[i] > 1) {
        result.push('...');
      }
    }

    return result;
  }

  const SMART_MODE_ENUM = ['hidden', 'disabled'];

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
        pagesFormatFn,
      } = this || {};

      function makePreviousButton() {
        if (hidePreviousButton) {
          return '';
        }

        let attr = '';
        if (SMART_MODE_ENUM.includes(previousSmartMode)) {
          attr = previousSmartMode;
        }

        return `<button data-page="previous" data-of="shadow-pagination" ${+value === 1 ? attr : ''}>
                  <slot name="previous">&#706;</slot>
                </button>`;
      }

      function makePages() {
        let innerHTML = '';
        if (isNumeric(count)) {
          const pages = pagination(+value, +count);
          pages.forEach((v) => {
            if (isNumeric(v)) {
              innerHTML += `<button data-page="${v}" class="page ${+value === +v ? 'active' : ''}">
                              ${pagesFormatFn && typeof pagesFormatFn === 'function' ? pagesFormatFn(+v) : +v}
                            </button>`;
            } else if (v === '...') {
              innerHTML += '<span>...</span>';
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

        return `<button data-page="next" data-of="shadow-pagination" ${+value === +count ? attr : ''}>
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
          ${showFirstButton ? '<button data-page="first" data-of="shadow-pagination"><slot name="first">&larrb;</slot></button>' : ''}
          ${makePreviousButton()}
          ${makePages()}⁨⁨
          ${makeNextButton()}
          ${showLastButton ? '<button data-page="last" data-of="shadow-pagination"><slot name="last">&rarrb;</slot></button>' : ''}
        </div>
      `;

      this.shadowRoot.innerHTML = '';
      this.shadowRoot.append(template.content.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {

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

    adoptedCallback() {

    }
  }

  customElements.define('shadow-pagination', ShadowPagination);
}());
