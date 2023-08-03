# TruncatedAPTitle 
Extends the HTML span element with a couple of unique attributes: apstyle and textlength.

The TruncatedAPTitle web component applies AP title case styling to the text within it and trims it down to the specified length

[![npm: version][npm-badge]][npm-url]
[![license: ISC][license-badge]][license-url]

## Installation
```bash
npm install titleblock
```
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
[MIT](https://github.com/wernerglinka/titleblock/blob/main/LICENSE)

## Author
[Werner Glinka](werner@glinka.co)

[npm-badge]: https://img.shields.io/npm/v/titleblock.svg
[npm-url]: https://www.npmjs.com/package/titleblock
[license-badge]: https://img.shields.io/github/license/wernerglinka/titleblock
[license-url]: LICENSE