# TruncatedAPTitle 
Custom element with a couple of unique attributes: apstyle and textlength.

Safari doesn't support customized built-in element! Version 1.0.0 is now an autonomous custom element. It does not require the use of a webcomponents polyfill.

The TruncatedAPTitle web component applies AP title case styling to the text within it and trims it down to the specified length

[![npm: version][npm-badge]][npm-url]
[![license: ISC][license-badge]][license-url]

## Installation
```bash
npm install truncatedaptitle
```
**Important**: Since `truncatedaptitle` relies on a child for its initial setup, e.g. the textContent, we need to insure that the document is fully parsed before the `truncatedaptitle` constructor is called. This is done by adding the `defer` attribute to the script tag that loads the `truncatedaptitle` module. The `defer` attribute specifies that the script is downloaded in parallel to parsing the page, and executed after the page has finished parsing.

## Usage
```html
<truncated-aptitle apstyle textlength="30">Headline goes here</truncated-aptitle>
```
## Attributes
| Attribute | Type | Description |
| --- | --- | --- |
| textlength | String | The string length |
| apstyle | boolean | If present, the title will be converted to AP Title Case. |

## License
[MIT](https://github.com/wernerglinka/truncatedaptitle/blob/main/LICENSE)

## Author
[Werner Glinka](werner@glinka.co)

[npm-badge]: https://img.shields.io/npm/v/@wernerglinka/truncatedaptitle.svg
[npm-url]: https://www.npmjs.com/package/@wernerglinka/truncatedaptitle
[license-badge]: https://img.shields.io/github/license/wernerglinka/truncatedaptitle
[license-url]: LICENSE