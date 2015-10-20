var filter = {
  type: 'search', // 'palette' or 'search'
  selectedPalette: 1,
  searchString: "im",
  paletteNames: [
    "text",
    "media"
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
          blockString = [
            '<ul class="c-wrapper e-' + block.name + '">',
              '<li class="c-header">' + block.name + ' <span class="attr-controls"><span class="remove-attr"></span><span class="add-attr"></span></span></li>',
              '<ul class="c-content">',
              '</ul>',
              '<li class="c-footer">&nbsp;</li>',
            '</ul>'
          ].join('');
        } else {
          if (block.name != 'text') {
            blockString = [
              '<li class="stack e-' + block.name + '">',
                block.name,
                "<span class='attr-controls'><span class='remove-attr'></span><span class='add-attr'></span></span>",
              '</li>'
            ].join('');
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
      name: 'a',
      type: 'wrapper',
      tags: ['link', 'a'],
      palette: 0
    },
    {
      name: 'div',
      type: 'wrapper',
      tags: ['div', 'divider', 'separator'],
      palette: 0
    },
    {
      name: 'text',
      type: 'stack',
      tags: ['text'],
      palette: 0
    },

    /* Blocks for palette 1 - Media */ 
    {
      name: 'img',
      type: 'stack',
      tags: ['image', 'img', 'picture'],
      palette: 1
    },

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

window.onload = blockFilterOnload;