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
    {
      name: 'image',
      htmlString: "<li class='stack e-text paletteBlock'>image titled <span contenteditable='true' class='script-input text'>myImg.gif</span></li>",
      tags: ['image', 'img', 'picture'],
      palette: 1
    },
    {
      name: 'link',
      htmlString: "<li class='stack e-text paletteBlock'>link to <span contenteditable='true' class='script-input text'>https://google.com/</span></li>",
      tags: ['link', 'a'],
      palette: 0
    },
    {
      name: 'div',
      htmlString: "<ul class='c-wrapper e-div paletteBlock'><li class='c-header'>div</li><ul class='c-content'></ul><li class='c-footer'></li></ul>",
      tags: ['div', 'divider', 'seperator'],
      palette: 0
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