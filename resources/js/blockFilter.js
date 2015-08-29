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
        blockArea.innerHTML += filter.blocks[blocksToDisplay[x]].htmlString;
      }
    } else {
      blockArea.innerHTML = "<span class='infoText'>No blocks were found.</span>";
    }
  },
  
  /* Block Object:
  Has three things - name, htmlString, and tags.
  name = string for human-readable element name (ex. an <a> tag would have a name of "link")
  htmlString = the html that corresponds with this block in OUR code. This is what is added to the area where blocks are dragged out from. It is NOT the html that the block will compile to.
  tags = tags to use in the block search. All punctuation will be stripped from the search input, so a tag of "img" will match a search of "<img>". There is no limit to the number of tags a block can have.
  palette = the numerical id of the palette to which the block belongs. Counting starts at 0. */
  
  blocks: [

    /* Blocks for palette 0 - text */
    {
      name: 'h1',
      htmlString: "<li class='stack e-h1'>heading 1 with text <span contenteditable='true' class='script-input text'>An Important Heading</span></li>",
      tags: ['heading', 'h1'],
      palette: 0
    },
    {
      name: 'h2',
      htmlString: "<li class='stack e-h2'>heading 2 with text <span contenteditable='true' class='script-input text'>A Less Important Heading</span></li>",
      tags: ['heading', 'h2'],
      palette: 0
    },
    {
      name: 'h3',
      htmlString: "<li class='stack e-h3'>heading 3 with text <span contenteditable='true' class='script-input text'>An Even Less Important Heading</span></li>",
      tags: ['heading', 'h3'],
      palette: 0
    },
    {
      name: 'a',
      htmlString: "<li class='stack e-a'>link to <span contenteditable='true' class='script-input href'>https://google.com/</span> with text <span contenteditable='true' class='script-input text'>link</span></li>",
      tags: ['link', 'a'],
      palette: 0
    },
    {
      name: 'div',
      htmlString: "<ul class='c-wrapper e-div'><li class='c-header'>div with class(es) <span contenteditable='true' class='script-input class'></span></li><ul class='c-content'></ul><li class='c-footer'>&nbsp;</li></ul>",
      tags: ['div', 'divider', 'separator'],
      palette: 0
    },
    {
      name: 'text',
      htmlString: "<li class='stack e-text'><span contenteditable='true' class='script-input text'>breadfish.gif</span></li>",
      tags: ['text'],
      palette: 0
    },

    /* Blocks for palette 1 - Media */ 
    {
      name: 'img',
      htmlString: "<li class='stack e-img'>image with source <span contenteditable='true' class='script-input src'>myImg.gif</span> and class(es) <span contenteditable='true' class='script-input class'></span></li>",
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

window.onload = function() {
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
