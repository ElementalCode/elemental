# htmlparser-to-html

Converts the JSON that [htmlparser](https://npmjs.org/package/htmlparser) (and probably [htmlparser2](https://npmjs.org/package/htmlparser2)) produces back to HTML.

Useful if you're doing some sort of transformation.

Tests are based on reversing the parser tests in htmlparser, so they are quite comprehensive.

## API

Returns a single function `html(tree, [parent, mapFn])` which returns a html string.

Optionally, you can apply a function to each element just before they are converted to HTML - for example, converting items that are not in the right format into htmlparser-compatible input.

- `tree`: a tree structure produced by htmlparser
- `parent`: optional param - a parent element, only used for the `mapFn`.
- `mapFn`: a function(item, parent) that is applied to each element just before the element is converted into html. The parent parameter is either the original value of the parent (default: null), or the parent element of this child element.

## Usage

    var html = require('htmlparser-to-html');

    console.log(html([
            {   type: 'tag'
              , name: 'html'
              , children:
                 [ { type: 'tag'
                   , name: 'title'
                   , children: [ { data: 'The Title', type: 'text' } ]
                   }
                 , { type: 'tag'
                   , name: 'body'
                   , children: [ { data: 'Hello world', type: 'text' } ]
                   }
                 ]
              }
            ]));

    // outputs: <html><title>The Title</title><body>Hello world</body></html>

Of course, you probably want to generate the array from htmlparser.



