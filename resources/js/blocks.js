var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

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

function closestElem(elem, offset, initial) { //elem is nodelist, offset is own offset
    var el = null,
        elOffset,
        x = offset.x, //x is my own offset
        y = offset.y, //y is my own offset
        distance,
        dx, dy,
        minDistance;
    elem.each( function(item) {
        if(item == selected) {return false;} // I added this -NN
        elOffset = getOffset(item); //returns object with offsets
        
        //let's only test the bottom-left corner
        dx = elOffset.left - x; 
        dy = elOffset.bottom - y;
        distance = Math.sqrt((dx*dx) + (dy*dy)); //dist to each corner
        if (distance <= MIN_DISTANCE && initial != item && !isDescendant(initial, item) && (minDistance === undefined || distance < minDistance)) {
            minDistance = distance;
            el = item;
        }
    });
    return el;
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
function _drag_init(elem, ev) {
    var relativeX = ev.pageX - getOffset(elem).left;
    var relativeY = ev.pageY - getOffset(elem).top;
    // Store the object of the element which needs to be moved
    var wrapper = document.createElement("ul");
    wrapper.classList.add('draggy');
    SCRIPTING_AREA.insertBefore(wrapper, SCRIPTING_AREA.firstChild);
    selected = elem;
    var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
        curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
    var childs = Array.prototype.slice.call(elem.parentElement.children);
    for(var i = childs.indexOf(elem); i < childs.length; i++) {
        childs[i].removeAttribute('style');
        wrapper.appendChild(childs[i]);
    }
    wrapper.style.left = curX - relativeX + 'px';
    wrapper.style.top = curY - relativeY + 'px';
    selected = wrapper;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

function _palette_drag_init(elem, ev) {
    var relativeX = ev.clientY - getOffset(elem).left - SCRIPTING_AREA.scrollLeft;
    var relativeY = ev.clientY - getOffset(elem).top + BLOCK_PALETTE.scrollTop - SCRIPTING_AREA.scrollTop;
    // Clone element
    var newElem = elem.cloneNode(true);
    newElem.classList.remove('paletteBlock');
    // Store the object of the element which needs to be moved
    var wrapper = document.createElement("ul");
    wrapper.classList.add('draggy');
    SCRIPTING_AREA.insertBefore(wrapper, SCRIPTING_AREA.firstChild);
    selected = newElem;
    var curX = ev.clientY - getOffset(SCRIPTING_AREA).left,
        curY = ev.clientY - getOffset(SCRIPTING_AREA).top;
    wrapper.appendChild(newElem);
    wrapper.style.left = curX - relativeX + 'px';
    wrapper.style.top = curY - relativeY + 'px';
    selected = wrapper;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX + SCRIPTING_AREA.scrollLeft;
    y_pos = document.all ? window.event.clientY : e.pageY + SCRIPTING_AREA.scrollTop;
    if (selected !== null) {
        $(SNAP_CLASSES).each(function(item) {
            if (item.classList.contains('drop-area')) {
                item.classList.remove('drop-area');
            }
        });
        var el = closestElem(
            $(SNAP_CLASSES),
            {
                y: getOffset(selected).top,
                x: getOffset(selected).left
            },
            selected
        )
        if (el !== null && !el.classList.contains('paletteBlock') && !parentHasClass(el, 'paletteBlock') && !parentHasClass(el, 'blockArea')) {
            el.classList.add('drop-area');
        }
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}

// Destroy the object when we are done
function _destroy(ev) {
    $(SNAP_CLASSES).each(function(item) {
       if (item.classList.contains('drop-area')) {
           item.classList.remove('drop-area');
       }
    });
    var topEl = null;
    if (selected !== null) {
        topEl = closestElem(
            $(SNAP_CLASSES),
            {
                y: getOffset(selected).top,
                x: getOffset(selected).left
            },
            selected
        );
    }
    if (topEl !== null && !topEl.classList.contains('paletteBlock') && !parentHasClass(topEl, 'paletteBlock') && !parentHasClass(topEl, 'blockArea')) {
        for(var i = selected.children.length - 1; i >= 0; i--) {
            // for one reason for/in desn't work here;
            var elem = selected.children[i];
            if (topEl.classList.contains('stack')) {
                elem.removeAttribute('style');
                topEl.parentNode.insertBefore(elem, topEl.nextElementSibling);   
            } else if (topEl.classList.contains('c-header')) {
                elem.removeAttribute('style');
                topEl.nextElementSibling.insertBefore(elem, topEl.nextElementSibling.firstElementChild);
            } else if (topEl.classList.contains('c-footer')) {
                elem.removeAttribute('style');
                topEl.parentNode.parentNode.insertBefore(elem, topEl.parentNode.nextElementSibling);
            }
        }
        selected.parentNode.removeChild(selected);
    } else {
        if (selected !== null) {
            if (getOffset(selected).top - getOffset(SCRIPTING_AREA).top < 0) {
                selected.style.top = 0;
            }
            if (getOffset(selected).left - getOffset(SCRIPTING_AREA).left < 0) {
                selected.style.left = 0;
            }
        }
    }
    selected = null;
}

function _delete(ev) {
    $(SNAP_CLASSES).each(function(item) {
       if (item.classList.contains('drop-area')) {
           item.classList.remove('drop-area');
       }
    });
    selected.parentNode.removeChild(selected);
    selected = null;
}

var SNAP_CLASSES = [
    '.stack',
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

BLOCK_PALETTE.addEventListener('mousedown', function(ev) {
    if (ev.target.className =='script-input') {
        ev.stopPropagation();
        return;
    }
    if (ev.target.matches(DRAGGABLE_PALETTE_ELEMENTS)) {
        _palette_drag_init(ev.target, ev);
        ev.stopPropagation();
        setZebra();
    } else if (ev.target.matches(C_PALETTE_ELEMENTS)) {
        _palette_drag_init(ev.target.parentElement, ev);
        ev.stopPropagation();
        setZebra();
    }
    setFrameContent();
});

SCRIPTING_AREA.addEventListener('mousedown', function(ev) {
    if (ev.which != 3) {  // shouldn't do anything on right click
        if (ev.target.className =='script-input') {
            ev.stopPropagation();
            return;
        }
        if (ev.target.matches(DRAGGABLE_ELEMENTS)) {
            _drag_init(ev.target, ev);
            ev.stopPropagation();
            setZebra();
        } else if (ev.target.matches(C_ELEMENTS)) {
            if (!ev.target.parentNode.classList.contains('e-body')) {
                _drag_init(ev.target.parentElement, ev);
                ev.stopPropagation();
                setZebra();
            }
        }
        setFrameContent();
        SCRIPT_MENU.style.display = 'none';
        RIGHT_CLICKED_SCRIPT = undefined;
    }
});

SCRIPTING_AREA.addEventListener('contextmenu', function(ev) {
    if (ev.target.matches(DRAGGABLE_ELEMENTS) || ev.target.parentNode.matches(DRAGGABLE_ELEMENTS)) {
        SCRIPT_MENU.style.display = 'block';
        SCRIPT_MENU.style.top = ev.pageY + 'px';
        SCRIPT_MENU.style.left = ev.pageX + 'px';
        RIGHT_CLICKED_SCRIPT = ev.target;
        ev.preventDefault();
    }
});

var SCRIPT_MENU = document.querySelector('.context-menu.scripts');
var RIGHT_CLICKED_SCRIPT = undefined;

$('body').on('mousemove', _move_elem)
    .on('mouseup', function(ev) {
        if (ev.target == BLOCK_PALETTE || parentHasClass(ev.target, 'blockArea') || ev.target.className.split(' ').indexOf('trashCan') > -1) {
            _delete(ev);
        } else {
            _destroy(ev);
        }
        if (!(ev.target.classList.contains('file') || parentHasClass(ev.target, 'file'))) {
            setFrameContent();
        }
        setZebra();
    }).on('keydown', function(ev) {
        setFrameContent();
    });

$('.context-menu.scripts .menu-item').on('click', function(ev) {
    if (RIGHT_CLICKED_SCRIPT) {
        switch (this.dataset.action) {
            case 'duplicate-script':
                var target = RIGHT_CLICKED_SCRIPT;
                // context menu stuff here...
                if (target.matches(C_ELEMENTS)) {
                    console.log(target.parentNode);
                    target = target.parentNode;
                } 
                // do stuff with node... and get stuff beneath it too!
                var wrapper = document.createElement('ul');
                wrapper.className = 'draggy';
                var childs = toArr(target.parentElement.children);
                for (var i = childs.indexOf(target); i < childs.length; i++) {
                    var child = childs[i].cloneNode(true);
                    child.removeAttribute('style');
                    wrapper.appendChild(child);
                }

                var relativeX = ev.pageX - getOffset(target).left;
                var relativeY = ev.pageY - getOffset(target).top;
                var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
                    curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
                wrapper.style.left = curX - relativeX + 25 + 'px';
                wrapper.style.top = curY - relativeY + 25 + 'px';
                SCRIPTING_AREA.insertBefore(wrapper, SCRIPTING_AREA.firstChild);

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

$('.trashCan').on('mouseover', function(ev) {
    this.classList.add('hovering');
});
$('.trashCan').on('mouseout', function(ev) {
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
