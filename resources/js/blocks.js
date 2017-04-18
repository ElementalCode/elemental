var selected = null, // Object of the element to be moved
    mousePos = {x: 0, y: 0}, // Stores x & y coordinates of the mouse pointer
    dragOffset = {x: 0, y: 0}, // Stores offset between dragged element and mouse
    DEFAULT_TEXT = 'breadfish',
    SCRIPTING_AREA = $('.scriptingArea')[0];
var blocksDatabase, // all blocks by ID. Not an array in case we decide to use md5's or something later
    scriptBlocks,
    topLevelBlocks,
    blocksCount = 0; // not a real number of blocks. This value should never be
                     // decrememnted because it's used to generate a block's unique ID
clearBlocks();
replaceBody();

// a more generic abstraction of a block
// it can have children, so it can be a script
function BlockWrapper(inPalette) {
  this.x = 0;
  this.y = 0;
  this.type = BLOCK_TYPES.blockWrapper;
  this.id = blocksCount++;
  blocksDatabase[this.id] = this;
  this.parent = null;
  this.children = [];
  this.attrs = [];
  this.inputs = [];
  this.inPalette = inPalette;
  if(!this.inPalette) scriptBlocks.push(this);
  
  this.elem = document.createElement('ul');
  this.elem.classList.add('draggy');
  this.content = this.elem;
  
  var block = this;
  this.getIndex = function() {
    if(block.parent) {
      return block.parent.children.indexOf(block);
    } else {
      return null;
    }
  };
  this.insertChild = function(child, index) {
    if(index == -1 || index > block.children.length - 1) {
      block.children.push(child);
      block.content.appendChild(child.elem);
    } else {
      block.content.insertBefore(child.elem, block.children[index].elem);
      block.children.splice(index, 0, child);
    }
    child.parent = block;
  };
  this.removeFromParent = function() {
    if(!block.parent) return;
    block.parent.children.splice(block.parent.children.indexOf(block), 1);
    block.parent = null;
  };
  this.deleteBlock = function() {
    block.removeFromParent();
    block.elem.parentElement.removeChild(block.elem);
    let child;
    while(child = block.children.pop()) child.deleteBlock();
    let attr;
    while(attr = block.attrs.pop()) attr.deleteAttr();
    let input;
    while(input = block.inputs.pop()) input.deleteInput();
    
    if(block.type == BLOCK_TYPES.stack
    || block.type == BLOCK_TYPES.cblock) {
      if(block.block_context_menu) block.elem.removeEventListener('contextmenu', block.block_context_menu);
      if(block.block_mouse_down) block.elem.removeEventListener('mousedown', block.block_mouse_down);
      if(block.block_mouse_up) block.elem.removeEventListener('mouseup', block.block_mouse_up);
      if(block.add_quicktext) block.quickText.removeEventListener('click', block.add_quicktext);
      if(block.add_attr_ev) block.addAttr.removeEventListener('click', block.add_attr_ev);
      if(block.remove_attr_ev) block.removeAttr.removeEventListener('click', block.remove_attr_ev);
    }
    
    blocksDatabase[block.id] = null;
    let index1 = scriptBlocks.indexOf(block);
    if(index1 != -1) scriptBlocks[index1] = null;
    let index2 = topLevelBlocks.indexOf(block);
    if(index2 != -1) topLevelBlocks[index2] = null;
    
    let keys = Object.keys(block).slice();
    for(let key of keys) delete block[key];
  };
  this.getClosestBlock = function() {
      var el = null,
          distance,
          dx, dy,
          minDistance;
      blocks: for(let oblock of scriptBlocks) {
        if (!oblock
         || oblock.type == BLOCK_TYPES.blockWrapper
         || oblock.unmoveable) continue blocks;
        // check for descendancy
        let pblock = block;
        while(pblock) {
          if (pblock == oblock
           || pblock.children.indexOf(oblock) != -1) continue blocks;
          pblock = pblock.parent;
        }
        pblock = oblock;
        while(pblock) {
          if (pblock == block
           || pblock.children.indexOf(block) != -1) continue blocks;
          pblock = pblock.parent;
        }
        
        //let's only test the bottom-left corner
        dx = oblock.left() - block.left();
        dy = oblock.bottom() - block.top();
        
        // move point inside c-blocks to the right
        if(oblock.type == BLOCK_TYPES.cblockStart) {
          dx += oblock.content.style.paddingLeft;
        }
        
        distance = Math.sqrt((dx*dx) + (dy*dy)); //dist to each corner
        if (distance <= MIN_DISTANCE && (minDistance === undefined || distance < minDistance)) {
            minDistance = distance;
            el = oblock;
        }
      }
      return el;
  };
  
  this.left = function() {
    var elem = block.elem;
    var offsetLeft = 0;
    do {
        if ( !isNaN( elem.offsetLeft ) )
        {
            offsetLeft += elem.offsetLeft;
        }
    } while( elem = elem.offsetParent );
    return offsetLeft;
  };
  
  this.top = function() {
    var elem = block.elem;
    var offsetTop = 0;
    do {
        if ( !isNaN( elem.offsetTop ) )
        {
            offsetTop += elem.offsetTop;
        }
    } while( elem = elem.offsetParent );
    return offsetTop;
  };
  
  this.right = function() {
    return block.left() + block.elem.offsetWidth;
  };
  
  this.bottom = function() {
    return block.top() + block.elem.offsetHeight;
  };
  
  this.setPosition = function(x, y) {
    block.x = x;
    block.y = y;
    block.elem.style.left = block.x + 'px';
    block.elem.style.top = block.y + 'px';
  }
  
  this.toStringable = function() {
    var dummyBlock = {};
    var keysToAvoid = [
      'parent',
      'children',
      'attrs'
    ]
    for(let key in block) {
      if(typeof block[key] != 'function' // I know JSON does this automatically, shhh
      && !(block[key] instanceof Element) // seemed like a good idea
      && keysToAvoid.indexOf(key) == -1) dummyBlock[key] = block[key];
    }
    dummyBlock.attrs = [];
    for(let attr of block.attrs) {
      dummyBlock.attrs.push(attr.toStringable());
    }
    dummyBlock.children = [];
    for(let child of block.children) {
      dummyBlock.children.push(child.toStringable());
    }
    dummyBlock.inputs = [];
    for(let input of block.inputs) {
      dummyBlock.inputs.push(input.value);
    }
    return dummyBlock;
  };
  this.toString = function() {
    return JSON.stringify(block.toStringable());
  };
}
/* 
opts = {
  bool hasAttrs,
  bool hasQuickText,
  string|null scriptInputContent,
  bool inPalette = true,
  bool unmoveable,
  string ftype,
  array[string] inputs
}
*/
function Block(type, name, opts) {
  if(!opts) opts = {};
  BlockWrapper.apply(this, [opts.inPalette]);
  this.type = type;
  this.name = name;
  this.ftype = opts.ftype || 'html';
  this.hasAttrs = opts.hasAttrs;
  this.hasQuickText = opts.hasQuickText;
  this.inPalette = (opts.inPalette !== undefined) ? opts.inPalette : true;
  this.unmoveable = opts.unmoveable || false;
  var block = this;
  if(type == BLOCK_TYPES.cblock) {
    this.elem = document.createElement('ul');
    this.elem.classList.add('c-wrapper');
    
    this.header = document.createElement('li');
    this.header.classList.add('c-header');
    this.elem.appendChild(this.header);
    
    // add a blank blockWrapper inside cblock
    var cblockStart = new BlockWrapper(this.inPalette);
    cblockStart.type = BLOCK_TYPES.cblockStart;
    this.insertChild(cblockStart, -1);
    cblockStart.elem = cblockStart.content = this.header;
    
    this.content = document.createElement('ul');
    this.content.classList.add('c-content');
    this.elem.appendChild(this.content);
    
    var footer = document.createElement('ul');
    footer.classList.add('c-footer');
    this.elem.appendChild(footer);
    
    if(opts.hasQuickText) {
      this.quickText = document.createElement('li');
      this.quickText.classList.add('c-quicktext');
      this.quickText.appendChild(document.createTextNode('Aa'))
      footer.appendChild(this.quickText);
      
      this.quickText.addEventListener('click', block.add_quicktext = function(ev) {
        var newBlock = new Block(BLOCK_TYPES.stack, 'text', {
            hasAttrs: false,
            hasQuickText: false,
            inputs: [DEFAULT_TEXT],
            inPalette: false
          });
        block.insertChild(newBlock, -1);
        setFrameContent();
      });
    }
  } else if(type == BLOCK_TYPES.stack) {
    this.elem = document.createElement('li');
    this.elem.classList.add('stack');
    this.header = this.elem;
  }
  this.elem.classList.add('e-' + name);
  this.elem.setAttribute('data-id', this.id);
  if(name != 'text') this.header.appendChild(document.createTextNode(name + ' '));
  
  if(opts.hasAttrs) {
    this.attrControls = document.createElement('span');
    this.attrControls.classList.add('attr-controls');
    
    this.removeAttr = document.createElement('span');
    this.removeAttr.classList.add('remove-attr');
    this.attrControls.appendChild(this.removeAttr);
    this.removeAttr.addEventListener('click', block.remove_attr_ev = function(e) {
      var attr = block.attr.pop();
  		block.header.removeChild(attr.elem);
    });
    
    this.addAttr = document.createElement('span');
    this.addAttr.classList.add('add-attr');
    this.attrControls.appendChild(this.addAttr);
    this.addAttr.addEventListener('click', block.add_attr_ev = function(e) {
      var attr = new BlockAttribute();
  		block.header.insertBefore(attr.elem, block.attrControls);
  		block.attrs.push(attr);
    });
    
    this.header.appendChild(this.attrControls);
  }
  
  if(opts.inputs) {
    if (opts.inputs.length == 1) { // text and selector
      (new BlockInput(opts.inputs[0])).attachToBlock(block);
    } else if (opts.inputs.length == 2) { // rule
      let dropdown = new BlockInput(opts.inputs[0]);
      dropdown.attachToBlock(block);
      attachAttrSearch(dropdown.elem, cssAttrNames, function(value) {
    		dropdown.elem.textContent = dropdown.value = value;
    	})
      
      this.header.appendChild(document.createTextNode(':\u00A0'));
      (new BlockInput(opts.inputs[1])).attachToBlock(block);
    }
  }
  
  this.clone = function(_inPalette) {
    return new Block(type, name, {
      hasAttrs: opts.hasAttrs,
      hasQuickText: opts.hasQuickText,
      inputs: opts.inputs,
      inPalette: _inPalette
    });
  };
  
  block.elem.addEventListener('contextmenu', block.block_context_menu = function(ev) {
      ev.preventDefault();
      if(block.inPalette || block.unmoveable) return false;
      
      SCRIPT_MENU.style.display = 'block';
      SCRIPT_MENU.style.top = ev.pageY + 'px';
      SCRIPT_MENU.style.left = ev.pageX + 'px';
      RIGHT_CLICKED_SCRIPT = block;
      
      setTimeout(function() {
  			document.body.addEventListener('click', function() {
          SCRIPT_MENU.style.display = 'none';
          RIGHT_CLICKED_SCRIPT = undefined;
  			}, {once: true});
  		}, 0);
      
  });
  
  if(!opts.unmoveable) {
    let testBlockContents = function(elem) {
      var BLOCK_CONTENTS = [
        'script-input',
        'c-quicktext',
        'attr-controls',
        'attr-holder'
      ];
      var loops = 4;
      while(elem && loops--) {
        for(let content of BLOCK_CONTENTS) {
          if(elem.classList.contains(content)) return true;
        }
        elem = elem.parentNode;
      }
      return false;
    }
    
    this.elem.addEventListener('mousedown', block.block_mouse_down = function(ev) {
      if (ev.which == 3
      || testBlockContents(ev.target)) return;
      ev.stopPropagation();
      if(block.inPalette) {
        _palette_drag_init(block, ev);
      } else {
        _drag_init(block, ev);
        trashCan = document.getElementById('trashCan');
        trashCan.classList.add('showing');
      }
      setZebra();
      setFrameContent();
    });
    
    this.elem.addEventListener('mouseup', block.block_mouse_up = function(ev) {
      trashCan = document.getElementById('trashCan');
      trashCan.classList.remove('showing');
    });
  }
  
}
Block.prototype = Object.create(BlockWrapper.prototype);
Block.prototype.constructor = Block.constructor;

function BlockInput(defaultValue) {
  if (defaultValue === undefined || defaultValue === null) {
    this.value = ''; // \u00A0
  } else {
    this.value = defaultValue;
  }
  this.elem = document.createElement('span');
  this.elem.classList.add('script-input');
  this.elem.setAttribute('contenteditable', 'true')
  this.elem.appendChild(document.createTextNode(this.value));
  this.elem.addEventListener('input', cleanse_contenteditable);
  
  var input = this;
  this.elem.addEventListener('input', input.on_input = function(e) {
    input.value = input.elem.textContent;
  });
  
  this.attachToBlock = function(block) {
    block.header.appendChild(input.elem);
    block.inputs.push(input);
  };
  this.deleteInput = function() {
    this.elem.removeEventListener('input', input.on_input);
    if(this.elem.parent) this.elem.parent.removeChild(this.elem);
  }
}

function removeDropArea() {
  let dropArea;
  while(dropArea = document.querySelector('.drop-area')) {
    dropArea.classList.remove('drop-area');
  };
}

function getOffset( elem ) {
    var offsetLeft = (function(elem) {
        var offsetLeft = 0;
        do {
            if ( !isNaN( elem.offsetLeft ) )
            {
                offsetLeft += elem.offsetLeft;
            }
        } while( elem = elem.offsetParent );
        return offsetLeft;
    })(elem);
    
    var offsetTop = (function(elem) {
        var offsetTop = 0;
        do {
            if ( !isNaN( elem.offsetTop ) )
            {
                offsetTop += elem.offsetTop;
            }
        } while( elem = elem.offsetParent );
        return offsetTop;
    })(elem);
    
    var offsetRight = offsetLeft + elem.offsetWidth; //sure, want coords not distances
    
    var offsetBottom = offsetTop + elem.offsetHeight;
    
    return {left: offsetLeft, top:offsetTop, right:offsetRight, bottom:offsetBottom};
    
}

// Will be called when user starts dragging an element
function _drag_init(block, ev) {
    var elem = block.elem;
    var relativeX = ev.pageX - block.left();
    var relativeY = ev.pageY - block.top();
    // Store the object of the element which needs to be moved
    var blockWrapper = new BlockWrapper()
    SCRIPTING_AREA.insertBefore(blockWrapper.elem, SCRIPTING_AREA.firstChild);
    var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
        curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
    topLevelBlocks.push(blockWrapper);
    var parent = block.parent;
    var kids = parent.children.slice(block.getIndex());
    for(let child of kids) {
      child.removeFromParent();
      blockWrapper.insertChild(child, -1);
      child.setPosition(0,0);
    }
    if(parent.children.length == 0 && parent.type == BLOCK_TYPES.blockWrapper) parent.deleteBlock();
    blockWrapper.setPosition(curX - relativeX, curY - relativeY);
    selected = blockWrapper;
    dragOffset.x = mousePos.x - selected.elem.offsetLeft;
    dragOffset.y = mousePos.y - selected.elem.offsetTop;
}

function _palette_drag_init(block, ev) {
    var elem = block.elem;
    var relativeX = ev.clientY - block.left() - SCRIPTING_AREA.scrollLeft;
    var relativeY = ev.clientY - block.top() + BLOCK_PALETTE.scrollTop - SCRIPTING_AREA.scrollTop;
    // Clone element
    var newBlock = block.clone(false);
    var newElem = newBlock.elem;
    newElem.classList.remove('paletteBlock');
    // Store the object of the element which needs to be moved
    var blockWrapper = new BlockWrapper();
    topLevelBlocks.push(blockWrapper);
    SCRIPTING_AREA.insertBefore(blockWrapper.elem, SCRIPTING_AREA.firstChild);
    selected = newElem;
    selectedBlock = newBlock;
    var curX = ev.clientY - getOffset(SCRIPTING_AREA).left,
        curY = ev.clientY - getOffset(SCRIPTING_AREA).top;
    blockWrapper.insertChild(selectedBlock, -1);
    blockWrapper.setPosition(curX - relativeX, curY - relativeY);
    selected = blockWrapper;
    dragOffset.x = mousePos.x - selected.elem.offsetLeft;
    dragOffset.y = mousePos.y - selected.elem.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    e.preventDefault(); // avoid selecting text or other blocks
    mousePos.x = e.pageX + SCRIPTING_AREA.scrollLeft;
    mousePos.y = e.pageY + SCRIPTING_AREA.scrollTop;
    removeDropArea();
    if (selected !== null) {
        var el = selected.getClosestBlock();
        if (el !== null) {
            if(el.type == BLOCK_TYPES.CSSStart) {
              document.querySelector('#mainScript > li.hat').classList.add('drop-area');
            } else {
              el.elem.classList.add('drop-area');
            }
        }
        selected.setPosition(mousePos.x - dragOffset.x, mousePos.y - dragOffset.y);
    }
}

// Destroy the object when we are done
function _destroy(ev) {
    removeDropArea();
    
    if (selected == null) return;
    var topEl = selected.getClosestBlock();
    if (topEl !== null) {
        var kids = selected.children.slice().reverse();
        for(let child of kids) {
            child.removeFromParent();
            child.setPosition(0,0)
            if(topEl.type == BLOCK_TYPES.cblockStart) {
                topEl.parent.insertChild(child, 1); // 0 is the null BlockWrapper
            } else if(topEl.type == BLOCK_TYPES.stack
                   || topEl.type == BLOCK_TYPES.cblock
                   || topEl.type == BLOCK_TYPES.CSSStart) {
                topEl.parent.insertChild(child, topEl.getIndex() + 1);
            }
        }
        
    } else {
        let newX = selected.x,
            newY = selected.y;
        if (selected.left() - getOffset(SCRIPTING_AREA).left < 0) {
            newX = 0;
        }
        if (selected.top() - getOffset(SCRIPTING_AREA).top < 0) {
            newY = 0;
        }
        selected.setPosition(newX, newY);
    }
    selected = null;
}

var MIN_DISTANCE = 50;
var BLOCK_PALETTE = $('.blockArea')[0];

function clearBlocks(hat) {
  blocksDatabase = {};
  scriptBlocks = [];
  topLevelBlocks = [];
  let child;
  if(BODY) BODY.deleteBlock();
  BODY = mainScript = undefined;
  SCRIPTING_AREA.innerHTML = `<ul class="script" id="mainScript"><li class="hat">${hat || 'DOCTYPE html'}</li></ul>`;
}

var BODY, mainScript;
function replaceBody(bodyBlock) {
  mainScript = new BlockWrapper();
  mainScript.elem = mainScript.content = document.querySelector('#mainScript');
  if(bodyBlock) {
    BODY = bodyBlock;
  } else {
    BODY = new Block(BLOCK_TYPES.cblock, 'body', {
        hasAttrs: true,
        hasQuickText: true,
        inPalette: false,
        unmoveable: true
      });
  }
  mainScript.insertChild(BODY, -1);
  topLevelBlocks.push(BODY);
  setZebra();
}

function cleanse_contenteditable (ev) {
    if(ev.target.innerHTML != ev.target.textContent) {
      var caretPos = 0,
        sel, range;
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        var children = ev.target.childNodes;
        var keepLooping = true;
        for(let i = 0; keepLooping; i++) {
          if(children[i] == range.commonAncestorContainer || children[i] == range.commonAncestorContainer.parentNode) {
            caretPos += range.endOffset;
            keepLooping = false;
          } else if(!children[i]) {
            keepLooping = false;
          } else {
            caretPos += children[i].textContent.length;
          }
        }
        ev.target.innerHTML = ev.target.textContent;
        range = document.createRange();
        range.setStart(ev.target.childNodes[0], caretPos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
}

var SCRIPT_MENU = document.querySelector('.context-menu.scripts');
var RIGHT_CLICKED_SCRIPT = undefined;

$('body')
    .on('mousemove', _move_elem)
    .on('mouseup', function(ev) {
        if (ev.target.classList.contains('trashCan') || ev.target.classList.contains('trashCan2')) {
            trashCan = document.getElementById('trashCan');
            trashCan.classList.remove('showing');
            removeDropArea();
            if (selected) {
              selected.deleteBlock()
            }
            selected = null;
	      } else {
      	    if (ev.target == BLOCK_PALETTE) {
                trashCan = document.getElementById('trashCan');
                trashCan.classList.remove('showing');
      	    }
            _destroy(ev);
        }
        if (!(ev.target.classList.contains('file')
              || ev.target.classList.contains('file-name'))) {
            setFrameContent();
        }
        setZebra();
    })
    .on('input', function(ev) {
        setFrameContent();
    });

$('.context-menu.scripts .menu-item')
    .on('click', function(ev) {
        if (RIGHT_CLICKED_SCRIPT) {
            switch (this.dataset.action) {
                case 'duplicate-script':
                    // do stuff with node... and get stuff beneath it too!
                    var target = RIGHT_CLICKED_SCRIPT;
                    var blockWrapper = new BlockWrapper();
                    SCRIPTING_AREA.insertBefore(blockWrapper.elem, SCRIPTING_AREA.firstChild);
                    topLevelBlocks.push(blockWrapper);
                    for(let i = target.getIndex(); i < target.parent.children.length; i++) {
                      let child = target.parent.children[i];
                      blockWrapper.insertChild(child.clone(false), -1);
                    }

                    var relativeX = ev.pageX - target.left();
                    var relativeY = ev.pageY - target.top();
                    var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
                        curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
                    blockWrapper.setPosition(curX - relativeX + 25, curY - relativeY + 25)

                    setZebra();
                    RIGHT_CLICKED_SCRIPT = undefined;
                    SCRIPT_MENU.style.display = 'none';
                    break;

                default:
                    //nothing
            }
        }
    });

document.getElementById('trashCan').addEventListener('mouseover', function(ev) {
    this.classList.add('hovering');
});

document.getElementById('trashCan').addEventListener('mouseout', function(ev) {
    this.classList.remove('hovering');
});

document.getElementById('trashCan2').addEventListener('mouseover', function(ev) {
    this.classList.add('hovering');
});

document.getElementById('trashCan2').addEventListener('mouseout', function(ev) {
    this.classList.remove('hovering');
});

// zebra stuff
function setZebra() {
  function zebra(block, nestcount) {
    if(block.type == BLOCK_TYPES.cblock) {
      block.elem.classList.remove('zebra');
      if((nestcount % 2) == 1) block.elem.classList.add('zebra');
    }
    for(let child of block.children) {
      zebra(child, nestcount + 1);
    }
  }
  
  for(let block of topLevelBlocks) {
    if(block) zebra(block, block.type == BLOCK_TYPES.blockWrapper ? 1 : 0);
  }
}
