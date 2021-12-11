(function () {
  // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
  function isNumeric(value) {
    return !Number.isNaN(value - parseFloat(value));
  }

  function createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
        }
        #pages-box {
          display: inline-block;
        }
        .page.active {
          background-color: #ffffff;
        }
      </style>
      <div>
        <button data-page="first" class="first">&lt;&lt;</button>
        <button data-page="prev" class="prev">&lt;</button>
        <div id="pages-box"></div>
        <button data-page="next" class="next">&gt;</button>
        <button data-page="last" class="last">&gt;&gt;</button>
      </div>
    `;
    return template;
  }

  function createPagesHTML(pages) {
    let innerHTML = '';
    if (isNumeric(pages)) {
      for (let i = 1; i <= parseInt(pages, 10); i += 1) {
        innerHTML += `<button data-page="${i}" class="page">${i}</button>`;
      }
    }
    return innerHTML;
  }

  class ShadowPagination extends HTMLElement {
    #value = 1;

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.append(createTemplate().content.cloneNode(true));

      this.elementPagesBox = shadowRoot.querySelector('#pages-box');

      shadowRoot.addEventListener('click', (event) => {
        const currPage = event.target.dataset.page;
        switch (currPage) {
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
            this.value = currPage;
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
        return; // avoid dispatchEvent and updateView
      }

      this.dispatchEvent(new Event('change'));
      this.updateView();
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

    updateView() {
      const pageElements = Array.from(this.elementPagesBox.children);
      pageElements.forEach((v) => {
        v.classList.remove('active');
        if (v.dataset.page === `${this.value}`) {
          v.classList.add('active');
        }
      });
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
      if (name === 'pages') {
        this.elementPagesBox.innerHTML = createPagesHTML(this.pages);
        this.updateView();
      } else if (name === 'value') {
        setTimeout(() => {
          this.value = newValue;
        });
      }
    }

    adoptedCallback() {
      console.log(this);
    }
  }

  customElements.define('shadow-pagination', ShadowPagination);
}());
