(function () {
  // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
  function isNumeric(value) {
    return !Number.isNaN(value - parseFloat(value));
  }

  const SMART_MODE_ENUM = ['hidden', 'disabled'];

  class ShadowPagination extends HTMLElement {
    #value = 1;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      shadowRoot.addEventListener('click', (event) => {
        const button = event.target.closest('button');

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
      } = this || {};

      function makePreviousButton() {
        if (hidePreviousButton) {
          return '';
        }

        let attr = '';
        if (SMART_MODE_ENUM.includes(previousSmartMode)) {
          attr = previousSmartMode;
        }

        return `<button data-page="previous" ${+value === 1 ? attr : ''}>
                  <slot name="previous">&#706;</slot>
                </button>`;
      }

      function makePages() {
        let innerHTML = '';
        if (isNumeric(count)) {
          for (let i = 1; i <= parseInt(count, 10); i += 1) {
            innerHTML += `<button data-page="${i}" class="page ${+value === i ? 'active' : ''}">${i}</button>`;
          }
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

        return `<button data-page="next" ${+value === +count ? attr : ''}>
                  <slot name="next">&#707;</slot>
                </button>`;
      }

      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host { display: block; }
          .page.active { background-color: #ffffff; }
        </style>
        <div>
          ${showFirstButton ? '<button data-page="first">&larrb;</button>' : ''}
          ${makePreviousButton()}
          ${makePages()}⁨⁨
          ${makeNextButton()}
          ${showLastButton ? '<button data-page="last">&rarrb;</button>' : ''}
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
