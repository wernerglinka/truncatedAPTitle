/**
 * @name TruncatedAPTitle
 * @description Custom element with text length and ap title style
 * @example <truncated-aptitle apstyle textlength="30">everything you need to know about headline style 
 *          and capitalization</truncated-aptitle> will result in "Everything You Need to Know..."
 * @param {boolean} apstyle - styling according to AP style
 * @param {string} textlength - number of characters to trim to
 * 
 * @notes Due to the Custom Elements API's current specifications, there might 
 * be limitations with `attributeChangedCallback`. It may not properly support 
 * lifecycle callbacks like `attributeChangedCallback` and `adoptedCallback` 
 * for customized built-in elements. To monitor changes to the element, I utilize
 * the `MutationObserver` interface.
 */

class TruncatedAPTitle extends HTMLElement {
  
  constructor() {
    super();

    // cache the state of the component
    this.props = {
      text: "",
      textlength: "",
      apstyle: false
    };

    // reflect internal state to textContent
    this.updateTextContent = text => {
      if (!text) return;
      const textlength = this.props.textlength;
      const trimmedText = this.truncateAfterWord(text, textlength);
      const apstyle = this.props.apstyle;
      this.textContent = apstyle ? this.apStyleTitleCase(trimmedText) : trimmedText;
    };

    // watch for textContent and boolean attribute changes
    this.mutationObserver = new MutationObserver(this.mutationObserverCallback.bind(this));
    this.mutationObserver.observe(this, { 
      characterData: true, 
      childList: true,
      attributes: true
    });
  } // end constructor


  // observe these component attributes
  static get observedAttributes() {
    return ['textlength', 'apstyle'];
  }

  // explicitly define properties reflecting to attributes
  get text() {
    return this.props.text;
  }
  set text(value) { 
    this.props.text = value;
    this.updateTextContent(value);
  }
  get textlength() {
    return this.props.textlength;
  }
  set textlength(value) { 
    this.props.textlength = value;
    this.updateTextContent(this.props.text);
  }
  get apstyle() {
    return this.props.apstyle;
  }
  set apstyle(value) {
    this.props.apstyle = !!value;
    this.updateTextContent(this.props.text);
  }
  
  // attribute change
  attributeChangedCallback(property, oldValue, newValue) {
    if (property === 'textlength') {
      this.props.textlength = newValue;
      this.updateTextContent(this.props.text);
    }
  }

  mutationObserverCallback(mutations) {
    mutations.forEach((mutation) => {
      // characterData and childList mutations are for text changes
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        /**
         * @notes
         * We store the original text in `this.props.text`. If changes occur, we verify if 
         * it's due to truncation or AP style adjustments. If so, we don't update the 
         * props. However, if the new text isn't a substring of the original, we 
         * recognize it as a genuine change and update the `this.props.text`.
         */
        const newtext = mutation.target.textContent.toLowerCase().slice(0, -3);
        if (!this.props.text.toLowerCase().includes(newtext)) {
          this.props.text = mutation.target.textContent;
          this.updateTextContent(this.props.text);
        } 
      }
      
      /**
       * @notes
       * For boolean attributes, we use attribute mutations since they don't trigger 
       * the `attributeChangedCallback`. All other attribute changes are managed by the 
       * `attributeChangedCallback`.
       */
      if (mutation.type === 'attributes' && mutation.attributeName === 'apstyle') {
          this.props.apstyle = mutation.target.hasAttribute('apstyle');
          this.updateTextContent(this.props.text);
      }

      
    });
  } // end mutationObserverCallback

  connectedCallback() {
    // set the props to the current attributes
    this.props.text = this.textContent;
    this.props.textlength = this.getAttribute('textlength');
    this.props.apstyle = this.hasAttribute('apstyle');
    // and initialize textContent
    this.updateTextContent(this.props.text);
  }

  disconnectedCallback() {
    this.mutationObserver.disconnect();
  }

  truncateAfterWord (str, chars) {
    if (!chars || !str ) return str;
    return str.length < chars ? str : `${str.substr( 0, str.substr(0, chars - 3).lastIndexOf(" "))}...`;
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
  } // end apStyleTitleCase
}

// register component
customElements.define( 'truncated-aptitle', TruncatedAPTitle );