/**
 * @name SpanComponent
 * @description span with text length and ap title style
 * @example <truncated-aptitle apstyle textlength="30">everything you need to know about headline style 
 *          and capitalization</truncated-aptitle> will result in "Everything You Need to Know..."
 * @param {boolean} apstyle - styling according to AP style
 * @param {string} textlength - number of characters to trim to
 * 
 * @notes We may be limited with attributeChangedCallback due to the current specifications of 
 *        the Custom Elements API, which may not support the lifecycle callbacks attributeChangedCallback 
 *        and adoptedCallback for customized built-in elements properly. I am using the MutationObserver 
 *        interface to watch for changes to the element. 
 */

class TruncatedAPTitle extends HTMLSpanElement {
  
  constructor() {
    super();

    // get all attributes
    this.allAttributes = this.getAttributeNames();
    // reflecting properties to attributes
    this.allAttributes.forEach((attribute) => {
      Object.defineProperty(this, attribute, {
        get() {
          return this.getAttribute(attribute);
        },
        set(value) {
          if (value) {
            this.setAttribute(attribute, value);
          } else {
            // for boolean attributes, the presence of the attribute represents true
            this.removeAttribute(attribute);
          }
        },
      });
    });

    // need to cache the original attributes so we can reflect the textContent
    // properly. For example a change to the textlength attribute will need to
    // be reflected in the textContent.
    this.originalAttributes = {};

    // watch for textContent and boolean attribute changes
    this.mutationObserver = new MutationObserver(this.mutationObserverCallback.bind(this));
    this.mutationObserver.observe(this, { 
      attributes: true,
      characterData: true, 
      childList: true
    });
  }

  // observe these component attributes
  static get observedAttributes() {
    return ['textlength', 'apstyle'];
  }
  
  // attribute change
  attributeChangedCallback(property, oldValue, newValue) {
    if (!oldValue || oldValue === newValue) return;

    if (property === 'textlength') {
      this.updateTextContent(this.originalAttributes.text);
    }
  }

  // boolean attributes are watched with a mutation observer
  mutationObserverCallback(mutations) {
    mutations.forEach((mutation) => {
      // characterData and childList mutations are for textContent changes
      // characterData when textContent is changed directly with dev tools
      // childList when textContent is changed with js via properties
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        // if the new text is not a substring of the original text 
        // update the textContent in originalAttributes so we can reflect it
        // properly
        const newtext = mutation.target.textContent.toLowerCase().slice(0, -3);
        if (!this.originalAttributes.text.toLowerCase().includes(newtext)) {
          this.originalAttributes.text = mutation.target.textContent;
          this.updateTextContent(mutation.target.textContent);
        } else {
          this.updateTextContent(this.originalAttributes.text);
        }
      }

      // attributes mutations are for boolean attributes as they do not 
      // trigger the attributeChangedCallback. All other attributes are handled 
      // by the attributeChangedCallback.
      if (mutation.type === 'attributes' && mutation.attributeName === 'apstyle') {
          this.updateTextContent(this.originalAttributes.text);
      }
    });
  }

  async connectedCallback() {
    // cache original textContent
    this.originalAttributes = {
      text: this.textContent
    };
    // update textContent according to all attributes
    this.updateTextContent(this.originalAttributes.text);
  }

  updateTextContent(text) {
    const textlength = this.getAttribute('textlength');
    const trimmedText = this.truncateAfterWord(text, textlength);
    const apstyle = this.hasAttribute('apstyle');
    this.textContent = apstyle ? this.apStyleTitleCase(trimmedText) : trimmedText;
  }

  truncateAfterWord (str, chars, placeholder = '…') {
    if (!chars) return str;
    return str.length < chars ? str : `${str.substr( 0, str.substr(0, chars - placeholder.length).lastIndexOf(" "))}${placeholder}`;
  }

  capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  apStyleTitleCase(value) {
    if (!value) return ''

    const smallwords = 'a an and at but by for in nor of on or so the to up yet';
    const defaults = smallwords.split(' ');
  
    const stop = smallwords || defaults;
    const splitter = /(\s+|[-‑–—,:;!?()])/;
  
    return value
      .split(splitter)
      .map((word, index, all) => {
        // The splitter:
        if (index % 2) return word;
      
        const lower = word.toLowerCase();
  
        if (index !== 0 && index !== all.length - 1 && stop.includes(lower)) {
          return lower;
        }
  
        return this.capitalize(word);
      })
      .join('');
  }
}

// register component
customElements.define( 'truncated-aptitle', TruncatedAPTitle, { extends: 'span' } );