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
        var blockString;
        if (block.type == 'wrapper') {
          if (!block.ftype || block.ftype == 'html') {
            blockString = [
              '<ul class="c-wrapper e-' + block.name + '">',
                '<li class="c-header">' + block.name + ' <span class="attr-controls"><span class="remove-attr"></span><span class="add-attr"></span></span></li>',
                '<ul class="c-content">',
                '</ul>',
                '<li class="c-footer">&nbsp;</li>',
              '</ul>'
            ].join('');
          } else {
            blockString = [
              '<ul class="c-wrapper e-' + block.name + '">',
                '<li class="c-header">' + block.name + ' <span class="script-input" contenteditable="true">&nbsp;</span></li>',
                '<ul class="c-content">',
                '</ul>',
                '<li class="c-footer">&nbsp;</li>',
              '</ul>'
            ].join('');
          }
        } else {
          if (block.name != 'text') {
            if (!block.ftype || block.ftype == 'html') {
              blockString = [
                '<li class="stack e-' + block.name + '">',
                  block.name,
                  "<span class='attr-controls'><span class='remove-attr'></span><span class='add-attr'></span></span>",
                '</li>'
              ].join('');
            } else {
              blockString = [
                '<li class="stack e-' + block.name + '">',
                  block.name,
                  ' <span class="script-input css-attr-dropdown" contenteditable="true"></span>: <span class="script-input" contenteditable="true"></span>',
                '</li>'
              ].join('');
            }
          } else {
            blockString = '<li class="stack e-text"><span contenteditable="true" class="script-input text">breadfish.gif</span></li>';
          }
        }
        blockArea.innerHTML += blockString;
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
      type: 'stack',
      tags: ['text'],
      palette: 0
    },
    {
      name: 'h1',
      type: 'wrapper',
      tags: ['heading', 'h1'],
      palette: 0
    },
    {
      name: 'h2',
      type: 'wrapper',
      tags: ['heading', 'h2'],
      palette: 0
    },
    {
      name: 'h3',
      type: 'wrapper',
      tags: ['heading', 'h3'],
      palette: 0
    },
    {
      name: 'p',
      type: 'wrapper',
      tags: ['p', 'paragraph'],
      palette: 0
    },
    {
      name: 'span',
      type: 'wrapper',
      tags: ['span'],
      palette: 0
    },
    {
      name: 'pre',
      type: 'wrapper',
      tags: ['pre', 'code'],
      palette: 0
    },
    {
      name: 'code',
      type: 'wrapper',
      tags: ['code'],
      palette: 0
    },
    {
      name: 'a',
      type: 'wrapper',
      tags: ['link', 'a'],
      palette: 0
    },
    {
      name: 'abbr',
      type: 'wrapper',
      tags: ['abbrevation', 'abbr'],
      palette: 0
    },
    {
      name: 'b',
      type: 'wrapper',
      tags: ['bold', 'b'],
      palette: 0
    },
    {
      name: 'i',
      type: 'wrapper',
      tags: ['italics', 'i'],
      palette: 0
    },
    {
      name: 'strong',
      type: 'wrapper',
      tags: ['strong'],
      palette: 0
    },
    {
      name: 'em',
      type: 'wrapper',
      tags: ['em', 'emphasis'],
      palette: 0
    },
    {
      name: 'mark',
      type: 'wrapper',
      tags: ['marker', 'mark', 'highlighted'],
      palette: 0
    },
    {
      name: 'del',
      type: 'wrapper',
      tags: ['deleted', 'del', 'update', 'edit'],
      palette: 0
    },
    {
      name: 'ins',
      type: 'wrapper',
      tags: ['inserted', 'ins', 'update', 'edit'],
      palette: 0
    },
    {
      name: 'sub',
      type: 'wrapper',
      tags: ['subtext', 'sub'],
      palette: 0
    },
    {
      name: 'sup',
      type: 'wrapper',
      tags: ['supertext', 'sup'],
      palette: 0
    },
    {
      name: 'kbd',
      type: 'wrapper',
      tags: ['keyboard', 'input', 'kbd'],
      palette: 0
    },
    {
      name: 'samp',
      type: 'wrapper',
      tags: ['sample', 'output', 'samp'],
      palette: 0
    },
    {
      name: 'var',
      type: 'wrapper',
      tags: ['variable', 'var'],
      palette: 0
    },
    {
      name: 'ol',
      type: 'wrapper',
      tags: ['lists', 'ordered list', 'ol'],
      palette: 0
    },
    {
      name: 'ul',
      type: 'wrapper',
      tags: ['lists', 'unordered list', 'ul'],
      palette: 0
    },
    {
      name: 'li',
      type: 'wrapper',
      tags: ['lists', 'list item', 'li'],
      palette: 0
    },

    /* Blocks for palette 1 - Media */ 
    {
      name: 'img',
      type: 'stack',
      tags: ['image', 'img', 'picture'],
      palette: 1
    },
    {
      name: 'CSS',
      type: 'stack',
      tags: ['css', 'style', 'link'],
      palette: 1
    },
    {
      name: 'audio',
      type: 'wrapper',
      tags: ['audio'],
      palette: 1
    },
    {
      name: 'video',
      type: 'wrapper',
      tags: ['video'],
      palette: 1
    },
    {
      name: 'object',
      type: 'wrapper',
      tags: ['object', 'flash', 'plugin'],
      palette: 1
    },
    {
      name: 'track',
      type: 'stack',
      tags: ['audio', 'track'],
      palette: 1
    },
    {
      name: 'source',
      type: 'stack',
      tags: ['audio', 'video', 'source'],
      palette: 1
    },
    {
      name: 'param',
      type: 'stack',
      tags: ['object', 'flash', 'plugin', 'paramater', 'param'],
      palette: 1
    },
    
    /* Blocks for palette 2 - Sections */
    {
      name: 'div',
      type: 'wrapper',
      tags: ['div', 'divider', 'separator'],
      palette: 2
    },
    {
      name: 'navigation',
      type: 'wrapper',
      tags: ['nav', 'navigation'],
      palette: 2
    },
    {
      name: 'footer',
      type: 'wrapper',
      tags: ['footer', 'foot' /* can i addz feet plz?*/],
      palette: 2
    },
    {
      name: 'article',
      type: 'wrapper',
      tags: ['article'],
      palette: 2
    },

    /* Blocks for palette 3 - Tables */
    {
      name: 'table',
      type: 'wrapper',
      tags: ['table'],
      palette: 3
    },
    {
      name: 'caption',
      type: 'wrapper',
      tags: ['table', 'caption', 'title'],
      palette: 3
    },
    {
      name: 'tbody',
      type: 'wrapper',
      tags: ['table', 'body', 'tbody'],
      palette: 3
    },
    {
      name: 'thead',
      type: 'wrapper',
      tags: ['table', 'head', 'header', 'thead'],
      palette: 3
    },
    {
      name: 'tfoot',
      type: 'wrapper',
      tags: ['table', 'foot', 'footer', 'tfoot'],
      palette: 3
    },
    {
      name: 'tr',
      type: 'wrapper',
      tags: ['table', 'row', 'tr'],
      palette: 3
    },
    {
      name: 'td',
      type: 'wrapper',
      tags: ['table', 'cell', 'td'],
      palette: 3
    },
    {
      name: 'th',
      type: 'wrapper',
      tags: ['table', 'cell', 'th', 'head', 'header'],
      palette: 3
    },
    {
      name: 'col',
      type: 'wrapper',
      tags: ['table', 'column', 'col'],
      palette: 3
    },
    {
      name: 'colgroup',
      type: 'wrapper',
      tags: ['table', 'column', 'colgroup'],
      palette: 3
    },

    /* Blocks for palette 4 - forms */
    {
      name: 'form',
      type: 'wrapper',
      tags: ['forms', 'form'],
      palette: 4
    },
    {
      name: 'input',
      type: 'stack',
      tags: ['forms', 'input'],
      palette: 4
    },
    {
      name: 'output',
      type: 'wrapper',
      tags: ['forms', 'output'],
      palette: 4
    },
    {
      name: 'button',
      type: 'wrapper',
      tags: ['forms', 'button'],
      palette: 4
    },
    {
      name: 'select',
      type: 'wrapper',
      tags: ['forms', 'options', 'select'],
      palette: 4
    },
    {
      name: 'option',
      type: 'wrapper',
      tags: ['forms', 'options', 'option'],
      palette: 4
    },
    {
      name: 'datalist',
      type: 'wrapper',
      tags: ['forms', 'options', 'datalist'],
      palette: 4
    },
    {
      name: 'fieldset',
      type: 'wrapper',
      tags: ['forms', 'fieldset', 'fields'],
      palette: 4
    },
    {
      name: 'legend',
      type: 'wrapper',
      tags: ['forms', 'fields', 'legend'],
      palette: 4
    },

    /* Blocks for CSS */
    {
      name: 'selector',
      type: 'wrapper',
      tags: ['selection', 'selector'],
      palette: 7,
      ftype: 'css'
    },
    {
      name: 'rule',
      type: 'stack',
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
  filter.selectedPalette = this.dataset.num;
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
  
  filter.displayFilteredBlocks();
};
