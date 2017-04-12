var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0, // Stores top, left values (edge) of the element
    DEFAULT_TEXT = 'breadfish';
var blocksDatabase = {}; // all blocks by ID. Not an array in case we decide to use md5's or something later
var allBlocks = [];
var blocksCount = 0; // not a real bumber of blocks. This value should never be
                     // decrememnted because it's used to generate a blocks' unique ID

// a more generic abstraction of a block
// it can have children, so it can be a script
function Draggy() {
  this.x = 0;
  this.y = 0;
  this.type = 'draggy';
  this.id = blocksCount++;
  blocksDatabase[this.id] = this;
  allBlocks.push(this);
  this.parent = null;
  this.children = [];
  this.attrs = [];
  this.inPalette = false;
  
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
  this.deleteDraggy = function() {
    block.removeFromParent();
    block.elem.parentElement.removeChild(block.elem);
    blocksDatabase[block.id] = null;
    allBlocks[allBlocks.indexOf(block)] = null;
  };
  this.getClosestBlock = function() {
      var el = null,
          distance,
          dx, dy,
          minDistance;
      blocks: for(let oblock of allBlocks) {
        
        if (!oblock
         || oblock.type == 'draggy'
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
        if(oblock.type == 'nullWrapperContent') {
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
  bool unmoveable
}
*/
function Block(type, name, opts) {
  if(!opts) opts = {};
  Draggy.apply(this);
  this.type = type;
  this.name = name;
  this.hasAttrs = opts.hasAttrs;
  this.hasQuickText = opts.hasQuickText;
  this.inPalette = (opts.inPalette !== undefined) ? opts.inPalette : true;
  this.unmoveable = opts.unmoveable || false;
  this.scriptInputContent = opts.scriptInputContent;
  var block = this;
  if(type == 'wrapper') {
    this.elem = document.createElement('ul');
    this.elem.classList.add('c-wrapper');
    
    this.header = document.createElement('li');
    this.header.classList.add('c-header');
    this.elem.appendChild(this.header);
    
    // add a blank draggy inside wrapper
    var nullWrapperContent = new Draggy();
    nullWrapperContent.type = 'nullWrapperContent';
    this.insertChild(nullWrapperContent, -1);
    nullWrapperContent.elem = nullWrapperContent.content = this.header;
    
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
      
      this.quickText.addEventListener('click', function(ev) {
        var newBlock = new Block('stack', 'text', {
            hasAttrs: false,
            hasQuickText: false,
            scriptInputContent: DEFAULT_TEXT,
            inPalette: false
          });
        block.insertChild(newBlock, -1);
        setFrameContent();
      });
    }
  } else if(type == 'stack') {
    this.elem = document.createElement('li');
    this.elem.classList.add('stack');
    this.header = this.elem;
  }
  this.elem.classList.add('e-' + name);
  this.elem.setAttribute('data-id', this.id);
  
  this.header.appendChild(document.createTextNode(name + ' '));
  
  if(opts.hasAttrs) {
    this.attrControls = document.createElement('span');
    this.attrControls.classList.add('attr-controls');
    
    let removeAttr = document.createElement('span');
    removeAttr.classList.add('remove-attr');
    this.attrControls.appendChild(removeAttr);
    removeAttr.addEventListener('click', function(e) {remove_attr(block)});
    
    let addAttr = document.createElement('span');
    addAttr.classList.add('add-attr');
    this.attrControls.appendChild(addAttr);
    addAttr.addEventListener('click', function(e) {add_attr(block)});
    
    this.header.appendChild(this.attrControls);
  }
  
  if(opts.scriptInputContent !== null) {
    this.scriptInput = document.createElement('span');
    this.scriptInput.classList.add('script-input');
    this.scriptInput.setAttribute('contenteditable', 'true')
    this.scriptInput.appendChild(document.createTextNode(opts.scriptInputContent));
    this.scriptInput.addEventListener('input', cleanse_contenteditable);
    this.scriptInput.addEventListener('input', function(e) {
      block.scriptInputContent = block.scriptInput.textContent;
    });
    this.header.appendChild(this.scriptInput);
  }
  
  this.clone = function(_inPalette) {
    return new Block(type, name, {
      hasAttrs: opts.hasAttrs,
      hasQuickText: opts.hasQuickText,
      scriptInputContent: opts.scriptInputContent,
      inPalette: _inPalette
    });
  };
  
  block.elem.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      
      if(opts.unmoveable) return;
      
      SCRIPT_MENU.style.display = 'block';
      SCRIPT_MENU.style.top = ev.pageY + 'px';
      SCRIPT_MENU.style.left = ev.pageX + 'px';
      RIGHT_CLICKED_SCRIPT = block;
      
      setTimeout(function() {
  			document.body.addEventListener('click', function context_blur(e2) {
          SCRIPT_MENU.style.display = 'none';
          RIGHT_CLICKED_SCRIPT = undefined;
  				document.body.removeEventListener('click', context_blur);
  			});
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
    
    this.elem.addEventListener('mousedown', function(ev) {
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
    
    this.elem.addEventListener('mouseup', function(ev) {
      trashCan = document.getElementById('trashCan');
      trashCan.classList.remove('showing');
    });
  }
  
}
Block.prototype = Object.create(Draggy.prototype);
Block.prototype.constructor = Block.constructor;

function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
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

// ancestor has parent
function parentHasClass(element, className) {
    var regex = new RegExp('\\b' + className + '\\b');
    do {
        if (element.classList !== undefined) {
            if (element.classList.contains(className)) {
                return true;
            }
        } else {
            if (regex.exec(element.className)) {
                return true;
            }
        }
        element = element.parentNode;
    } while (element);
    return false;
}

// Will be called when user starts dragging an element
function _drag_init(block, ev) {
    var elem = block.elem;
    var relativeX = ev.pageX - block.left();
    var relativeY = ev.pageY - block.top();
    // Store the object of the element which needs to be moved
    var draggy = new Draggy()
    SCRIPTING_AREA.insertBefore(draggy.elem, SCRIPTING_AREA.firstChild);
    var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
        curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
    var parent = block.parent;
    var kids = parent.children.slice();
    for(let i = block.getIndex(), child; child = kids[i]; i++) {
      child.removeFromParent();
      draggy.insertChild(child, -1);
      child.elem.removeAttribute('style');
    }
    if(parent.children.length == 0 && parent.type == 'draggy') parent.deleteDraggy();
    draggy.x = curX - relativeX;
    draggy.y = curY - relativeY;
    draggy.elem.style.left = draggy.x + 'px';
    draggy.elem.style.top = draggy.y + 'px';
    selected = draggy;
    x_elem = x_pos - selected.elem.offsetLeft;
    y_elem = y_pos - selected.elem.offsetTop;
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
    var draggy = new Draggy();
    SCRIPTING_AREA.insertBefore(draggy.elem, SCRIPTING_AREA.firstChild);
    selected = newElem;
    selectedBlock = newBlock;
    var curX = ev.clientY - getOffset(SCRIPTING_AREA).left,
        curY = ev.clientY - getOffset(SCRIPTING_AREA).top;
    draggy.insertChild(selectedBlock, -1);
    draggy.x = curX - relativeX;
    draggy.y = curY - relativeY;
    draggy.elem.style.left = draggy.x + 'px';
    draggy.elem.style.top = draggy.y + 'px';
    selected = draggy;
    x_elem = x_pos - selected.elem.offsetLeft;
    y_elem = y_pos - selected.elem.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    e.preventDefault(); // avoid selecting text or other blocks
    x_pos = document.all ? window.event.clientX : e.pageX + SCRIPTING_AREA.scrollLeft;
    y_pos = document.all ? window.event.clientY : e.pageY + SCRIPTING_AREA.scrollTop;
    var SNAP_CLASSES = currentFile.split('.').pop() == 'css' ? CSS_SNAP_CLASSES : HTML_SNAP_CLASSES;
    removeDropArea();
    if (selected !== null) {
        var el = selected.getClosestBlock();
        if (el !== null && !el.inPalette && (!el.parent || (el.parent && !el.parent.inPalette))) {
            el.elem.classList.add('drop-area');
        }
        selected.elem.style.left = (x_pos - x_elem) + 'px';
        selected.elem.style.top = (y_pos - y_elem) + 'px';
    }
}

// Destroy the object when we are done
function _destroy(ev) {
    removeDropArea();
    
    if (selected == null) return;
    var topEl = selected.getClosestBlock();
    if (topEl !== null && !topEl.inPalette && !parentHasClass(topEl.elem, 'blockArea')) {
        var kids = selected.children.slice();
        for(let child of kids) {
            child.removeFromParent();
            child.elem.removeAttribute('style');
            if(topEl.type == 'nullWrapperContent') {
                topEl.parent.insertChild(child, 1); // 0 is the null Draggy
            } else if(topEl.type == 'stack'
                   || topEl.type == 'wrapper') {
                topEl.parent.insertChild(child, topEl.getIndex() + 1);
            }
        }
        
    } else {
        if (selected.top() - getOffset(SCRIPTING_AREA).top < 0) {
            selected.elem.style.top = 0;
        }
        if (selected.left() - getOffset(SCRIPTING_AREA).left < 0) {
            selected.elem.style.left = 0;
        }
    }
    selected = null;
}

function _delete(ev) {
    var SNAP_CLASSES = currentFile.split('.').pop() == 'css' ? CSS_SNAP_CLASSES : HTML_SNAP_CLASSES;
    $(SNAP_CLASSES).each(function(item) {
         if (item.classList.contains('drop-area')) {
             item.classList.remove('drop-area');
         }
    });
    if (selected) { // TODO: make this not ugly
        selected.elem.parentNode.removeChild(selected.elem);
    }
    selected = null;
}

var HTML_SNAP_CLASSES = [
    '.stack',
    '.c-header',
    ':not(.e-body) > .c-footer'
].join(', ');
var CSS_SNAP_CLASSES = [
    '.stack',
    '.hat',
    '.c-header',
    ':not(.e-body) > .c-footer'
].join(', ');
var MIN_DISTANCE = 50;
var SCRIPTING_AREA = $('.scriptingArea')[0];
var BLOCK_PALETTE = $('.blockArea')[0];

var DRAGGABLE_ELEMENTS = ([
    '.c-wrapper:not(.e-body)',
    '.stack',
]).map(function(item) {
    return '.scriptingArea ' + item;
}).join(', ');

var C_ELEMENTS = ([
    '.c-header',
    '.c-content',
    ':not(.e-body) > .c-footer'
]).map(function(item) {
    return '.scriptingArea ' + item;
}).join(', ');

var DRAGGABLE_PALETTE_ELEMENTS = ([
    '.c-wrapper',
    '.stack',
]).map(function(item) {
    return '.blockArea ' + item;
}).join(', ');

var C_PALETTE_ELEMENTS = ([
    '.c-header',
    '.c-content',
    '.c-footer'
]).map(function(item) {
    return '.blockArea ' + item;
}).join(', ');


var bodyScript = new Draggy();
bodyScript.elem = bodyScript.content = document.querySelector('#bodyScript');
var BODY = newBlock = new Block('wrapper', 'body', {
    hasAttrs: true,
    hasQuickText: true,
    scriptInputContent: null,
    inPalette: false,
    unmoveable: true
  });
bodyScript.insertChild(BODY, -1);

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

$('body').on('mousemove', _move_elem)
    .on('mouseup', function(ev) {
        if (/* ev.target == BLOCK_PALETTE || parentHasClass(ev.target, 'blockArea') || */ ev.target.className.split(' ').indexOf('trashCan') > -1 || ev.target.className.split(' ').indexOf('trashCan2') > -1) {
            trashCan = document.getElementById('trashCan');
            trashCan.classList.remove('showing');
            _delete(ev);
	      } else {
      	    if (ev.target == BLOCK_PALETTE) {
                      trashCan = document.getElementById('trashCan');
                      trashCan.classList.remove('showing');
      	    }
            _destroy(ev);
        }
        if (!(ev.target.classList.contains('file') || parentHasClass(ev.target, 'file'))) {
            setFrameContent();
        }
        setZebra();
    }).on('input', function(ev) {
        setFrameContent();
    });

$('.context-menu.scripts .menu-item').on('click', function(ev) {
    if (RIGHT_CLICKED_SCRIPT) {
        switch (this.dataset.action) {
            case 'duplicate-script':
                // do stuff with node... and get stuff beneath it too!
                var target = RIGHT_CLICKED_SCRIPT;
                var draggy = new Draggy();
                SCRIPTING_AREA.insertBefore(draggy.elem, SCRIPTING_AREA.firstChild);
                for(let i = target.getIndex(); i < target.parent.children.length; i++) {
                  let child = target.parent.children[i];
                  draggy.insertChild(child.clone(false), -1);
                }

                var relativeX = ev.pageX - target.left();
                var relativeY = ev.pageY - target.top();
                var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
                    curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
                draggy.elem.style.left = curX - relativeX + 25 + 'px';
                draggy.elem.style.top = curY - relativeY + 25 + 'px';

                setZebra();
                RIGHT_CLICKED_SCRIPT = undefined;
                SCRIPT_MENU.style.display = 'none';
                break;

            default:
                //nothing
        }
    }
});


setZebra();

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
function zebra(parent, nestcount) {
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
        if(children[i].className.indexOf('c-wrapper') != -1) {
            children[i].classList.remove('zebra')
            if((nestcount % 2) == 1) {children[i].classList.add('zebra');}
            zebra(children[i].children[1], nestcount + 1);
        }
    }
}

function setZebra() {
    for(i = 0; i < document.querySelectorAll('.script, .draggy').length; i++) {
        zebra(document.querySelectorAll('.script, .draggy')[i], 0);
    }
}
