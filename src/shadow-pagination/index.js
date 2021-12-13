(function () {
  // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
  function isNumeric(value) {
    return !Number.isNaN(value - parseFloat(value));
  }

  class ShadowPagination extends HTMLElement {
    #value = 1;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      shadowRoot.addEventListener('click', (event) => {
        const type = event.target.dataset.page;
        switch (type) {
          case 'first':
            this.value = 1;
            this.dispatchEvent(new Event('firstpage'));
            break;
          case 'prev':
            this.value -= 1;
            this.dispatchEvent(new Event('prevpage'));
            break;
          case 'next':
            this.value += 1;
            this.dispatchEvent(new Event('nextpage'));
            break;
          case 'last':
            this.value = this.pages;
            this.dispatchEvent(new Event('lastpage'));
            break;
          default:
            this.value = type;
            break;
        }
      });
    }

    get pages() {
      const pagesAttr = this.getAttribute('pages');
      if (isNumeric(pagesAttr)) {
        return pagesAttr;
      }
      return 0;
    }

    set pages(v) {
      if (isNumeric(v) && v >= 0) {
        this.setAttribute('pages', v);
      }
    }

    get value() {
      return this.#value;
    }

    set value(v) {
      if (!isNumeric(v) || !isNumeric(this.pages) || +this.#value === +v) {
        return;
      }

      if (v > 0 && v <= this.pages) {
        this.#value = v;
      } else if (v <= 0 && this.circular) {
        this.#value = this.pages;
      } else if (v > this.pages && this.circular) {
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

    render() {
      const { pages, value } = this || {};

      function makePages() {
        let innerHTML = '';
        if (isNumeric(pages)) {
          for (let i = 1; i <= parseInt(pages, 10); i += 1) {
            innerHTML += `<button data-page="${i}" class="page ${+value === i ? 'active' : ''}">${i}</button>`;
          }
        }
        return innerHTML;
      }

      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host { display: block; }
          #pages-box { display: inline-block; }
          .page.active { background-color: #ffffff; }
        </style>
        <div>
          <button data-page="first" class="first">&lt;&lt;</button>
          <button data-page="prev" class="prev">&lt;</button>
          <div id="pages-box">${makePages()}</div>
          <button data-page="next" class="next">&gt;</button>
          <button data-page="last" class="last">&gt;&gt;</button>
        </div>
      `;

      this.shadowRoot.innerHTML = '';
      this.shadowRoot.append(template.content.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {
      console.log(this);
    }

    static get observedAttributes() {
      return ['pages', 'value'];
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
      console.log(this);
    }
  }

  customElements.define('shadow-pagination', ShadowPagination);
}());
