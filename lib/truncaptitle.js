/**
 * @name TruncatedAPTitle
 * @description span with text length and ap title style
 * @example <span is="truncated-aptitle" apstyle textlength="30">everything you need to know about headline style 
 *          and capitalization</span> will result in "Everything You Need to Know..."
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

  // explicitly define properties reflecting to attributes
  get textlength() {
    return this.getAttribute('textlength');
  }
  set textlength(value) { 
    if (value) {
      this.setAttribute('textlength', value); 
    } else {
      this.removeAttribute('textlength');
    }
  }
  get apstyle() {
    return this.hasAttribute('apstyle');
  }
  set apstyle(value) {
    if (value) {
      this.setAttribute('apstyle', '');
    } else {
      this.removeAttribute('apstyle');
    }
  }
  
  // attribute change
  attributeChangedCallback(property, oldValue, newValue) {}

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
      if (mutation.type === 'attributes') {
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

  /**
   * 
   * @param {*} str 
   * @returns An AP style formatted string
   * Simple implementation of title-casing according to the AP Stylebook. 
   * One general rule is to capitalize the first word, the last word, and 
   * all words in between except for certain short conjunctions, 
   * prepositions, and articles. 
   */
  apStyleTitleCase(str) {
    if (!str) return ''
    const lowercaseWords = ['a', 'an', 'and', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
    return str
      .toLowerCase()
      .replace(/\w+/g, function (word, index) {
        // Always capitalize the first and last word
        if (index === 0 || index + word.length === str.length) return word.charAt(0).toUpperCase() + word.substr(1);
        
        // Otherwise, only capitalize if it's not in the list of lowercase words
        return lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.substr(1);
      });
  }
}

// register component
customElements.define( 'truncated-aptitle', TruncatedAPTitle, { extends: 'span' } );