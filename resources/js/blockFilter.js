// this is defined here instead of in blocks.js because this loads first.
var BLOCK_TYPES = {
  stack: 0,
  cblock: 1,
  blockWrapper: 2,
  cblockStart: 3,
  CSSStart: 4
};

var filter = {
  type: 'search', // 'palette' or 'search'
  selectedPalette: 1,
  searchString: "im",
  paletteNames: [
    "text",
    "media",
    "sections"
  ],
  getFilteredBlocks: function(){
    var matching = [];
    for(i = 0; i < filter.blocks.length; i++) {
      if (filter.type == 'palette') {
        if(filter.blocks[i].palette == filter.selectedPalette) {
          matching.push(i);
        }
      } else if (filter.type == 'search') {
        for(n = 0; n < filter.blocks[i].tags.length; n++) {
          if(filter.blocks[i].tags[n].indexOf(filter.searchString) === 0) {
            matching.push(i);
            break; // Don't show more than one of the same block, even if it has multiple tags that match
          }
        }
      }
    }
    
    return matching;
  },
  
  displayFilteredBlocks: function() {
    var blocksToDisplay = filter.getFilteredBlocks();
    var blockArea = document.getElementById("filteredBlocksArea");
    if (blocksToDisplay.length > 0) {
      blockArea.innerHTML = '';
      for(x = 0; x < blocksToDisplay.length; x++) {
        var block = filter.blocks[blocksToDisplay[x]];
        var newBlock;
        if (block.type == BLOCK_TYPES.cblock) {
          if (!block.ftype || block.ftype == 'html') {
            newBlock = new Block(block.type, block.name, {
                hasAttrs: true,
                hasQuickText: true,
                inputs: [],
                inPalette: true,
                ftype: 'html'
              });
          } else { // selector
            newBlock = new Block(block.type, block.name, {
                hasAttrs: false,
                hasQuickText: false,
                inputs: [''], // \u00A0
                inPalette: true,
                ftype: 'css'
              });
          }
        } else { // block.type == 'stack'
          if (block.name != 'text') {
            if (!block.ftype || block.ftype == 'html') {
              newBlock = new Block(block.type, block.name, {
                  hasAttrs: true,
                  hasQuickText: false,
                  inputs: [],
                  inPalette: true,
                  ftype: 'html'
                });
            } else { // rule
              newBlock = new Block(block.type, block.name, {
                  hasAttrs: false,
                  hasQuickText: false,
                  inputs: ['', ''], // \u00A0
                  inPalette: true,
                  ftype: 'css'
                });;
            }
          } else {
            newBlock = new Block(BLOCK_TYPES.stack, 'text', {
                hasAttrs: false,
                hasQuickText: false,
                inputs: [DEFAULT_TEXT],
                inPalette: true,
                ftype: 'html  '
              });
          }
        }
        blockArea.appendChild(newBlock.elem);
      }
    } else {
      blockArea.innerHTML = "<span class='infoText'>No blocks were found.</span>";
    }
  },
  
  /* Block Object:
  Has two things - name and tags.
  name = string for human-readable element name (ex. an <a> tag would have a name of "link")
  tags = tags to use in the block search. All punctuation will be stripped from the search input, so a tag of "img" will match a search of "<img>". There is no limit to the number of tags a block can have.
  palette = the numerical id of the palette to which the block belongs. Counting starts at 0. */
  
  blocks: [

    /* Blocks for palette 0 - text */
    {
      // Moved text node to top because it is basically the most used block
      name: 'text',
      type: BLOCK_TYPES.stack,
      tags: ['text'],
      palette: 0
    },
    {
      name: 'h1',
      type: BLOCK_TYPES.cblock,
      tags: ['heading', 'h1'],
      palette: 0
    },
    {
      name: 'h2',
      type: BLOCK_TYPES.cblock,
      tags: ['heading', 'h2'],
      palette: 0
    },
    {
      name: 'h3',
      type: BLOCK_TYPES.cblock,
      tags: ['heading', 'h3'],
      palette: 0
    },
    {
      name: 'p',
      type: BLOCK_TYPES.cblock,
      tags: ['p', 'paragraph'],
      palette: 0
    },
    {
      name: 'span',
      type: BLOCK_TYPES.cblock,
      tags: ['span'],
      palette: 0
    },
    {
      name: 'pre',
      type: BLOCK_TYPES.cblock,
      tags: ['pre', 'code'],
      palette: 0
    },
    {
      name: 'code',
      type: BLOCK_TYPES.cblock,
      tags: ['code'],
      palette: 0
    },
    {
      name: 'a',
      type: BLOCK_TYPES.cblock,
      tags: ['link', 'a'],
      palette: 0
    },
    {
      name: 'abbr',
      type: BLOCK_TYPES.cblock,
      tags: ['abbrevation', 'abbr'],
      palette: 0
    },
    {
      name: 'b',
      type: BLOCK_TYPES.cblock,
      tags: ['bold', 'b'],
      palette: 0
    },
    {
      name: 'i',
      type: BLOCK_TYPES.cblock,
      tags: ['italics', 'i'],
      palette: 0
    },
    {
      name: 'strong',
      type: BLOCK_TYPES.cblock,
      tags: ['strong'],
      palette: 0
    },
    {
      name: 'em',
      type: BLOCK_TYPES.cblock,
      tags: ['em', 'emphasis'],
      palette: 0
    },
    {
      name: 'mark',
      type: BLOCK_TYPES.cblock,
      tags: ['marker', 'mark', 'highlighted'],
      palette: 0
    },
    {
      name: 'del',
      type: BLOCK_TYPES.cblock,
      tags: ['deleted', 'del', 'update', 'edit'],
      palette: 0
    },
    {
      name: 'ins',
      type: BLOCK_TYPES.cblock,
      tags: ['inserted', 'ins', 'update', 'edit'],
      palette: 0
    },
    {
      name: 'sub',
      type: BLOCK_TYPES.cblock,
      tags: ['subtext', 'sub'],
      palette: 0
    },
    {
      name: 'sup',
      type: BLOCK_TYPES.cblock,
      tags: ['supertext', 'sup'],
      palette: 0
    },
    {
      name: 'kbd',
      type: BLOCK_TYPES.cblock,
      tags: ['keyboard', 'input', 'kbd'],
      palette: 0
    },
    {
      name: 'samp',
      type: BLOCK_TYPES.cblock,
      tags: ['sample', 'output', 'samp'],
      palette: 0
    },
    {
      name: 'var',
      type: BLOCK_TYPES.cblock,
      tags: ['variable', 'var'],
      palette: 0
    },
    {
      name: 'ol',
      type: BLOCK_TYPES.cblock,
      tags: ['lists', 'ordered list', 'ol'],
      palette: 0
    },
    {
      name: 'ul',
      type: BLOCK_TYPES.cblock,
      tags: ['lists', 'unordered list', 'ul'],
      palette: 0
    },
    {
      name: 'li',
      type: BLOCK_TYPES.cblock,
      tags: ['lists', 'list item', 'li'],
      palette: 0
    },

    /* Blocks for palette 1 - Media */ 
    {
      name: 'img',
      type: BLOCK_TYPES.stack,
      tags: ['image', 'img', 'picture'],
      palette: 1
    },
    {
      name: 'CSS',
      type: BLOCK_TYPES.stack,
      tags: ['css', 'style', 'link'],
      palette: 1
    },
    {
      name: 'audio',
      type: BLOCK_TYPES.cblock,
      tags: ['audio'],
      palette: 1
    },
    {
      name: 'video',
      type: BLOCK_TYPES.cblock,
      tags: ['video'],
      palette: 1
    },
    {
      name: 'object',
      type: BLOCK_TYPES.cblock,
      tags: ['object', 'flash', 'plugin'],
      palette: 1
    },
    {
      name: 'track',
      type: BLOCK_TYPES.stack,
      tags: ['audio', 'track'],
      palette: 1
    },
    {
      name: 'source',
      type: BLOCK_TYPES.stack,
      tags: ['audio', 'video', 'source'],
      palette: 1
    },
    {
      name: 'param',
      type: BLOCK_TYPES.stack,
      tags: ['object', 'flash', 'plugin', 'paramater', 'param'],
      palette: 1
    },
    
    /* Blocks for palette 2 - Sections */
    {
      name: 'div',
      type: BLOCK_TYPES.cblock,
      tags: ['div', 'divider', 'separator'],
      palette: 2
    },
    {
      name: 'navigation',
      type: BLOCK_TYPES.cblock,
      tags: ['nav', 'navigation'],
      palette: 2
    },
    {
      name: 'footer',
      type: BLOCK_TYPES.cblock,
      tags: ['footer', 'foot' /* can i addz feet plz?*/],
      palette: 2
    },
    {
      name: 'article',
      type: BLOCK_TYPES.cblock,
      tags: ['article'],
      palette: 2
    },

    /* Blocks for palette 3 - Tables */
    {
      name: 'table',
      type: BLOCK_TYPES.cblock,
      tags: ['table'],
      palette: 3
    },
    {
      name: 'caption',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'caption', 'title'],
      palette: 3
    },
    {
      name: 'tbody',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'body', 'tbody'],
      palette: 3
    },
    {
      name: 'thead',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'head', 'header', 'thead'],
      palette: 3
    },
    {
      name: 'tfoot',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'foot', 'footer', 'tfoot'],
      palette: 3
    },
    {
      name: 'tr',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'row', 'tr'],
      palette: 3
    },
    {
      name: 'td',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'cell', 'td'],
      palette: 3
    },
    {
      name: 'th',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'cell', 'th', 'head', 'header'],
      palette: 3
    },
    {
      name: 'col',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'column', 'col'],
      palette: 3
    },
    {
      name: 'colgroup',
      type: BLOCK_TYPES.cblock,
      tags: ['table', 'column', 'colgroup'],
      palette: 3
    },

    /* Blocks for palette 4 - forms */
    {
      name: 'form',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'form'],
      palette: 4
    },
    {
      name: 'input',
      type: BLOCK_TYPES.stack,
      tags: ['forms', 'input'],
      palette: 4
    },
    {
      name: 'output',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'output'],
      palette: 4
    },
    {
      name: 'button',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'button'],
      palette: 4
    },
    {
      name: 'select',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'options', 'select'],
      palette: 4
    },
    {
      name: 'option',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'options', 'option'],
      palette: 4
    },
    {
      name: 'datalist',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'options', 'datalist'],
      palette: 4
    },
    {
      name: 'fieldset',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'fieldset', 'fields'],
      palette: 4
    },
    {
      name: 'legend',
      type: BLOCK_TYPES.cblock,
      tags: ['forms', 'fields', 'legend'],
      palette: 4
    },

    /* Blocks for CSS */
    {
      name: 'selector',
      type: BLOCK_TYPES.cblock,
      tags: ['selection', 'selector'],
      palette: 7,
      ftype: 'css'
    },
    {
      name: 'rule',
      type: BLOCK_TYPES.stack,
      tags: ['rule'],
      palette: 7,
      ftype: 'css'
    }
  ]
};

function handleSearchChange() {
  filter.type = "search";
  filter.searchString = document.getElementById("searchBar").value;
  filter.displayFilteredBlocks();
}

function handlePaletteClick() {
  filter.selectedPalette = (this.dataset ? this.dataset.num : 0);
  filter.type = "palette";
  filter.displayFilteredBlocks();
}

function blockFilterOnload() { // ew multiple onloads
  var searchBarElement = document.getElementById("searchBar");
  
  // Overkill? Maybe. Better safe than sorry.
  //searchBarElement.onkeypress = handleSearchChange;
  searchBarElement.onkeyup = handleSearchChange;
  searchBarElement.onpaste = handleSearchChange;
  
  
  var paletteButtons = document.getElementsByClassName("paletteOptionWrap");
  for(var i = 0; i < paletteButtons.length; i++) {
      var buttonElem = paletteButtons[i];
      buttonElem.onclick = handlePaletteClick;
  }
  handlePaletteClick();
};
